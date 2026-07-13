require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");
const Submission = require("../back-end/src/models/Submission");
const { syncUserStreak } = require("../back-end/src/utils/streakHelper");

const testUri = process.env.MONGO_URI.replace("/consistpay", "/test").replace("/?", "/test?");

mongoose.connect(testUri)
  .then(async () => {
    console.log("Connected to test MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      // 1. Reset user wallet values to initial state before sync
      user.activeDeposit = 600;
      user.balance = 0;
      user.graceCoins = 1;
      user.lastGraceCoinEarnedMonth = "";
      user.currentCycleUnprotectedMisses = 0;
      await user.save();
      console.log("User document reset to initial state");

      // 2. Reset recent submissions processed flags
      const planStartDate = new Date(new Date(user.planExpiresAt).getTime() - 30 * 24 * 60 * 60 * 1000);
      const subs = await Submission.find({ userId: user._id });
      let resetCount = 0;
      for (let s of subs) {
        s.payoutProcessed = false;
        s.deductionProcessed = false;
        s.graceCoinApplied = false;
        await s.save();
        resetCount++;
      }
      console.log(`Reset ${resetCount} submissions`);

      // 3. Trigger the recalculation via syncUserStreak
      console.log("Running syncUserStreak to recalculate...");
      const updatedUser = await syncUserStreak(user._id.toString());
      console.log("Recalculation complete!");
      console.log("Updated User Document:", {
        name: updatedUser.name,
        email: updatedUser.email,
        balance: updatedUser.balance,
        activeDeposit: updatedUser.activeDeposit,
        graceCoins: updatedUser.graceCoins,
        streak: updatedUser.streak
      });
    } else {
      console.log("User not found");
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
