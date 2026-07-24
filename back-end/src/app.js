const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const dbMiddleware = require("./middleware/dbMiddleware");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "http://localhost:5175",
  "https://daily-coding-habit-tracker.vercel.app",
  "https://consistpay.tech",
  "https://www.consistpay.tech"
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



// app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "ConsistPay backend is live! 🚀" });
});

// Favicon handlers (avoids DB connection overhead and Vercel 404 warnings)
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/favicon.png", (req, res) => res.status(204).end());

// Apply DB connection guarantee middleware to all API routes
app.use(dbMiddleware);

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const submissionRoutes = require("./routes/submissions");
app.use("/api/submissions", submissionRoutes);


const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const challengeRoutes = require("./routes/challenges");
app.use("/api/challenges", challengeRoutes);

const platformRoutes = require("./routes/platforms");
app.use("/api/platforms", platformRoutes);


const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

const notificationRoutes = require("./routes/notifications");
app.use("/api/notifications", notificationRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Catch-all JSON Error Handling Middleware (SaaS Production Resilience)
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected server error occurred.",
    error: process.env.NODE_ENV === "development" ? err.stack : {}
  });
});

module.exports = app;