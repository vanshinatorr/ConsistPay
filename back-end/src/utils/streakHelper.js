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
      let hasChanges = false;
      const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
      
      // Determine start date for consistency checks (from onboarding completion or user registration)
      let startDateStr = "";
      if (user.onboardingComplete && user.onboardingCompletedAt) {
        startDateStr = new Date(user.onboardingCompletedAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      } else if (user.createdAt) {
        startDateStr = new Date(user.createdAt).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      } else {
        startDateStr = todayStr;
      }

      // Fetch all submissions for the user to evaluate in-memory (O(1) checks per day)
      let submissions = await Submission.find({ userId: user._id });

      // Clean up conflicting missed submissions (where a completed solve also exists on that day)
      // or missed submissions created for today (since today is still active)
      const datesWithCompleted = new Set();
      submissions.forEach((sub) => {
        if (sub.status === "completed") {
          datesWithCompleted.add(sub.date);
        }
      });

      const submissionsToDelete = [];
      let refundedAmount = 0;
      const filteredSubmissions = [];

      submissions.forEach((sub) => {
        const isTodayMiss = sub.status === "missed" && sub.date === todayStr;
        const isDuplicateMiss = sub.status === "missed" && datesWithCompleted.has(sub.date);

        if (isTodayMiss || isDuplicateMiss) {
          submissionsToDelete.push(sub._id);
          if (sub.deductionProcessed) {
            refundedAmount += (user.dailyCommitment || 0);
          }
        } else {
          filteredSubmissions.push(sub);
        }
      });

      if (submissionsToDelete.length > 0) {
        await Submission.deleteMany({ _id: { $in: submissionsToDelete } });
        console.log(`[StreakHelper] Cleaned up ${submissionsToDelete.length} conflicting/today missed submissions. Refunded ₹${refundedAmount} to activeDeposit.`);
        user.activeDeposit = (user.activeDeposit || 0) + refundedAmount;
        hasChanges = true;
      }

      submissions = filteredSubmissions;
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
      let unprotectedMisses = 0; // Recalculated from 0 inside the day-by-day loop
      let maxStreak = user.maxStreak || 0;
      let earnedGraceCoinThisStreak = false;

      // Iterate day-by-day from registration/onboarding start until today
      const dateCursor = new Date(startCursor.getTime());
      while (dateCursor.getTime() <= endCursor.getTime()) {
        const cursorStr = dateCursor.toISOString().substring(0, 10);
        const sub = submissionsMap.get(cursorStr);
        const planEndDate = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
        const planStartDate = planEndDate ? new Date(planEndDate.getTime() - 30 * 24 * 60 * 60 * 1000) : null;
        const planStartDateStr = planStartDate ? planStartDate.toISOString().substring(0, 10) : "";
        const planEndDateStr = planEndDate ? planEndDate.toISOString().substring(0, 10) : "";
        const hasActivePlan = user.planExpiresAt && cursorStr >= planStartDateStr && cursorStr <= planEndDateStr;

        if (sub && sub.status === "completed") {
          // Solved successfully on this day!
          currentStreak += 1;
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }

          // Process payout if they had an active plan and it wasn't paid out yet
          if (hasActivePlan && !sub.payoutProcessed) {
            // Reverse any past deduction processed for this date
            if (sub.deductionProcessed) {
              activeDeposit += user.dailyCommitment || 0;
              sub.deductionProcessed = false;
              console.log(`[StreakHelper] Reversed deduction of ₹${user.dailyCommitment} for date ${cursorStr} because solve was synced`);
            }
            // Refund grace coin if it was applied to this day
            if (sub.graceCoinApplied) {
              graceCoins += 1;
              sub.graceCoinApplied = false;
              console.log(`[StreakHelper] Refunded 1 Grace Coin for date ${cursorStr} because solve was synced`);
            }
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
          if (cursorStr !== todayStr) {
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
                deductionProcessed: false,
                graceCoinApplied: false
              });
              submissionsMap.set(cursorStr, missedSub);
            }

            // Process stake deduction and grace coin application if they had an active plan on this date and it wasn't processed yet
            if (hasActivePlan && !missedSub.deductionProcessed) {
              const deduction = Math.min(activeDeposit, user.dailyCommitment || 0);
              if (deduction > 0) {
                activeDeposit -= deduction;
                missedSub.deductionProcessed = true;
                
                // Apply grace coin if available to protect streak
                if (graceCoins > 0) {
                  graceCoins -= 1;
                  missedSub.graceCoinApplied = true;
                  console.log(`[StreakHelper] Retroactive miss on date ${cursorStr} protected by Grace Coin. Decremented coin.`);
                } else {
                  missedSub.graceCoinApplied = false;
                }
                
                await missedSub.save();
                console.log(`[StreakHelper] Stake deduction of ₹${deduction} executed retroactively for missed date ${cursorStr}`);
              }
            }

            // Streak breaking / grace coin logic based on graceCoinApplied
            if (missedSub.graceCoinApplied) {
              // Streak is protected! (currentStreak is preserved)
            } else {
              // Streak is broken
              currentStreak = 0;
              unprotectedMisses += 1;
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
          "Grace Coin Unlocked",
          `Congratulations on hitting a ${currentStreak}-day streak! You've earned 1 Grace Coin.`,
          "streak"
        );
      }

      // Cap grace coins based on plan and current streak (max 2 for Pro if streak >= 15, otherwise max 1)
      const maxAllowedCoins = (user.plan === "pro" && currentStreak >= 15) ? 2 : 1;
      graceCoins = Math.min(Math.max(graceCoins, 0), maxAllowedCoins);

      // Save changes if there's any state delta
      if (
        hasChanges ||
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
