const User = require("../models/User");
const Submission = require("../models/Submission");
const PlatformLinkage = require("../models/PlatformLinkage");
const { sendStreakWarningEmail, sendSetupReminderEmail, sendPlatformLinkNudgeEmail } = require("../utils/emailService");

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

    // Find which users have a linked platform
    const linkedPlatforms = await PlatformLinkage.find(
      { userId: { $in: activeUsers.map(u => u._id) } },
      "userId"
    );
    const linkedUserIds = new Set(linkedPlatforms.map(p => p.userId.toString()));

    // Separate: no-platform users vs platform-connected users
    const noProfileUsers = activeUsers.filter(u => !linkedUserIds.has(u._id.toString()));
    const profileUsers = activeUsers.filter(u => linkedUserIds.has(u._id.toString()));

    // Find which platform-connected users solved today
    const completedToday = await Submission.find({ date: todayStr, status: "completed" });
    const solvedUserIds = new Set(completedToday.map(s => s.userId.toString()));
    const warningQueue = profileUsers.filter(u => !solvedUserIds.has(u._id.toString()));

    console.log(`[Cron] ${activeUsers.length} active users. No-platform: ${noProfileUsers.length}, Warning queue: ${warningQueue.length}`);

    // Send platform link nudge to users without a connected profile
    let nudgeSent = 0;
    for (const user of noProfileUsers) {
      sendPlatformLinkNudgeEmail(user.email, user.name, user.activeDeposit).catch(err =>
        console.error(`[Cron] Platform nudge failed for ${user.email}:`, err.message)
      );
      nudgeSent++;
    }

    // Send streak warning to platform-connected users who haven't solved today
    let warningSent = 0;
    for (const user of warningQueue) {
      sendStreakWarningEmail(user.email, user.name, user.dailyCommitment).catch(err =>
        console.error(`[Cron] Warning email failed for ${user.email}:`, err.message)
      );
      warningSent++;
    }

    res.status(200).json({
      message: "Daily streak reminder cron finished successfully.",
      totalActiveUsers: activeUsers.length,
      platformNudgesSent: nudgeSent,
      streakWarningsSent: warningSent
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

// 3. Automated Global Background Sync (Runs before midnight to sync all active platform solves)
const runAutomatedGlobalSync = async (req, res) => {
  try {
    const { syncUserStreak } = require("../utils/streakHelper");
    
    // Find all users with linked platform accounts or active challenges
    const activeUsers = await User.find({
      $or: [
        { leetcodeUsername: { $exists: true, $ne: "" } },
        { gfgUsername: { $exists: true, $ne: "" } },
        { code360Username: { $exists: true, $ne: "" } },
        { "platforms.leetcode.username": { $exists: true, $ne: "" } },
        { "platforms.gfg.username": { $exists: true, $ne: "" } },
        { activeDeposit: { $gt: 0 } }
      ]
    });

    console.log(`[Auto-Sync Cron] Starting background sync for ${activeUsers.length} users...`);

    let syncedCount = 0;
    let failedCount = 0;

    for (const user of activeUsers) {
      try {
        await syncUserStreak(user._id);
        syncedCount++;
      } catch (err) {
        console.error(`[Auto-Sync Cron] Sync failed for user ${user._id} (${user.name}):`, err.message);
        failedCount++;
      }
    }

    console.log(`[Auto-Sync Cron] Completed background sync. Synced: ${syncedCount}, Failed: ${failedCount}`);

    res.status(200).json({
      message: "Automated global sync cron finished successfully.",
      totalUsers: activeUsers.length,
      syncedCount,
      failedCount
    });
  } catch (error) {
    console.error("[Auto-Sync Cron] Global sync error:", error);
    res.status(500).json({ message: "Internal server error in automated global sync cron." });
  }
};

module.exports = {
  runDailyStreakReminder,
  runSetupReminder,
  runAutomatedGlobalSync
};
