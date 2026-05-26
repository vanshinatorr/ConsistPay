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
      default: "Unknown",
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "missed", "pending"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);