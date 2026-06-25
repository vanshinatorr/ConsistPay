const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opponentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    duration: {
      type: Number,
      enum: [7, 15, 30],
      required: true,
    },
    stake: {
      type: Number,
      required: true,
    },
    entryFee: {
      type: Number,
      default: 19,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "expired"],
      default: "pending",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

challengeSchema.index({ creatorId: 1 });
challengeSchema.index({ opponentId: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);
