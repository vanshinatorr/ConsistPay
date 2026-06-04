const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemName: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "GFG", "Code360", "Unknown"],
      required: true, // Hum ise AI se nikaal rahe hain toh required hona chahiye
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "missed", "pending"],
      default: "completed",
    },
    // AI Proof Analysis Cache Fields
    topic: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "",
    },
    recommendation: {
      type: String,
      default: "",
    },
    motivationLine: {
      type: String,
      default: "",
    },
    accepted: {
      type: Boolean,
      default: true,
    },
    isFallback: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);