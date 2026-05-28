const User = require("../models/User");
const Submission = require("../models/Submission");
const bcrypt = require("bcryptjs");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const totalSolved = await Submission.countDocuments({ userId: req.user._id, status: "completed" });
    const totalMissed = await Submission.countDocuments({ userId: req.user._id, status: "missed" });
    res.status(200).json({
      _id: user._id,
      name: user.name,
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
      totalSolved,
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
              { $gt: [{ $add: ["$completed", "$missed"] }, 0] },
              { $round: [{ $multiply: [{ $divide: ["$completed", { $add: ["$completed", "$missed"] }] }, 100] }, 0] },
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