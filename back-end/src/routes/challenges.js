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
