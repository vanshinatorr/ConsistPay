const express = require("express");
const router = express.Router();
const { getMe, getLeaderboard } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.get("/leaderboard", protect, getLeaderboard);

module.exports = router;