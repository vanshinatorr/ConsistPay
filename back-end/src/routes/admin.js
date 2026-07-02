const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
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

module.exports = router;
