const express = require("express");
const router = express.Router();
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
router.post("/sync", protect, syncPlatform);
router.get("/linkage", protect, getPlatformLinkage);

module.exports = router;
