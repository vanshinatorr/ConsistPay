require("../back-end/node_modules/dotenv").config({ path: __dirname + "/../back-end/.env" });
const mongoose = require("../back-end/node_modules/mongoose");
const User = require("../back-end/src/models/User");
const { syncUserStreak } = require("../back-end/src/utils/streakHelper");

const testUri = process.env.MONGO_URI.replace("/consistpay", "/test").replace("/?", "/test?");

mongoose.connect(testUri)
  .then(async () => {
    console.log("Connected to test MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      console.log("Triggering syncUserStreak...");
      const updatedUser = await syncUserStreak(user._id.toString());
      console.log("Sync complete!");
      console.log("Final State:", {
        balance: updatedUser.balance,
        activeDeposit: updatedUser.activeDeposit,
        streak: updatedUser.streak,
        graceCoins: updatedUser.graceCoins
      });
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
