const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));
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


const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

module.exports = app;