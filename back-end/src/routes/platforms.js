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

router.post("/link", protect, linkPlatform);
router.delete("/link", protect, deletePlatformLinkage);
router.post("/verify", protect, verifyPlatform);

// Rate limit sync endpoint: Max 15 requests per 5 minutes per IP (protects Gemini API quota)
router.post("/sync", protect, rateLimiter(15, 5 * 60 * 1000), syncPlatform);

router.get("/linkage", protect, getPlatformLinkage);

module.exports = router;
