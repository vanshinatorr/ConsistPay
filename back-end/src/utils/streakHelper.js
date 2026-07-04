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

const activeSyncs = new Set();

const syncUserStreak = async (userOrId) => {
  try {
    let user;
    if (typeof userOrId === "string" || userOrId instanceof mongoose.Types.ObjectId) {
      user = await User.findById(userOrId);
    } else {
      user = userOrId;
    }

    if (!user) return null;

    const userIdStr = user._id.toString();

    // If another request is currently synchronizing this user, wait for it to complete
    if (activeSyncs.has(userIdStr)) {
      for (let i = 0; i < 30; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!activeSyncs.has(userIdStr)) {
          // Refetch and return the updated user object from the DB
          return await User.findById(user._id);
        }
      }
      return user; // Fallback
    }

    activeSyncs.add(userIdStr);

    try {
      const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
      
      // Determine start date for consistency checks (from onboarding completion or user registration)
      let startDateStr = "";
      if (user.onboardingComplete && user.onboardingCompletedAt) {
        startDateStr = new Date(user.onboardingCompletedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      } else if (user.onboardingComplete && user.createdAt) {
        startDateStr = new Date(user.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      } else {
        // Onboarding is not completed yet, reset streak and wait
        if (user.streak !== 0) {
          user.streak = 0;
          await user.save();
        }
        return user;
      }

      // Fetch all submissions for the user to evaluate in-memory (O(1) checks per day)
      const submissions = await Submission.find({ userId: user._id });
      const submissionsMap = new Map();

      submissions.forEach((sub) => {
        const existing = submissionsMap.get(sub.date);
        // Prioritize completed submissions on the same date
        if (!existing || (existing.status !== "completed" && sub.status === "completed")) {
          submissionsMap.set(sub.date, sub);
        }
      });

      const startCursor = new Date(startDateStr + "T00:00:00Z");
      const endCursor = new Date(todayStr + "T00:00:00Z");

      let currentStreak = 0;
      let graceCoins = user.graceCoins || 0;
      let activeDeposit = user.activeDeposit || 0;
      let balance = user.balance || 0;
      let unprotectedMisses = user.currentCycleUnprotectedMisses || 0;
      let maxStreak = user.maxStreak || 0;
      let earnedGraceCoinThisStreak = false;

      // Iterate day-by-day from registration/onboarding start until today
      const dateCursor = new Date(startCursor.getTime());
      while (dateCursor.getTime() <= endCursor.getTime()) {
        const cursorStr = dateCursor.toISOString().substring(0, 10);
        const sub = submissionsMap.get(cursorStr);
        const hasActivePlan = user.planExpiresAt && new Date(cursorStr + "T00:00:00Z") <= new Date(user.planExpiresAt);

        if (sub && sub.status === "completed") {
          // Solved successfully on this day!
          currentStreak += 1;
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }

          // Process payout if they had an active plan and it wasn't paid out yet
          if (hasActivePlan && !sub.payoutProcessed) {
            const payoutAmount = Math.min(activeDeposit, user.dailyCommitment || 0);
            if (payoutAmount > 0) {
              activeDeposit -= payoutAmount;
              balance += payoutAmount;
              sub.payoutProcessed = true;
              await sub.save();
              console.log(`[StreakHelper] Payout of ₹${payoutAmount} credited retroactively for date ${cursorStr}`);
            }
          }
        } else {
          // Missed this day
          let missedSub = sub;
          if (!missedSub) {
            missedSub = await Submission.create({
              userId: user._id,
              problemName: "No Submission",
              platform: "Unknown",
              date: cursorStr,
              status: "missed",
              accepted: false,
              isFallback: true,
              deductionProcessed: false
            });
            submissionsMap.set(cursorStr, missedSub);
          }

          // Process stake deduction if they had an active plan on this date and it wasn't processed yet
          if (hasActivePlan && !missedSub.deductionProcessed) {
            const deduction = Math.min(activeDeposit, user.dailyCommitment || 0);
            if (deduction > 0) {
              activeDeposit -= deduction;
              missedSub.deductionProcessed = true;
              await missedSub.save();
              console.log(`[StreakHelper] Stake deduction of ₹${deduction} executed retroactively for missed date ${cursorStr}`);
            }
          }

          // Streak breaking / grace coin logic (apply only to completed past days)
          if (cursorStr !== todayStr) {
            if (currentStreak > 0) {
              if (graceCoins > 0) {
                graceCoins -= 1;
                // Streak is protected!
              } else {
                currentStreak = 0;
                unprotectedMisses += 1;
              }
            } else {
              if (graceCoins > 0) {
                graceCoins -= 1;
              } else {
                unprotectedMisses += 1;
              }
            }
          }
        }

        // Increment cursor by 1 day
        dateCursor.setDate(dateCursor.getDate() + 1);
      }

      // Check if user hit new streak intervals to reward grace coins (only for today)
      // Check 15-day streak increments (Pro plan, max once per calendar month)
      const currentMonthStr = todayStr.substring(0, 7);
      if (currentStreak % 15 === 0 && currentStreak > 0 && user.plan === "pro" && user.lastGraceCoinEarnedMonth !== currentMonthStr) {
        graceCoins += 1;
        user.lastGraceCoinEarnedMonth = currentMonthStr;
        await createNotification(
          user._id,
          "Grace Coin Unlocked! 🪙",
          `Congratulations on hitting a ${currentStreak}-day streak! You've earned 1 Grace Coin.`,
          "streak"
        );
      }

      // Save changes if there's any state delta
      if (
        user.streak !== currentStreak ||
        user.graceCoins !== graceCoins ||
        user.activeDeposit !== activeDeposit ||
        user.balance !== balance ||
        user.currentCycleUnprotectedMisses !== unprotectedMisses ||
        user.maxStreak !== maxStreak
      ) {
        user.streak = currentStreak;
        user.graceCoins = graceCoins;
        user.activeDeposit = activeDeposit;
        user.balance = balance;
        user.currentCycleUnprotectedMisses = unprotectedMisses;
        user.maxStreak = maxStreak;
        await user.save();
        console.log(`[StreakHelper] Recalculated state for user ${user._id}: streak=${currentStreak}, balance=₹${balance}, activeDeposit=₹${activeDeposit}`);
      }

      return user;
    } finally {
      activeSyncs.delete(userIdStr);
    }
  } catch (error) {
    console.error("Error in syncUserStreak helper:", error);
    return userOrId;
  }
};

module.exports = {
  syncUserStreak
};
