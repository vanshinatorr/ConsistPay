const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// dotenv is called here as well as in server.js because on Vercel the entry
// point is app.js (see vercel.json), so server.js never runs. Loading env
// vars in both files ensures they're available regardless of the entry path.
dotenv.config({ path: path.join(__dirname, "../.env") });

const dbMiddleware = require("./middleware/dbMiddleware");

const app = express();

// ─── CORS Configuration ─────────────────────────────────────────────
// Allow requests from local dev servers and the production domains.
// The regex also accepts any *.vercel.app preview deployment URL so that
// PR previews can talk to the API without an explicit whitelist entry.
// Passing credentials: true lets the browser send cookies / auth headers.
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
    // !origin covers server-to-server calls and curl (no Origin header)
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



// ─── Body Parsers ────────────────────────────────────────────────────
// Parse JSON and URL-encoded bodies with a 10 MB cap to support
// base64-encoded avatar uploads without hitting the default 100 KB limit.
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ─── Lightweight Routes (no DB needed) ───────────────────────────────
// These are registered BEFORE dbMiddleware so they respond instantly
// without opening a database connection — important for health checks
// and Vercel's favicon probes that fire on every cold start.

// Test route
app.get("/", (req, res) => {
  res.json({ message: "ConsistPay backend is live! 🚀" });
});

// Favicon handlers (avoids DB connection overhead and Vercel 404 warnings)
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/favicon.png", (req, res) => res.status(204).end());

// ─── Database Connection Middleware ──────────────────────────────────
// From this point forward, every request is guaranteed to have an active
// MongoDB connection before reaching any route handler. This eliminates
// the Mongoose cold-start race condition on Vercel serverless functions.
// All routes mounted AFTER this line inherit the guarantee automatically.
app.use(dbMiddleware);

// ─── API Route Mounting ──────────────────────────────────────────────
// Each feature area has its own router file. Express processes them in
// registration order, so if two routers match the same path the one
// mounted first wins. All paths are prefixed under /api/<domain>.
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

const cronRoutes = require("./routes/cron");
app.use("/api/crons", cronRoutes);

const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);

// Debug: LeetCode API connectivity test (checks if Vercel can reach LeetCode from its servers)
app.get("/api/debug/leetcode-test", async (req, res) => {
  const username = req.query.username || "vanshinatorr";
  try {
    const QUERY = `query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { aboutMe }
      }
    }`;
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({ query: QUERY, variables: { username } })
    });
    const json = await response.json();
    res.json({
      status: response.status,
      userFound: !!json.data?.matchedUser,
      aboutMe: json.data?.matchedUser?.profile?.aboutMe || "(empty)",
      errors: json.errors || null,
      raw: json
    });
  } catch(e) {
    res.status(500).json({ error: e.message, type: "NETWORK_ERROR" });
  }
});

// ─── Global Error Handler ────────────────────────────────────────────
// Express recognises this as an error-handling middleware because it has
// four parameters (err, req, res, next). It must be registered AFTER all
// routes so it catches errors thrown or forwarded by any handler above.
// In production the stack trace is hidden; in development it's included
// to make debugging easier.
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected server error occurred.",
    error: process.env.NODE_ENV === "development" ? err.stack : {}
  });
});

module.exports = app;