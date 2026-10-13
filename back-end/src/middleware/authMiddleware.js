const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Authentication Middleware ───────────────────────────────────────
// `protect` verifies the caller's identity (authentication). It does NOT
// check roles or permissions — that's authorization, handled separately
// where needed (e.g. adminProtect in the admin routes).
//
// Flow: extract Bearer token → verify signature → load user from DB →
// attach user to req.user so downstream handlers can use it.
const protect = async (req, res, next) => {
  try {
    // Expect the header format: "Bearer <token>"
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Strip the "Bearer " prefix to get the raw JWT
    token = token.split(" ")[1];

    // jwt.verify throws if the token is expired, malformed, or signed
    // with a different secret — the catch block returns a 401 for all cases.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hydrate the full user document (minus password) so route handlers
    // can access req.user.email, req.user.role, req.user.balance, etc.
    // without making another DB call.
    req.user = await User.findById(decoded.id).select("-password");

    // Guard against a valid token for a user that has since been deleted
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    // Covers expired tokens, signature mismatches, and malformed JWTs
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };