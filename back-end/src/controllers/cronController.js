const User = require("../models/User");
const Submission = require("../models/Submission");
const { sendStreakWarningEmail, sendSetupReminderEmail } = require("../utils/emailService");

// 1. Send Daily Streak Warnings at 8:00 PM IST (14:30 UTC)
const runDailyStreakReminder = async (req, res) => {
  try {
    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    
    // Find all users with active plans and deposits
    const activeUsers = await User.find({
      onboardingComplete: true,
      activeDeposit: { $gt: 0 },
      email: { $exists: true, $ne: "" }
    });

    if (activeUsers.length === 0) {
      return res.status(200).json({ message: "No active users found." });
    }

    // Find all completed submissions today
    const completedToday = await Submission.find({
      date: todayStr,
      status: "completed"
    });
    
    const solvedUserIds = new Set(completedToday.map((s) => s.userId.toString()));
    const warningQueue = activeUsers.filter((user) => !solvedUserIds.has(user._id.toString()));

    console.log(`[Cron] Found ${activeUsers.length} active users. ${warningQueue.length} have not completed today's solve.`);

    // Trigger emails in background
    let sentCount = 0;
    for (const user of warningQueue) {
      sendStreakWarningEmail(user.email, user.name, user.dailyCommitment).catch((err) =>
        console.error(`[Cron] Warning email failed for ${user.email}:`, err.message)
      );
      sentCount++;
    }

    res.status(200).json({
      message: "Daily streak reminder cron finished successfully.",
      totalActiveUsers: activeUsers.length,
      warningEmailsQueued: sentCount
    });
  } catch (error) {
    console.error("[Cron] Daily streak reminder error:", error);
    res.status(500).json({ message: "Internal server error in daily streak reminder cron." });
  }
};

// 2. Send Onboarding Setup Reminder (24 hours after registration)
const runSetupReminder = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find all users registered > 24 hours ago who haven't completed onboarding and haven't received reminder
    const pendingUsers = await User.find({
      onboardingComplete: false,
      setupReminderSent: { $ne: true },
      createdAt: { $lte: oneDayAgo },
      email: { $exists: true, $ne: "" }
    });

    console.log(`[Cron] Found ${pendingUsers.length} users with incomplete onboarding setups after 24h.`);

    let sentCount = 0;
    for (const user of pendingUsers) {
      sendSetupReminderEmail(user.email, user.name).catch((err) =>
        console.error(`[Cron] Setup reminder email failed for ${user.email}:`, err.message)
      );
      
      user.setupReminderSent = true;
      await user.save();
      sentCount++;
    }

    res.status(200).json({
      message: "Onboarding setup reminder cron finished successfully.",
      setupRemindersSent: sentCount
    });
  } catch (error) {
    console.error("[Cron] Onboarding setup reminder error:", error);
    res.status(500).json({ message: "Internal server error in onboarding setup reminder cron." });
  }
};

module.exports = {
  runDailyStreakReminder,
  runSetupReminder
};
