require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");
const Submission = require("../back-end/src/models/Submission");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/consistpay")
  .then(async () => {
    console.log("Connected to MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      user.activeDeposit = 600;
      user.graceCoins = 1;
      user.balance = 0;
      user.streak = 9;
      user.plan = "pro";
      user.lastGraceCoinEarnedMonth = "";
      user.planExpiresAt = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000); // 21 days left (completed 9 days out of 30)
      
      // Let's also ensure that all submissions in the database are marked correctly for verification
      const subs = await Submission.find({ userId: user._id });
      for (let s of subs) {
        s.payoutProcessed = false;
        s.deductionProcessed = false;
        s.graceCoinApplied = false;
        await s.save();
      }
      
      await user.save();
      console.log("User reset successfully:", user);
    } else {
      console.log("User not found");
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
