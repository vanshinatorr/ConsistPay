require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Submission = require("./src/models/Submission");
const Notification = require("./src/models/Notification");
const Challenge = require("./src/models/Challenge");

async function resetDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected. Erasing all data...");

    await User.deleteMany({});
    console.log("Deleted all users.");

    await Submission.deleteMany({});
    console.log("Deleted all submissions.");

    await Notification.deleteMany({});
    console.log("Deleted all notifications.");

    if (Challenge) {
      await Challenge.deleteMany({});
      console.log("Deleted all challenges.");
    }

    console.log("Data wipe complete. You can now start fresh.");
    process.exit(0);
  } catch (error) {
    console.error("Error wiping data:", error);
    process.exit(1);
  }
}

resetDB();
