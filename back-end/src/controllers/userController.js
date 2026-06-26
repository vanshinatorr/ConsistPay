const User = require("../models/User");
const Submission = require("../models/Submission");
const bcrypt = require("bcryptjs");

const activeUserRequests = new Set();

const checkAndNotifyBadges = async (user, totalSolved, totalMissed) => {
  try {
    const Notification = require("../models/Notification");

    const totalDays = totalSolved + totalMissed;
    const consistencyScore = totalDays > 0 ? Math.round((totalSolved / totalDays) * 100) : 0;

    const badgeChecks = [
      {
        key: "streak_7",
        title: "🎉 Achievement Unlocked: Streak Starter!",
        desc: "Congratulations! You've maintained a consistency streak of 7 days.",
        unlocked: user.streak >= 7,
        type: "streak"
      },
      {
        key: "consistency_90",
        title: "🎉 Achievement Unlocked: Consistency King!",
        desc: "Outstanding! You've achieved a consistency score of 90% or above.",
        unlocked: consistencyScore >= 90 && totalDays >= 5,
        type: "streak"
      },
      {
        key: "gladiator",
        title: "🎉 Achievement Unlocked: DSA Gladiator!",
        desc: "You've entered the battle arena with an active battle balance.",
        unlocked: user.battleBalance > 0,
        type: "battle"
      },
      {
        key: "grace_shield",
        title: "🎉 Achievement Unlocked: Shield of Grace!",
        desc: "Streak protection active. You possess at least one Grace Coin.",
        unlocked: user.graceCoins >= 1,
        type: "wallet"
      },
      {
        key: "elite",
        title: "🎉 Achievement Unlocked: Elite Member!",
        desc: "Welcome to the Pro league of coding consistency.",
        unlocked: user.plan && user.plan.toLowerCase() === "pro",
        type: "system"
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
    const uniqueDaysResult = await Submission.distinct("date", { userId: req.user._id, status: "completed" });
    const totalSolved = uniqueDaysResult.length;
    
    // Total count of completed solutions (up to 3 per day)
    const totalProblemsSolved = await Submission.countDocuments({ userId: req.user._id, status: "completed" });
    const totalMissed = await Submission.countDocuments({ userId: req.user._id, status: "missed" });

    // Check dynamic achievements and write notifications if earned
    await checkAndNotifyBadges(user, totalSolved, totalMissed);
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      plan: user.plan,
      balance: user.balance,
      battleBalance: user.battleBalance,
      streak: user.streak,
      maxStreak: user.maxStreak || 0,
      graceCoins: user.graceCoins,
      dailyCommitment: user.dailyCommitment,
      onboardingComplete: user.onboardingComplete,
      planExpiresAt: user.planExpiresAt,
      avatar: user.avatar,
      createdAt: user.createdAt,
      totalSolved, // Unique days solved
      totalProblemsSolved, // Raw count of completed submissions
      totalMissed
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

module.exports = { getMe, updateMe, getLeaderboard, addBattleFunds };