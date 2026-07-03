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
      enum: ["LeetCode", "GeeksforGeeks", "GFG", "Code360", "Unknown"],
      required: true,
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
    submissionId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple nulls for legacy/screenshot entries
    },
    verificationMethod: {
      type: String,
      enum: ["auto", "screenshot", "manual"],
      default: "auto",
    },
    verificationStatus: {
      type: String,
      enum: ["verified", "pending", "failed"],
      default: "verified",
    },
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, date: -1 });
submissionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Submission", submissionSchema);