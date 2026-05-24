const User = require("../models/User");
const Submission = require("../models/Submission");

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
      streak: user.streak,
      graceCoins: user.graceCoins,
      dailyCommitment: user.dailyCommitment,
      onboardingComplete: user.onboardingComplete,
      planExpiresAt: user.planExpiresAt,
      totalSolved,
      totalMissed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email streak plan")
      .sort({ streak: -1 })
      .limit(10);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, getLeaderboard };