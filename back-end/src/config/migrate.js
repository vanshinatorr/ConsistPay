const mongoose = require("mongoose");
const connectDB = require("./db");
const Submission = require("../models/Submission");
require("dotenv").config();

async function runMigration() {
  try {
    console.log("Starting DB Migration...");
    
    // Connect to database
    await connectDB();

    // 1. Force index synchronization for all defined models
    console.log("Synchronizing schema indexes...");
    await Submission.syncIndexes();
    console.log("Successfully synchronized indexes.");

    // 2. Backfill existing submissions where verificationMethod is not set
    console.log("Backfilling legacy screenshot submissions...");
    const result = await Submission.updateMany(
      { verificationMethod: { $exists: false } },
      { 
        $set: { 
          verificationMethod: "screenshot",
          verificationStatus: "verified"
        } 
      }
    );

    console.log(`Migration Complete. Updated ${result.modifiedCount} legacy records.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
}

runMigration();
