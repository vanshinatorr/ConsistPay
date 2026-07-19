const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // This tells MongoDB to auto-delete the document when 'expiresAt' is reached
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
