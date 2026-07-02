const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "http://localhost:5175",
  "https://daily-coding-habit-tracker.vercel.app"
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

module.exports = app;