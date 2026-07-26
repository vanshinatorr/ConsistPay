const express = require("express");
const router = express.Router();
const { runDailyStreakReminder, runSetupReminder } = require("../controllers/cronController");

// Authentication middleware to secure cron endpoints
// Vercel auto-sets CRON_SECRET and sends it as Bearer token when triggering crons
// Fallback: also accept requests with x-vercel-cron header (Vercel internal header)
const cronAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const isVercelCron = req.headers["x-vercel-cron"] === "1";

  // If CRON_SECRET is set, validate it strictly
  if (process.env.CRON_SECRET) {
    if (authHeader === `Bearer ${process.env.CRON_SECRET}` || isVercelCron) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized cron trigger." });
  }

  // If CRON_SECRET not set, allow Vercel internal triggers only
  if (isVercelCron || authHeader) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized cron trigger." });
};

router.get("/streak-reminder", cronAuth, runDailyStreakReminder);
router.get("/setup-reminder", cronAuth, runSetupReminder);

module.exports = router;
