const User = require("../models/User");
const Submission = require("../models/Submission");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const totalSolved = await Submission.countDocuments({
      userId: req.user._id,
      status: "completed",
    });

    const totalMissed = await Submission.countDocuments({
      userId: req.user._id,
      status: "missed",
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      coins: user.coins,
      streak: user.streak,
      totalSolved,
      totalMissed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email streak coins")
      .sort({ streak: -1 })
      .limit(10);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, getLeaderboard };