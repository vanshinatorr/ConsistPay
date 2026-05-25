const Submission = require("../models/Submission");
const User = require("../models/User");

const ALLOWED_DOMAINS = [
  "leetcode.com",
  "geeksforgeeks.org",
  "codingninjas.com",
  "naukri.com/code360",
];

const isValidLink = (link) => {
  try {
    const url = new URL(link);
    return ALLOWED_DOMAINS.some((domain) => url.hostname.includes(domain));
  } catch {
    return false;
  }
};

const submitSolution = async (req, res) => {
  try {
    const { link } = req.body;
    const userId = req.user._id;

    // 1. Link valid hai?
    if (!isValidLink(link)) {
      return res.status(400).json({
        message: "Invalid link. Only LeetCode, GFG, or CodeNinjas links allowed.",
      });
    }

    // 2. Same link pehle submit hui?
    const duplicateLink = await Submission.findOne({ userId, link });
    if (duplicateLink) {
      return res.status(400).json({
        message: "You have already submitted this link before.",
      });
    }

    // 3. Aaj already submit kiya?
    const today = new Date().toISOString().split("T")[0];
    const alreadySubmitted = await Submission.findOne({ userId, date: today });
    if (alreadySubmitted) {
      return res.status(400).json({
        message: "You have already submitted today. Come back tomorrow!",
      });
    }

    // 4. Submission save karo
    const submission = await Submission.create({
      userId,
      link,
      date: today,
      status: "completed",
    });

    // 5. Streak + Coins update karo
    const user = await User.findById(userId);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split("T")[0];

const yesterdaySubmission = await Submission.findOne({ 
  userId, 
  date: yesterdayStr, 
  status: "completed" 
});

// Agar kal submit kiya tha → streak badhao, warna 1 se start
user.streak = yesterdaySubmission ? user.streak + 1 : 1;

    user.balance += user.dailyCommitment;
    await user.save();

    res.status(201).json({
      message: "Solution submitted successfully!",
      streak: user.streak,
       balance: user.balance,
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = `${year}-${month.padStart(2, "0")}-31`;

    const submissions = await Submission.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { submitSolution, getMySubmissions, getCalendar };