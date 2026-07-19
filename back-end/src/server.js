const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const app = require("./app");
const { expirePendingChallenges } = require("./controllers/challengeController");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the 1-minute auto-expiry job for pending battles
  setInterval(expirePendingChallenges, 60 * 1000);
  console.log("Background job started: Pending battle expiry checker (1m interval)");
});