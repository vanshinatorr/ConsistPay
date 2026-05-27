require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const user = await User.findOne({ email: "vanshvijay9784@gmail.com" });
    if (user) {
      user.plan = "pro";
      user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      user.graceCoins = 2;
      user.onboardingComplete = true;
      await user.save();
      console.log("User updated to PRO:", user);
    } else {
      console.log("User not found");
    }
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
