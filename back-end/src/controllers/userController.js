const User = require("../models/User");
const Submission = require("../models/Submission");
const bcrypt = require("bcryptjs");

const activeUserRequests = new Set();

const checkAndNotifyBadges = async (user, totalSolved, totalMissed, totalProblemsSolved) => {
  try {
    const Notification = require("../models/Notification");

    const totalDays = totalSolved + totalMissed;
    const consistencyScore = totalDays > 0 ? Math.round((totalSolved / totalDays) * 100) : 0;

    const badgeChecks = [
      {
        key: "solved_1",
        title: "🎉 Achievement Unlocked: First Steps!",
        desc: "Congratulations on solving your first coding problem! Keep up the momentum.",
        unlocked: totalSolved >= 1,
        type: "system"
      },
      {
        key: "streak_7",
        title: "🎉 Achievement Unlocked: Streak Starter!",
        desc: "Congratulations! You've maintained a consistency streak of 7 days.",
        unlocked: user.streak >= 7 || user.maxStreak >= 7,
        type: "streak"
      },
      {
        key: "grace_shield",
        title: "🎉 Achievement Unlocked: Shield of Grace!",
        desc: "Streak protection active. You possess at least one Grace Coin.",
        unlocked: user.graceCoins >= 1,
        type: "wallet"
      },
      {
        key: "gladiator",
        title: "🎉 Achievement Unlocked: DSA Gladiator!",
        desc: "You've entered the battle arena with an active battle balance.",
        unlocked: user.battleBalance > 0,
        type: "battle"
      },
      {
        key: "solved_10",
        title: "🎉 Achievement Unlocked: Problem Solver!",
        desc: "Fantastic job! You've solved 10 or more coding problems overall.",
        unlocked: totalProblemsSolved >= 10,
        type: "system"
      },
      {
        key: "streak_15",
        title: "🎉 Achievement Unlocked: Habit Builder!",
        desc: "Impressive! You've maintained a consistency streak of 15 days.",
        unlocked: user.streak >= 15 || user.maxStreak >= 15,
        type: "streak"
      },
      {
        key: "solved_50",
        title: "🎉 Achievement Unlocked: Dedicated Coder!",
        desc: "Brilliant! You've solved 50 or more coding problems overall.",
        unlocked: totalProblemsSolved >= 50,
        type: "system"
      },
      {
        key: "consistency_90",
        title: "🎉 Achievement Unlocked: Consistency King!",
        desc: "Outstanding! You've achieved a consistency score of 90% or above.",
        unlocked: consistencyScore >= 90 && totalDays >= 5,
        type: "streak"
      },
      {
        key: "elite",
        title: "🎉 Achievement Unlocked: Elite Member!",
        desc: "Welcome to the Pro league of coding consistency.",
        unlocked: user.plan && user.plan.toLowerCase() === "pro",
        type: "system"
      },
      {
        key: "solved_100",
        title: "🎉 Achievement Unlocked: Supercommitter!",
        desc: "Heroic milestone! You've solved 100 or more coding problems overall.",
        unlocked: totalProblemsSolved >= 100,
        type: "system"
      },
      {
        key: "grace_5",
        title: "🎉 Achievement Unlocked: Grace Hoarder!",
        desc: "You have accumulated 5 or more Grace Coins for ultimate safety.",
        unlocked: user.graceCoins >= 5,
        type: "wallet"
      },
      {
        key: "streak_30",
        title: "🎉 Achievement Unlocked: Consistency Champion!",
        desc: "Remarkable! You've maintained a consistency streak of 30 days.",
        unlocked: user.streak >= 30 || user.maxStreak >= 30,
        type: "streak"
      },
      {
        key: "commitment_50",
        title: "🎉 Achievement Unlocked: High Roller!",
        desc: "You've set your daily coding commitment to ₹50. High stakes, high rewards!",
        unlocked: user.dailyCommitment === 50,
        type: "wallet"
      },
      {
        key: "max_streak_50",
        title: "🎉 Achievement Unlocked: Streak Master!",
        desc: "Legendary! You've reached a consistency streak of 50 days.",
        unlocked: user.streak >= 50 || user.maxStreak >= 50,
        type: "streak"
      },
      {
        key: "streak_100",
        title: "🎉 Achievement Unlocked: Consistency Legend!",
        desc: "Unbelievable! You've reached a consistency streak of 100 days.",
        unlocked: user.streak >= 100 || user.maxStreak >= 100,
        type: "streak"
      }
    ];

    for (const badge of badgeChecks) {
      if (badge.unlocked) {
        // Atomic search & insert to guarantee a single notification gets created even under concurrency
        await Notification.findOneAndUpdate(
          { userId: user._id, title: badge.title },
          {
            $setOnInsert: {
              userId: user._id,
              title: badge.title,
              desc: badge.desc,
              type: badge.type,
              read: false
            }
          },
          { upsert: true, new: true }
        );
      }
    }
  } catch (error) {
    console.error("Error in checkAndNotifyBadges:", error);
  }
};

