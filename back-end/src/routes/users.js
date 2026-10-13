const express = require("express");
const router = express.Router();
const { getMe, updateMe, getLeaderboard, addBattleFunds, devResetUser, requestBetaAccess, getBetaAccessRequests } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// ─── User Routes (mounted at /api/users) ─────────────────────────────
// Profile, leaderboard, battle-wallet funding, and beta-access requests.
// All endpoints require authentication. No admin authorization — admin
// user management lives in admin.js instead.
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/leaderboard", protect, getLeaderboard);
router.post("/add-battle-funds", protect, addBattleFunds);
router.post("/dev-reset", protect, devResetUser);
router.post("/beta-access", protect, requestBetaAccess);
router.get("/beta-access", protect, getBetaAccessRequests);

module.exports = router;