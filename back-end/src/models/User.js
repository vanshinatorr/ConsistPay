const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    authProviders: [{ type: String, enum: ["email", "phone", "google"] }],
    streak: { type: Number, default: 0 },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    dailyCommitment: { type: Number, enum: [5, 10, 20, 50], default: 5 },
    balance: { type: Number, default: 0 },
    battleBalance: { type: Number, default: 0 },
    graceCoins: { type: Number, default: 1 },
    onboardingComplete: { type: Boolean, default: false },
    planExpiresAt: { type: Date, default: null },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);