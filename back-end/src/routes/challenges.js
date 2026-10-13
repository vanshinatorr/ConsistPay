const express = require("express");
const router = express.Router();
const {
  createChallenge,
  getInviteDetails,
  joinChallenge,
  getActiveChallenges,
  getChallengeHistory,
  getChallengeById,
  cancelPendingChallenge,
  getPendingChallenge
} = require("../controllers/challengeController");
const { protect } = require("../middleware/authMiddleware");

// ─── Challenge / PvP Battle Routes (mounted at /api/challenges) ──────
// Full lifecycle: create → share invite code → opponent joins → active
// battle → winner determined by daily coding streaks → settlement.

// Lazy-expiry middleware: on every request to this router, fire-and-forget
// a sweep that marks stale "pending" challenges as expired. This supplements
// the setInterval in server.js and guarantees cleanup runs even on Vercel
// where the interval-based job doesn't exist (server.js isn't the entry point).
const runChallengeExpiry = async (req, res, next) => {
  try {
    const { expirePendingChallenges } = require("../controllers/challengeController");
    expirePendingChallenges().catch(err => console.error("[Lazy Expiry Error]:", err));
  } catch (err) {
    console.error("[Lazy Expiry Middleware Error]:", err);
  }
  next();
};

router.use(runChallengeExpiry);

router.post("/create", protect, createChallenge);
router.post("/cancel-pending", protect, cancelPendingChallenge);
router.get("/pending", protect, getPendingChallenge);
router.get("/invite/:code", protect, getInviteDetails);
router.post("/join/:code", protect, joinChallenge);
router.get("/active", protect, getActiveChallenges);
router.get("/history", protect, getChallengeHistory);
router.get("/:id", protect, getChallengeById);

module.exports = router;
