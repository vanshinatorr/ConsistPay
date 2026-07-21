const rateLimits = new Map();

/**
 * Lightweight in-memory rate limiter middleware to protect sensitive endpoints from spam and brute-force attacks.
 * Built with production-grade stability and zero-dependency footprint.
 */
const rateLimiter = (limitCount, windowMs) => {
  return (req, res, next) => {
    // Safely extract client IP address (handling Vercel proxy headers)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global_anonymous";
    const now = Date.now();

    if (!rateLimits.has(ip)) {
      rateLimits.set(ip, []);
    }

    let timestamps = rateLimits.get(ip);
    
    // Filter out timestamps older than the configured window
    timestamps = timestamps.filter(t => now - t < windowMs);
    rateLimits.set(ip, timestamps);

    if (timestamps.length >= limitCount) {
      return res.status(429).json({
        message: "Too many requests. Please slow down and try again later."
      });
    }

    timestamps.push(now);
    next();
  };
};

module.exports = rateLimiter;
