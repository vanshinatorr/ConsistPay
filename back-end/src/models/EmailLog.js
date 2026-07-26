const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true },
    templateType: {
      type: String,
      enum: ["welcome", "setup_reminder", "verification_nudge", "contract_activated", "streak_warning", "deduction", "low_balance", "milestone", "dormancy", "otp", "custom"],
      required: true,
    },
    status: { type: String, enum: ["sent", "failed"], required: true },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailLog", emailLogSchema);
