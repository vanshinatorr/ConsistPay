const path = require("path");

// Load environment variables before anything else so MONGO_URI, PORT, and
// API keys are available to every module imported after this line.
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// app.js exports the fully-configured Express application (middleware + routes).
// Importing it here keeps server boot concerns separate from request handling.
const app = require("./app");
const { expirePendingChallenges } = require("./controllers/challengeController");

const PORT = process.env.PORT || 8000;

// ─── Process Stability Guards ────────────────────────────────────────
// These listeners log unexpected errors instead of letting the Node process
// crash outright. In a serverless deploy (Vercel) errors are thrown to the
// platform; in a long-running server they keep the process alive so a single
// bad async path doesn't take down everything.
// IMPORTANT: We intentionally avoid process.exit(1) here — see AGENTS.md §2.
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception caught:", error);
});

// ─── Server Boot ─────────────────────────────────────────────────────
// Start listening for HTTP requests. On Vercel this file is NOT the entry
// point (vercel.json points at app.js instead), so the listen call only
// runs in local development or non-Vercel hosts.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the 1-minute auto-expiry job for pending battles.
  // This polls the DB and marks stale "pending" challenges as expired
  // so users aren't left waiting on an opponent who never responded.
  setInterval(expirePendingChallenges, 60 * 1000);
  console.log("Background job started: Pending battle expiry checker (1m interval)");
});