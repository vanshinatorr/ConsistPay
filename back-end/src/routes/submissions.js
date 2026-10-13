
const express = require("express");
const router = express.Router();
const { getTodaySubmission, getMySubmissions, getCalendar } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

// ─── Submission Routes (mounted at /api/submissions) ─────────────────
// Read-only endpoints for the authenticated user's coding activity.
// Submissions are created by the sync flow (platformController), not here.
router.get("/today", protect, getTodaySubmission);
router.get("/my", protect, getMySubmissions);
router.get("/calendar", protect, getCalendar);

module.exports = router;
