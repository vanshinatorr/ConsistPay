const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const app = require("./app");
const { expirePendingChallenges } = require("./controllers/challengeController");

const PORT = process.env.PORT || 8000;

// Prevent server crash from unhandled async rejections and uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception caught:", error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the 1-minute auto-expiry job for pending battles
  setInterval(expirePendingChallenges, 60 * 1000);
  console.log("Background job started: Pending battle expiry checker (1m interval)");
});