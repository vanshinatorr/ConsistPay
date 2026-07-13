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
      const missedSubs = await Submission.find({ userId: user._id, status: "missed" });
      console.log(`Found ${missedSubs.length} missed submissions in test DB:`);
      missedSubs.forEach(s => {
        console.log(`Date: ${s.date}, DeductionProcessed: ${s.deductionProcessed}, GraceApplied: ${s.graceCoinApplied}`);
      });
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
