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

// Rate limit OTP endpoint: Max 5 requests per 10 minutes per IP
router.post("/send-otp", rateLimiter(5, 10 * 60 * 1000), sendOtp);

router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);
router.get("/check-username", checkUsername);
router.post("/complete-signup", completeSignup);

module.exports = router;