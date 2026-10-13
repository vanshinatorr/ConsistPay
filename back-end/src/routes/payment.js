const express = require("express");
const router = express.Router();
const { 
  createOrder, verifyPayment, skipPayment, upgradePlan,
  createTopupOrder, verifyTopup, skipTopup,
  withdrawFunds, getWithdrawals
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// ─── Payment & Wallet Routes (mounted at /api/payment) ───────────────
// Three separate payment flows, all authenticated:
//   1. Stake payments  — create-order → verify (Razorpay callback) or skip
//   2. Withdrawals     — user requests payout, admin approves via admin routes
//   3. PvP top-ups     — fund the battle wallet for challenge stakes

// Stake payment flow (Razorpay)
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/skip", protect, skipPayment);
router.post("/upgrade", protect, upgradePlan);

// Withdrawal Routes
router.post("/withdraw", protect, withdrawFunds);
router.get("/withdrawals", protect, getWithdrawals);

// PVP Top-up Routes
router.post("/topup/create-order", protect, createTopupOrder);
router.post("/topup/verify", protect, verifyTopup);
router.post("/topup/skip", protect, skipTopup);

module.exports = router;