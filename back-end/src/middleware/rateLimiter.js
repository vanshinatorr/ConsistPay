// ─── In-Memory Sliding-Window Rate Limiter ───────────────────────────
// Stores request timestamps per IP. No external dependencies — the Map
// lives in the Node process memory, which is fine for a single-instance
// deploy but resets on every Vercel cold start. That's an acceptable
// trade-off: cold starts are rare enough that abusers can't exploit the
// reset window meaningfully.
const rateLimits = new Map();

/**
 * Lightweight in-memory rate limiter middleware to protect sensitive endpoints from spam and brute-force attacks.
 * Built with production-grade stability and zero-dependency footprint.
 *
 * Returns a middleware function scoped to the given limits. Usage examples:
 *   rateLimiter(5,  10 * 60 * 1000)  → max 5 requests per 10 minutes  (OTP sending)
 *   rateLimiter(15,  5 * 60 * 1000)  → max 15 requests per 5 minutes  (platform sync / Gemini API)
 */
const rateLimiter = (limitCount, windowMs) => {
  return (req, res, next) => {
    // Safely extract client IP address (handling Vercel proxy headers).
    // x-forwarded-for is set by Vercel's edge network; fall back to the
    // raw socket address for local dev, and a global key as last resort.
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global_anonymous";
    const now = Date.now();

    if (!rateLimits.has(ip)) {
      rateLimits.set(ip, []);
    }

    let timestamps = rateLimits.get(ip);
    
    // Keep only timestamps within the current window — this gives a
    // sliding-window effect rather than fixed calendar buckets.
    timestamps = timestamps.filter(t => now - t < windowMs);
    rateLimits.set(ip, timestamps);

    if (timestamps.length >= limitCount) {
      return res.status(429).json({
        message: "Too many requests. Please slow down and try again later."
      });
    }

    // Record this request's timestamp so it counts toward the limit
    timestamps.push(now);
    next();
  };
};

module.exports = rateLimiter;
