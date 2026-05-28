const app = require("./app");
const connectDB = require("./config/db");
const { expirePendingChallenges } = require("./controllers/challengeController");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the 1-minute auto-expiry job for pending battles
  setInterval(expirePendingChallenges, 60 * 1000);
  console.log("Background job started: Pending battle expiry checker (1m interval)");
});