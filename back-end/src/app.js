const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "ConsistPay backend is live! 🚀" });
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const submissionRoutes = require("./routes/submissions");
app.use("/api/submissions", submissionRoutes);


const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);

module.exports = app;