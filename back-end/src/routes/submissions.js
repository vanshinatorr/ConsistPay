const express = require("express");
const router = express.Router();
const { submitSolution, getMySubmissions } = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/submit", protect, submitSolution);
router.get("/my", protect, getMySubmissions);

module.exports = router;