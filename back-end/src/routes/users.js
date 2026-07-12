const express = require("express");
const router = express.Router();
const { getMe, updateMe, getLeaderboard, addBattleFunds, devResetUser, requestBetaAccess, getBetaAccessRequests } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/leaderboard", protect, getLeaderboard);
router.post("/add-battle-funds", protect, addBattleFunds);
router.post("/dev-reset", protect, devResetUser);
router.post("/beta-access", protect, requestBetaAccess);
router.get("/beta-access", protect, getBetaAccessRequests);

module.exports = router;