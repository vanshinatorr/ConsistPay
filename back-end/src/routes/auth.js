const express = require("express");
const router = express.Router();
const rateLimiter = require("../middleware/rateLimiter");
const { 
  sendOtp, 
  verifyOtp, 
  googleAuth, 
  checkUsername, 
  completeSignup 
} = require("../controllers/authController");

// ─── Authentication Routes (mounted at /api/auth) ───────────────────
// None of these endpoints use `protect` because the user is not yet
// logged in. The flow is: send-otp → verify-otp → complete-signup,
// or alternatively google → complete-signup for OAuth users.

// Rate limit OTP endpoint: Max 5 requests per 10 minutes per IP.
// OTP delivery triggers a paid third-party email/SMS call, so rate
// limiting is critical to prevent abuse and billing spikes.
router.post("/send-otp", rateLimiter(5, 10 * 60 * 1000), sendOtp);

router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);
router.get("/check-username", checkUsername);
router.post("/complete-signup", completeSignup);

module.exports = router;