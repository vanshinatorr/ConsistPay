const User = require("../models/User");
const Submission = require("../models/Submission");
const bcrypt = require("bcryptjs");

const getMe = async (req, res) => {
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
    const activeUsers = await User.find({ onboardingComplete: true });
    await Promise.all(activeUsers.map(u => syncUserStreak(u)));

    const users = await User.aggregate([
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
      { $sort: { streak: -1 } },
      { $limit: 50 }
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