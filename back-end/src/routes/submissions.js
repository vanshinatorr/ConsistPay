
const express = require("express");
const router = express.Router();
const { submitSolution, getTodaySubmission, getMySubmissions, getCalendar } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/submit", protect, submitSolution);
router.get("/today", protect, getTodaySubmission);
router.get("/my", protect, getMySubmissions);
router.get("/calendar", protect, getCalendar);

module.exports = router;
