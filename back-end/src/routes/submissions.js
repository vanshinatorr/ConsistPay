
const express = require("express");
const router = express.Router();
const { getTodaySubmission, getMySubmissions, getCalendar } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/today", protect, getTodaySubmission);
router.get("/my", protect, getMySubmissions);
router.get("/calendar", protect, getCalendar);

module.exports = router;
