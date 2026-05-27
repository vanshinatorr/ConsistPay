const express = require("express");
const router = express.Router();
const { getMe, updateMe, getLeaderboard, addBattleFunds } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/leaderboard", protect, getLeaderboard);
router.post("/add-battle-funds", protect, addBattleFunds);

module.exports = router;