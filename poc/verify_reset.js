require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");
const Submission = require("../back-end/src/models/Submission");

const testUri = process.env.MONGO_URI.replace("/consistpay", "/test").replace("/?", "/test?");

mongoose.connect(testUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      // Set initial values
      user.activeDeposit = 600;
      user.balance = 0;
      user.graceCoins = 1;
      await user.save();
      console.log("User wallet values reset");

      // Reset submissions
      const subs = await Submission.find({ userId: user._id });
      for (let s of subs) {
        s.payoutProcessed = false;
        s.deductionProcessed = false;
        s.graceCoinApplied = false;
        await s.save();
      }
      console.log("Submissions flags set to false");

      // Re-query to verify
      const verifiedSubs = await Submission.find({ userId: user._id, date: { $gte: "2026-07-02", $lte: "2026-07-10" } });
      console.log("Verified submissions in DB after reset:");
      verifiedSubs.forEach(s => {
        console.log(`Date: ${s.date}, Status: ${s.status}, PayoutProcessed: ${s.payoutProcessed}`);
      });
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