const getMe = async (req, res) => {
  const userIdStr = req.user._id.toString();

  // If another profile request is currently active for this user, wait for it to finish to prevent parallel runs of streak/badge helpers
  if (activeUserRequests.has(userIdStr)) {
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (!activeUserRequests.has(userIdStr)) {
        break;
      }
    }
  }

  activeUserRequests.add(userIdStr);

  try {
    let user = await User.findById(req.user._id).select("-password");
    if (user) {
      const { syncUserStreak } = require("../utils/streakHelper");
      user = await syncUserStreak(user);
    }
    
    // Find unique days with at least one completed submission
    const solvedQuery = { userId: req.user._id, status: "completed" };
    const missedQuery = { userId: req.user._id, status: "missed" };

    if (user && user.planExpiresAt) {
      const planStartDate = new Date(new Date(user.planExpiresAt).getTime() - 30 * 24 * 60 * 60 * 1000);
      const planStartDateStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(planStartDate);
      
      solvedQuery.date = { $gte: planStartDateStr };
      missedQuery.date = { $gte: planStartDateStr };
    }

    const uniqueDaysResult = await Submission.distinct("date", solvedQuery);
    const totalSolved = uniqueDaysResult.length;
    
    const PlatformLinkage = require("../models/PlatformLinkage");
    const linkages = await PlatformLinkage.find({ userId: req.user._id });
    
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;
    let totalProblemsSolved = 0;

    linkages.forEach(l => {
      if (l.isVerified) {
        easyCount += (l.easySolved || 0);
        mediumCount += (l.mediumSolved || 0);
        hardCount += (l.hardSolved || 0);
        totalProblemsSolved += (l.totalSolved || 0);
      }
    });

    const totalMissed = await Submission.countDocuments(missedQuery);

    const linkedPlatforms = linkages.map(l => ({
      platform: l.platform,
      username: l.username,
      isVerified: l.isVerified,
      verificationToken: l.verificationToken
    }));

    // Check dynamic achievements and write notifications if earned
    await checkAndNotifyBadges(user, totalSolved, totalMissed, totalProblemsSolved);

    let planStatus = "expired";
    let graceDaysLeft = 0;
    const now = new Date();

    if (user.planExpiresAt) {
      const expiresAt = new Date(user.planExpiresAt);
      const graceEnd = new Date(expiresAt.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days grace
      
      if (now <= expiresAt) {
        planStatus = "active";
      } else if (now <= graceEnd) {
        planStatus = "grace_period";
        const diffMs = graceEnd.getTime() - now.getTime();
        graceDaysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      } else {
        planStatus = "expired";
      }

      // Check 10% auto-credit check if plan has expired
      if (now > expiresAt && !user.bonusCredited) {
        if (user.plan === "pro" && (user.currentCycleUnprotectedMisses || 0) === 0) {
          const totalDeposit = (user.dailyCommitment || 0) * 30;
          const bonus = Math.round(totalDeposit * 0.1);
          user.balance += bonus;
          
          const Notification = require("../models/Notification");
          await Notification.create({
            userId: user._id,
            title: "10% Consistency Bonus! 🏆",
            desc: `Congratulations on staying 100% consistent! We've credited ₹${bonus} (10% bonus) to your wallet.`,
            type: "wallet",
            read: false
          });
          console.log(`Credited consistency bonus ₹${bonus} to user ${user._id}`);
        }
        user.bonusCredited = true;
        await user.save();
      }
    }
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      plan: user.plan,
      balance: user.balance,
      activeDeposit: user.activeDeposit || 0,
      battleBalance: user.battleBalance,
      streak: user.streak,
      maxStreak: user.maxStreak || 0,
      graceCoins: user.graceCoins,
      dailyCommitment: user.dailyCommitment,
      onboardingComplete: user.onboardingComplete,
      planExpiresAt: user.planExpiresAt,
      planStatus,
      graceDaysLeft,
      avatar: user.avatar,
      createdAt: user.createdAt,
      totalSolved, // Unique days solved
      totalProblemsSolved, // Raw count of completed submissions
      totalMissed,
      linkedPlatforms,
      dsaStats: {
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
        total: easyCount + mediumCount + hardCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    activeUserRequests.delete(userIdStr);
  }
};

const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.dailyCommitment) user.dailyCommitment = req.body.dailyCommitment;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid current password" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    await user.save();
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      dailyCommitment: user.dailyCommitment,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { syncUserStreak } = require("../utils/streakHelper");
    
    // Sync streak ONLY for the requesting user to avoid database overhead
    if (req.user && req.user._id) {
      await syncUserStreak(req.user._id);
    }

    const users = await User.aggregate([
      // 1. Filter out only completed onboarding users
      { $match: { onboardingComplete: true } },
      // 2. Sort and limit early to prevent joining the entire collections in-memory
      { $sort: { streak: -1 } },
      { $limit: 50 },
      // 3. Perform lookup only for the 50 matched users
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "userId",
          as: "submissions"
        }
      },
      {
        $project: {
          name: 1,
          username: 1,
          email: 1,
          streak: 1,
          plan: 1,
          avatar: 1,
          completed: {
            $size: {
              $filter: {
                input: "$submissions",
                as: "sub",
                cond: { $eq: ["$$sub.status", "completed"] }
              }
            }
          },
          uniqueCompletedDays: {
            $size: {
              $setUnion: {
                $map: {
                  input: {
                    $filter: {
                      input: "$submissions",
                      as: "sub",
                      cond: { $eq: ["$$sub.status", "completed"] }
                    }
                  },
                  as: "sub",
                  in: "$$sub.date"
                }
              }
            }
          },
          missed: {
            $size: {
              $filter: {
                input: "$submissions",
                as: "sub",
                cond: { $eq: ["$$sub.status", "missed"] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          consistency: {
            $cond: [
              { $gt: [{ $add: ["$uniqueCompletedDays", "$missed"] }, 0] },
              { $round: [{ $multiply: [{ $divide: ["$uniqueCompletedDays", { $add: ["$uniqueCompletedDays", "$missed"] }] }, 100] }, 0] },
              0
            ]
          }
        }
      },
      // 4. Re-sort final list to maintain streak order
      { $sort: { streak: -1 } }
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addBattleFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const user = await User.findById(req.user._id);
    user.battleBalance += amount;
    await user.save();
    res.status(200).json({ battleBalance: user.battleBalance, message: `Added ₹${amount} to Battle Wallet` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const devResetUser = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Forbidden in production environment." });
  }
  try {
    const userId = req.user._id;

    // Delete all related records
    const PlatformLinkage = require("../models/PlatformLinkage");
    const Submission = require("../models/Submission");
    const Notification = require("../models/Notification");
    const Withdrawal = require("../models/Withdrawal");
    const Challenge = require("../models/Challenge");
    const User = require("../models/User");

    await Promise.all([
      PlatformLinkage.deleteMany({ userId }),
      Submission.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      Withdrawal.deleteMany({ userId }),
      Challenge.deleteMany({ $or: [{ creatorId: userId }, { opponentId: userId }] }),
      User.deleteOne({ _id: userId })
    ]);

    console.log(`[DevReset] Successfully wiped all testing data for user ID: ${userId}`);
    res.status(200).json({ message: "User account reset successfully." });
  } catch (error) {
    console.error("[DevReset] Error wiping data:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, updateMe, getLeaderboard, addBattleFunds, devResetUser };