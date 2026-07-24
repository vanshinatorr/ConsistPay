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
  updateUser
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// Custom admin protect middleware
const adminProtect = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.email === "vanshvijay9784@gmail.com")) {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Admins only." });
  }
};

router.get("/stats", protect, adminProtect, getAdminStats);
router.get("/users", protect, adminProtect, getAdminUsers);
router.put("/users/:id", protect, adminProtect, updateUser);
router.get("/beta-requests", protect, adminProtect, getBetaRequests);
router.delete("/beta-requests/:id", protect, adminProtect, dismissBetaRequest);

// Withdrawal management endpoints
router.get("/withdrawals", protect, adminProtect, getAdminWithdrawals);
router.post("/withdrawals/:id/approve", protect, adminProtect, approveWithdrawal);
router.post("/withdrawals/:id/reject", protect, adminProtect, rejectWithdrawal);

module.exports = router;
