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
      const subs = await Submission.find({ userId: user._id, date: { $gte: "2026-07-02", $lte: "2026-07-10" } }).sort({ date: 1 });
      console.log(`Submissions in active range: ${subs.length}`);
      subs.forEach(s => {
        console.log(`Date: ${s.date}, Status: ${s.status}, PayoutProcessed: ${s.payoutProcessed}, DeductionProcessed: ${s.deductionProcessed}`);
      });
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
