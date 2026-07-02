const PlatformLinkage = require("../models/PlatformLinkage");
const Submission = require("../models/Submission");
const User = require("../models/User");
const LeetCodeProvider = require("../providers/LeetCodeProvider");
const { getLocalFallbackDetails } = require("../utils/dsaHelper");
const { syncUserStreak } = require("../utils/streakHelper");
const { createNotification } = require("../controllers/notificationController");

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
      throw new Error(`The LeetCode username "${normalizedUsername}" is already linked and verified with another account.`);
    }

    // Generate a unique 6-digit verification code to include in the bio
    const verificationToken = `CP-LEET-${Math.floor(100000 + Math.random() * 900000)}`;

    // Upsert the linkage (if an unverified record exists for this user/platform, update it)
    let linkage = await PlatformLinkage.findOne({ userId, platform });

    if (linkage) {
      if (linkage.isVerified) {
        throw new Error(`You have already successfully linked and verified a LeetCode account (${linkage.username}).`);
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

    const userProfile = await LeetCodeProvider.fetchProfile(linkage.username);
    const aboutMe = userProfile.profile?.aboutMe || "";
    const isMatch = aboutMe.includes(linkage.verificationToken);

    if (!isMatch) {
      throw new Error(`Verification token "${linkage.verificationToken}" was not found in your LeetCode profile bio ("About Me"). Please update your bio and try again.`);
    }

    // Success! Update linkage state
    const acSubmissionNum = userProfile.submitStatsGlobal?.acSubmissionNum || [];
    const allAc = acSubmissionNum.find(a => a.difficulty === "All");
    linkage.totalSolved = allAc ? allAc.count : 0;
    linkage.isVerified = true;
    linkage.verifiedAt = new Date();
    await linkage.save();

    // Automatically complete user onboarding since they linked their account successfully
    const user = await User.findById(userId);
    if (user && !user.onboardingComplete) {
      user.onboardingComplete = true;
      user.onboardingCompletedAt = new Date();
      await user.save();
      console.log(`[PlatformService] Onboarding automatically completed for user ${userId} post LeetCode verification.`);
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
      throw new Error("No verified LeetCode profile connected to this account.");
    }

    // Fetch daily status from LeetCode
    const solveStatus = await LeetCodeProvider.fetchDailySolveStatus(linkage.username, targetTimeZone);

    // Keep lifetime solved count updated in linkage
    try {
      const userProfile = await LeetCodeProvider.fetchProfile(linkage.username);
      const acSubmissionNum = userProfile.submitStatsGlobal?.acSubmissionNum || [];
      const allAc = acSubmissionNum.find(a => a.difficulty === "All");
      if (allAc) {
        linkage.totalSolved = allAc.count;
        await linkage.save();
      }
    } catch (err) {
      console.warn("[PlatformService] Failed to update totalSolved count during sync:", err.message);
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

    // 1. Sync user streaks to process missed days up to yesterday
    userObj = await syncUserStreak(userObj);

    // 2. Count existing completed submissions today
    const preSyncCount = await Submission.countDocuments({
      userId,
      date: todayStr,
      status: "completed",
    });

    const isFirstSubmissionToday = preSyncCount === 0;
    let newSolvesRecorded = 0;

    // 3. Save new solves to the database
    for (const problem of solveStatus.problems) {
      // Check if submission was already recorded
      const existing = await Submission.findOne({ submissionId: problem.submissionId });
      if (!existing) {
        // Run local classifier for metadata (topics, difficulty, recommendation, etc.)
        const metadata = getLocalFallbackDetails(problem.title);

        await Submission.create({
          userId,
          problemName: problem.title,
          platform,
          date: todayStr,
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
        
        newSolvesRecorded++;
        console.log(`[PlatformService] Solved problem recorded: ${problem.title} (ID: ${problem.submissionId})`);
      }
    }

    // 4. Handle streak logic if they solved a problem today and it was their first sync today
    const postSyncCount = preSyncCount + newSolvesRecorded;

    if (postSyncCount > 0 && isFirstSubmissionToday) {
      // Secure streak increment
      if (userObj.streak > 0) {
        userObj.streak += 1;
      } else {
        userObj.streak = 1;
      }

      if (userObj.streak > (userObj.maxStreak || 0)) {
        userObj.maxStreak = userObj.streak;
      }

      // Check 15-day streak increments (Pro users only, max once per calendar month)
      const currentMonthStr = todayStr.substring(0, 7); // "YYYY-MM"
      if (userObj.streak % 15 === 0 && userObj.plan === "pro" && userObj.lastGraceCoinEarnedMonth !== currentMonthStr) {
        userObj.graceCoins = (userObj.graceCoins || 0) + 1;
        userObj.lastGraceCoinEarnedMonth = currentMonthStr;
        console.log(`[PlatformService] Grace coin unlocked: ${userObj.streak}-day streak in ${currentMonthStr}.`);
        
        await createNotification(
          userId,
          "Grace Coin Unlocked! 🪙",
          `Congratulations on hitting a ${userObj.streak}-day streak! You've earned 1 Grace Coin.`,
          "streak"
        );
      }

      // Secure deposit payout if user has an active plan
      const hasActivePlan = userObj.planExpiresAt && new Date() <= new Date(userObj.planExpiresAt);
      if (hasActivePlan) {
        if (userObj.activeDeposit >= (userObj.dailyCommitment || 0)) {
          userObj.activeDeposit -= (userObj.dailyCommitment || 0);
          userObj.balance += (userObj.dailyCommitment || 0);
          console.log(`[PlatformService] Paid reward of ₹${userObj.dailyCommitment} from activeDeposit.`);
        }
      }

      await userObj.save();

      // Trigger completion notification
      await createNotification(
        userId,
        "Submission Synced! 🚀",
        hasActivePlan ? "Your daily solve was synced and payout secured." : "Daily solve synced for active battles.",
        "streak"
      );
    }

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
