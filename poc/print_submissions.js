require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");
const Submission = require("../back-end/src/models/Submission");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/consistpay")
  .then(async () => {
    console.log("Connected to MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      const subs = await Submission.find({ userId: user._id });
      console.log(`Found ${subs.length} submissions:`);
      subs.forEach(s => {
        console.log(`ID: ${s._id}, Date: ${s.date}, Status: ${s.status}, Accepted: ${s.accepted}, Payout: ${s.payoutProcessed}, Deduction: ${s.deductionProcessed}`);
      });
    } else {
      console.log("User not found");
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
