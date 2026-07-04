const mongoose = require("mongoose");

const platformLinkageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "GeeksforGeeks", "GFG", "Code360", "GitHub", "Codeforces"],
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Enforce unique constraints at the database level:
// 1. One user can only link one account per platform.
platformLinkageSchema.index({ userId: 1, platform: 1 }, { unique: true });

// 2. An external platform account can only be linked to one ConsistPay user.
platformLinkageSchema.index({ platform: 1, username: 1 }, { unique: true });

module.exports = mongoose.model("PlatformLinkage", platformLinkageSchema);
