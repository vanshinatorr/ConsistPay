const express = require("express");
const router = express.Router();
const { runDailyStreakReminder, runSetupReminder } = require("../controllers/cronController");

// Authentication middleware to secure cron endpoints
const cronAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized trigger query." });
  }
  next();
};

router.post("/streak-reminder", cronAuth, runDailyStreakReminder);
router.post("/setup-reminder", cronAuth, runSetupReminder);

module.exports = router;
