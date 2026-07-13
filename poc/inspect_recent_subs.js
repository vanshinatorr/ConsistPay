require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");
const Submission = require("../back-end/src/models/Submission");

const testUri = process.env.MONGO_URI.replace("/consistpay", "/test").replace("/?", "/test?");

mongoose.connect(testUri)
  .then(async () => {
    console.log("Connected to test MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      console.log(`=== USER DOCUMENT ===`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Plan: ${user.plan}`);
      console.log(`Balance: ${user.balance}`);
      console.log(`Active Deposit: ${user.activeDeposit}`);
      console.log(`Grace Coins: ${user.graceCoins}`);
      console.log(`Streak: ${user.streak}`);
      console.log(`Plan Expires At: ${user.planExpiresAt}`);
      console.log(`Onboarding Completed At: ${user.onboardingCompletedAt}`);
      
      const subs = await Submission.find({ userId: user._id }).sort({ date: -1 }).limit(15);
      console.log(`=== RECENT SUBMISSIONS ===`);
      subs.forEach(s => {
        console.log(`Date: ${s.date}, Status: ${s.status}, Accepted: ${s.accepted}, Payout: ${s.payoutProcessed}, Deduction: ${s.deductionProcessed}, Grace: ${s.graceCoinApplied}`);
      });
    } else {
      console.log("User not found");
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
