const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    streak: { type: Number, default: 0 },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    dailyCommitment: { type: Number, enum: [5, 10, 20, 50], default: 5 },
    balance: { type: Number, default: 0 },
    graceCoins: { type: Number, default: 1 },
    onboardingComplete: { type: Boolean, default: false },
    planExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);