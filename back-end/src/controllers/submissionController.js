const Submission = require("../models/Submission");

/**
 * Handles retrieval queries for user submissions (history, calendar, and daily completed status).
 */

const getTodaySubmission = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    
    // Find all completed submissions today
    const submissions = await Submission.find({
      userId: req.user._id,
      date: today,
      status: "completed"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: submissions.length,
      submission: submissions.length > 0 ? submissions[0] : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCalendar = async (req, res) => {
  try {
    const { year } = req.query;
    const submissions = await Submission.find({
      userId: req.user._id,
      date: { $regex: `^${year}-` }
    });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodaySubmission, getMySubmissions, getCalendar };