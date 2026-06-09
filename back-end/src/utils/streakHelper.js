const mongoose = require("mongoose");
const User = require("../models/User");
const Submission = require("../models/Submission");

// Helper to create notifications
const createNotification = async (userId, title, message, type = "system") => {
  try {
    const Notification = require("../models/Notification");
    await Notification.create({
      userId,
      title,
      desc: message,
      type,
      read: false
    });
  } catch (err) {
    console.error("Failed to create notification inside streakHelper:", err.message);
  }
};

const syncUserStreak = async (userOrId) => {
  try {
    let user;
    if (typeof userOrId === "string" || userOrId instanceof mongoose.Types.ObjectId) {
      user = await User.findById(userOrId);
    } else {
      user = userOrId;
    }

    if (!user) return null;

    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
    
    // Find the user's last submission (either completed or missed)
    const lastSubmission = await Submission.findOne({
      userId: user._id,
      status: { $in: ["completed", "missed"] }
    }).sort({ date: -1 });

    let startDateStr = "";
    
    if (!lastSubmission) {
      // If no submissions exist, check from onboarding completion / registration
      if (user.onboardingComplete && user.onboardingCompletedAt) {
        startDateStr = new Date(user.onboardingCompletedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      } else if (user.onboardingComplete && user.createdAt) {
        startDateStr = new Date(user.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      } else {
        // Not onboarding complete, don't calculate missed days yet
        if (user.streak !== 0) {
          user.streak = 0;
          await user.save();
        }
        return user;
      }
    } else {
      startDateStr = lastSubmission.date;
    }

    const date1 = new Date(startDateStr + "T00:00:00Z");
    const date2 = new Date(todayStr + "T00:00:00Z");
    const diffMs = date2.getTime() - date1.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      // Streak is intact (submitted today or yesterday)
      return user;
    }

    // They missed some days!
    const missedDays = diffDays - 1;

    // Create missed submission records for all missing dates
    const dateCursor = new Date(date1.getTime() + (1000 * 60 * 60 * 24));
    while (dateCursor.getTime() < date2.getTime()) {
      const cursorStr = dateCursor.toISOString().substring(0, 10);
      const exists = await Submission.findOne({ userId: user._id, date: cursorStr });
      if (!exists) {
        await Submission.create({
          userId: user._id,
          problemName: "No Submission",
          platform: "Unknown",
          date: cursorStr,
          status: "missed",
          accepted: false,
          isFallback: true
        });
        console.log(`Created missed submission record for user ${user._id} on ${cursorStr}`);
      }
      dateCursor.setDate(dateCursor.getDate() + 1);
    }

    let streakNotificationTitle = "";
    let streakNotificationMessage = "";

    if (user.streak > 0) {
      if (user.graceCoins >= missedDays) {
        // Protected by Grace Coins
        user.graceCoins -= missedDays;
        // Streak stays intact!
        streakNotificationTitle = "Streak Protected! 🛡️";
        streakNotificationMessage = `You missed ${missedDays} ${missedDays === 1 ? "day" : "days"}, but your streak was protected by consuming ${missedDays} Grace ${missedDays === 1 ? "Coin" : "Coins"}.`;
      } else {
        // Streak broken
        user.streak = 0;
        // Deduct as many grace coins as possible to try to cover, then set to 0
        user.graceCoins = Math.max(0, user.graceCoins - missedDays);
        streakNotificationTitle = "Streak Broken 💔";
        streakNotificationMessage = `You missed ${missedDays} ${missedDays === 1 ? "day" : "days"} and did not have enough Grace Coins. Your consistency streak has reset.`;
      }

      await user.save();

      if (streakNotificationTitle) {
        await createNotification(user._id, streakNotificationTitle, streakNotificationMessage, "streak");
      }
    }

    return user;
  } catch (error) {
    console.error("Error in syncUserStreak helper:", error);
    return userOrId;
  }
};

module.exports = {
  syncUserStreak
};
