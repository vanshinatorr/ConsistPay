const mongoose = require("mongoose");

const betaAccessRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Enforce unique constraints so a user can request access for a category only once
betaAccessRequestSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("BetaAccessRequest", betaAccessRequestSchema);
