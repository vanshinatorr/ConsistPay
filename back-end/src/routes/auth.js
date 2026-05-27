const express = require("express");
const router = express.Router();
const { 
  sendOtp, 
  verifyOtp, 
  googleAuth, 
  checkUsername, 
  completeSignup 
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);
router.get("/check-username", checkUsername);
router.post("/complete-signup", completeSignup);

module.exports = router;