const express = require("express");
const router = express.Router();
const { getChatToken } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

// ─── Nexconn Chat Routes (mounted at /api/chat) ──────────────────────
// Returns a short-lived user connection token for the authenticated user.
// Rate limited to 30 requests per 5 minutes per IP to avoid third-party API spam.
router.get("/token", protect, rateLimiter(30, 5 * 60 * 1000), getChatToken);
router.post("/token", protect, rateLimiter(30, 5 * 60 * 1000), getChatToken);

module.exports = router;
