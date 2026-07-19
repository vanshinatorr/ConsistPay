const PlatformLinkage = require("../models/PlatformLinkage");
const Submission = require("../models/Submission");
const User = require("../models/User");
const LeetCodeProvider = require("../providers/LeetCodeProvider");
const GFGProvider = require("../providers/GFGProvider");
const Code360Provider = require("../providers/Code360Provider");
const { getLocalFallbackDetails } = require("../utils/dsaHelper");
const { syncUserStreak } = require("../utils/streakHelper");
const { createNotification } = require("../controllers/notificationController");

function getProvider(platform) {
  if (platform === "LeetCode") return LeetCodeProvider;
  if (platform === "GeeksforGeeks" || platform === "GFG") return GFGProvider;
  if (platform === "Code360") return Code360Provider;
  throw new Error(`Platform "${platform}" is not supported.`);
}

class PlatformService {
  /**
   * 1. Initiate Linkage
   * Generates a verification token and sets status to unverified.
   */
  async initiateLinkage(userId, platform, username) {
    if (!platform || !username) {
      throw new Error("Platform and username are required.");
    }

    const normalizedUsername = username.trim();

    // Ensure the external account is not already verified and linked to another user
    const existingVerified = await PlatformLinkage.findOne({
      platform,
      username: normalizedUsername,
      isVerified: true,
    });
    if (existingVerified) {
      throw new Error(`The ${platform} username "${normalizedUsername}" is already linked and verified with another account.`);
    }

    // Generate a unique 6-digit verification code to include in the bio
    let prefix = "LEET";
    if (platform === "GeeksforGeeks" || platform === "GFG") prefix = "GFG";
    if (platform === "Code360") prefix = "CODE360";
    const verificationToken = `CP-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Upsert the linkage (if an unverified record exists for this user/platform, update it)
    let linkage = await PlatformLinkage.findOne({ userId, platform });

    if (linkage) {
      if (linkage.isVerified) {
        throw new Error(`You have already successfully linked and verified a ${platform} account (${linkage.username}).`);
      }
      linkage.username = normalizedUsername;
      linkage.verificationToken = verificationToken;
      await linkage.save();
    } else {
      linkage = await PlatformLinkage.create({
        userId,
        platform,
        username: normalizedUsername,
        verificationToken,
        isVerified: false,
      });
    }

    return {
      username: linkage.username,
      platform: linkage.platform,
      verificationToken: linkage.verificationToken,
      isVerified: linkage.isVerified,
    };
  }

  /**
   * 2. Verify Account Ownership
   * Queries LeetCode profile bio and matches it with the generated token.
   */
  async verifyOwnership(userId, platform) {
    const linkage = await PlatformLinkage.findOne({ userId, platform });
    if (!linkage) {
      throw new Error("No linkage request found. Please link your account first.");
    }
    if (linkage.isVerified) {
      return { message: "Account is already linked and verified.", username: linkage.username };
    }

    const provider = getProvider(platform);
    const userProfile = await provider.fetchProfile(linkage.username);
    const aboutMe = userProfile.profile?.aboutMe || "";
    const isMatch = aboutMe.includes(linkage.verificationToken);

    if (!isMatch) {
      throw new Error(`Verification token "${linkage.verificationToken}" was not found in your ${platform} profile bio ("About Me"). Please update your bio and try again.`);
    }

    // Success! Update linkage state
    const acSubmissionNum = userProfile.submitStatsGlobal?.acSubmissionNum || [];
    const allAc = acSubmissionNum.find(a => a.difficulty === "All");
    const easyAc = acSubmissionNum.find(a => a.difficulty === "Easy");
    const mediumAc = acSubmissionNum.find(a => a.difficulty === "Medium");
    const hardAc = acSubmissionNum.find(a => a.difficulty === "Hard");

    linkage.totalSolved = allAc ? allAc.count : 0;
    linkage.easySolved = easyAc ? easyAc.count : (platform === "GeeksforGeeks" || platform === "GFG" ? (allAc ? allAc.count : 0) : 0);
    linkage.mediumSolved = mediumAc ? mediumAc.count : 0;
    linkage.hardSolved = hardAc ? hardAc.count : 0;

    // Fetch badges for LeetCode
    if (platform === "LeetCode") {
      try {
        const badges = await LeetCodeProvider.fetchUserBadges(linkage.username);
        linkage.badges = badges;
      } catch (badgeErr) {
        console.warn("[PlatformService] Failed to fetch LeetCode badges during verification:", badgeErr.message);
      }
    }

    linkage.isVerified = true;
    linkage.verifiedAt = new Date();
    await linkage.save();

    // Trigger initial sync to pull historical solves instantly
    try {
      await this.syncDailySolve(userId, platform);
    } catch (syncErr) {
      console.warn("[PlatformService] Initial verification sync failed:", syncErr.message);
    }

    // Automatically complete user onboarding since they linked their account successfully
    const user = await User.findById(userId);
    if (user && !user.onboardingComplete) {
      user.onboardingComplete = true;
      user.onboardingCompletedAt = new Date();
      await user.save();
      console.log(`[PlatformService] Onboarding automatically completed for user ${userId} post ${platform} verification.`);
    }

    return {
      message: "Account ownership verified successfully!",
      username: linkage.username,
      platform: linkage.platform,
    };
  }

  /**
   * 3. Sync Daily Solve Streak
   * Fetches daily solves, registers them, updates streak counts, and processes payouts.
   */
  async syncDailySolve(userId, platform, targetTimeZone = "Asia/Kolkata") {
    const linkage = await PlatformLinkage.findOne({ userId, platform, isVerified: true });
    if (!linkage) {
      throw new Error(`No verified ${platform} profile connected to this account.`);
    }

    // Cooldown verification (30 seconds) to prevent external API rate-limiting and server spamming
    const now = new Date();
    const cooldownMs = 30000; // 30 seconds
    if (linkage.lastSyncedAt) {
      const timeElapsed = now.getTime() - new Date(linkage.lastSyncedAt).getTime();
      if (timeElapsed < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - timeElapsed) / 1000);
        throw new Error(`Sync requested too quickly. Please wait ${remainingSec} second(s) before retrying.`);
      }
    }

    const provider = getProvider(platform);

    let solveStatus = { solvedToday: false, solvedCount: 0, problems: [], allSubmissions: [] };
    let historicalCalendar = {};
    let userProfile = null;

    if (platform === "GeeksforGeeks" || platform === "GFG") {
      // GFG Provider fetches profile inside fetchDailySolveStatus and returns it to avoid scraping twice!
      solveStatus = await provider.fetchDailySolveStatus(linkage.username, targetTimeZone);
      userProfile = solveStatus.profile;
    } else {
      // LeetCode: fetch all in parallel (massive speedup)
      const results = await Promise.all([
        provider.fetchDailySolveStatus(linkage.username, targetTimeZone).catch(err => {
          console.error("LeetCode fetchDailySolveStatus failed:", err);
          return { solvedToday: false, solvedCount: 0, problems: [], allSubmissions: [] };
        }),
        provider.fetchUserCalendar(linkage.username).catch(err => {
          console.error("LeetCode fetchUserCalendar failed:", err);
          return {};
        }),
        provider.fetchProfile(linkage.username).catch(err => {
          console.error("LeetCode fetchProfile failed:", err);
          return null;
        })
      ]);
      solveStatus = results[0];
      historicalCalendar = results[1];
      userProfile = results[2];
    }

    // Keep lifetime solved count updated in linkage
    if (userProfile) {
      try {
        const acSubmissionNum = userProfile.submitStatsGlobal?.acSubmissionNum || [];
        
        const allAc = acSubmissionNum.find(a => a.difficulty === "All");
        const easyAc = acSubmissionNum.find(a => a.difficulty === "Easy");
        const mediumAc = acSubmissionNum.find(a => a.difficulty === "Medium");
        const hardAc = acSubmissionNum.find(a => a.difficulty === "Hard");

        if (allAc) {
          linkage.totalSolved = allAc.count;
        }
        linkage.easySolved = easyAc ? easyAc.count : (platform === "GeeksforGeeks" || platform === "GFG" ? (allAc ? allAc.count : 0) : 0);
        linkage.mediumSolved = mediumAc ? mediumAc.count : 0;
        linkage.hardSolved = hardAc ? hardAc.count : 0;

        // Fetch and cache badges for LeetCode
        if (platform === "LeetCode") {
          try {
            const badges = await LeetCodeProvider.fetchUserBadges(linkage.username);
            linkage.badges = badges;
          } catch (badgeErr) {
            console.warn("[PlatformService] Failed to fetch LeetCode badges during daily sync:", badgeErr.message);
          }
        }

        await linkage.save();
      } catch (err) {
        console.warn(`[PlatformService] Failed to update totalSolved count during sync for ${platform}:`, err.message);
      }
    }

    let userObj = await User.findById(userId);
    if (!userObj) {
      throw new Error("User profile not found.");
    }

    // Plan expiry validation (mirroring core rules)
    const now = new Date();
    const planExpiresAt = userObj.planExpiresAt ? new Date(userObj.planExpiresAt) : null;
    const graceEnd = planExpiresAt ? new Date(planExpiresAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null;
    const isCompletelyExpired = graceEnd && now > graceEnd;

    if (isCompletelyExpired) {
      if (userObj.plan === "pro") {
        userObj.plan = "free";
        await userObj.save();
      }
      const Challenge = require("../models/Challenge");
      const activeChallenge = await Challenge.findOne({
        status: "active",
        $or: [{ creatorId: userId }, { opponentId: userId }]
      });
      if (!activeChallenge) {
        throw new Error("Your plan has expired and you have no active battles. Please renew your plan to resume coding!");
      }
    }

    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // Format: YYYY-MM-DD

    // 1. Count existing completed submissions today
    const preSyncCount = await Submission.countDocuments({
      userId,
      date: todayStr,
      status: "completed",
    });

    const isFirstSubmissionToday = preSyncCount === 0;
    let newSolvesRecorded = 0;

    // 3. Save new solves to the database (including historical submissions in the recent 20 list!)
    const allRecentList = solveStatus.allSubmissions || [];
    for (const problem of allRecentList) {
      // Check if submission was already recorded
      const existing = await Submission.findOne({ submissionId: problem.submissionId });
      if (!existing) {
        // Run local classifier for metadata (topics, difficulty, recommendation, etc.)
        const metadata = getLocalFallbackDetails(problem.title);

        await Submission.create({
          userId,
          problemName: problem.title,
          platform,
          date: problem.dateStr, // Save under the actual date it was solved!
          status: "completed",
          topic: metadata.topic || "General DSA",
          difficulty: metadata.difficulty || "Easy",
          recommendation: metadata.recommendation || "Keep practicing problems daily.",
          motivationLine: metadata.motivationLine || "One compile at a time.",
          accepted: true,
          submissionId: problem.submissionId,
          verificationMethod: "auto",
          verificationStatus: "verified",
        });

        // Only count as "new solves recorded today" if it was solved today!
        if (problem.dateStr === todayStr) {
          newSolvesRecorded++;
        }
        console.log(`[PlatformService] Solved problem recorded historically/today: ${problem.title} (ID: ${problem.submissionId}) on date ${problem.dateStr}`);
      }
    }

    // 3.5. Record historical calendar submissions to light up their Consistency Calendar completely
    const timestamps = Object.keys(historicalCalendar);
    for (const timestampStr of timestamps) {
      const ts = parseInt(timestampStr);
      if (isNaN(ts)) continue;

      // Convert Unix seconds to YYYY-MM-DD
      const dateObj = new Date(ts * 1000);
      const dateStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: targetTimeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(dateObj);

      // Check if we already have a submission on this day
      const existingDaySub = await Submission.findOne({
        userId,
        date: dateStr
      });

      if (!existingDaySub) {
        // Create a historical practice placeholder submission so the calendar tile lights up green!
        await Submission.create({
          userId,
          problemName: `${platform} Practice`,
          platform,
          date: dateStr,
          status: "completed",
          topic: `${platform} Practice`,
          difficulty: "Easy",
          recommendation: "Keep practicing daily.",
          motivationLine: "One solve at a time.",
          accepted: true,
          submissionId: `${platform.toLowerCase()}-hist-${ts}`,
          verificationMethod: "auto",
          verificationStatus: "verified"
        });
      }
    }

    // 4. Run the retroactive streak and payout engine
    userObj = await syncUserStreak(userObj);

    const postSyncCount = preSyncCount + newSolvesRecorded;

    if (postSyncCount > 0 && isFirstSubmissionToday) {
      const hasActivePlan = userObj.planExpiresAt && new Date() <= new Date(userObj.planExpiresAt);
      await createNotification(
        userId,
        "Submission Synced! 🚀",
        hasActivePlan ? "Your daily solve was synced and payout secured." : "Daily solve synced for active battles.",
        "streak"
      );
    }

    linkage.lastSyncedAt = new Date();
    await linkage.save();

    return {
      solvedToday: postSyncCount > 0,
      solvedCount: postSyncCount,
      newSolvesCount: newSolvesRecorded,
      streak: userObj.streak,
    };
  }

  /**
   * Get connection linkage details for a user
   */
  async getLinkage(userId, platform) {
    const linkage = await PlatformLinkage.findOne({ userId, platform });
    if (!linkage) return null;
    return {
      username: linkage.username,
      isVerified: linkage.isVerified,
      verificationToken: linkage.verificationToken,
      verifiedAt: linkage.verifiedAt,
      totalSolved: linkage.totalSolved || 0,
      badges: linkage.badges || [],
    };
  }

  /**
   * Delete unverified linkage (allowing user to change typo username)
   */
  async deleteLinkage(userId, platform) {
    const linkage = await PlatformLinkage.findOne({ userId, platform });
    if (linkage) {
      if (linkage.isVerified) {
        throw new Error("Cannot delete a verified profile linkage.");
      }
      await PlatformLinkage.deleteOne({ _id: linkage._id });
    }
    return { message: "Linkage cleared successfully." };
  }
}

module.exports = new PlatformService();
