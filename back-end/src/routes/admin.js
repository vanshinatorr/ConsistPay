const express = require("express");
const router = express.Router();
const { 
  getAdminStats, 
  getBetaRequests, 
  dismissBetaRequest,
  getAdminWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getAdminUsers,
  updateUser,
  syncUserStreakAdmin,
  getEmailLogs,
  sendCustomEmailAdmin
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// ─── Admin Routes (mounted at /api/admin) ────────────────────────────
// Every endpoint here runs through TWO middleware layers:
//   1. protect      → authenticates the JWT (who are you?)
//   2. adminProtect → authorizes the role  (are you allowed?)
// This separation means a valid token alone is not enough — the user
// must also have the "admin" role or match the owner email.

// Custom admin protect middleware — authorization, not authentication.
// Returns 403 (Forbidden) instead of 401 because the user IS authenticated
// at this point, they just lack the required role.
const adminProtect = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.email === "vanshvijay9784@gmail.com")) {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Admins only." });
  }
};

// User & platform management
router.get("/stats", protect, adminProtect, getAdminStats);
router.get("/users", protect, adminProtect, getAdminUsers);
router.put("/users/:id", protect, adminProtect, updateUser);
router.post("/users/:id/sync-streak", protect, adminProtect, syncUserStreakAdmin);
router.get("/beta-requests", protect, adminProtect, getBetaRequests);
router.delete("/beta-requests/:id", protect, adminProtect, dismissBetaRequest);

// Withdrawal management endpoints
router.get("/withdrawals", protect, adminProtect, getAdminWithdrawals);
router.post("/withdrawals/:id/approve", protect, adminProtect, approveWithdrawal);
router.post("/withdrawals/:id/reject", protect, adminProtect, rejectWithdrawal);

// Email logs tracking endpoint
router.get("/email-logs", protect, adminProtect, getEmailLogs);
router.post("/send-email", protect, adminProtect, sendCustomEmailAdmin);

module.exports = router;
