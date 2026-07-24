const connectDB = require("../config/db");

/**
 * Middleware to guarantee the database connection is fully established before executing any route controllers.
 * Solves the Mongoose serverless race condition where queries are executed before cold start connections complete.
 */
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("[dbMiddleware] Failed to resolve database connection:", error.message);
    res.status(500).json({ 
      message: "Database connection failed. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : {}
    });
  }
};

module.exports = dbMiddleware;
