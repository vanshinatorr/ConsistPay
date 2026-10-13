const express = require("express");
const router = express.Router();
const rateLimiter = require("../middleware/rateLimiter");
const { protect } = require("../middleware/authMiddleware");
const {
  linkPlatform,
  verifyPlatform,
  syncPlatform,
  getPlatformLinkage,
  deletePlatformLinkage,
} = require("../controllers/platformController");

// ─── Platform Integration Routes (mounted at /api/platforms) ─────────
// Manages the connection between a user's ConsistPay account and their
// coding platform (e.g. LeetCode). The typical lifecycle is:
//   link → verify (Gemini AI checks profile bio) → sync (pull daily solves)
router.post("/link", protect, linkPlatform);
router.delete("/link", protect, deletePlatformLinkage);
router.post("/verify", protect, verifyPlatform);

// Rate limit sync endpoint: Max 15 requests per 5 minutes per IP (protects Gemini API quota).
// Sync calls the external coding platform API + Gemini AI, both of which
// are metered — the rate limit prevents runaway costs from rapid-fire requests.
router.post("/sync", protect, rateLimiter(15, 5 * 60 * 1000), syncPlatform);

router.get("/linkage", protect, getPlatformLinkage);

module.exports = router;
