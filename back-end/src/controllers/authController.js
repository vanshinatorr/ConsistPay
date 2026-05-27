const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const { createNotification } = require("./notificationController");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Basic Nodemailer setup (will need actual credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const DICEBEAR_STYLES = ["adventurer", "bottts", "micah", "notionists", "pixel-art", "lorelei", "fun-emoji"];

const generateRandomAvatar = () => {
  const style = DICEBEAR_STYLES[Math.floor(Math.random() * DICEBEAR_STYLES.length)];
  const seed = Math.random().toString(36).substring(2, 8);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=transparent`;
};

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate a JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// Generate a Temporary Token for incomplete signups
const generateTempToken = (data) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "15m" });

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email or phone
 */
const sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "Email or Phone is required" });

    const isEmail = identifier.includes('@');
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Delete existing OTPs for this identifier to prevent spam
    await Otp.deleteMany({ identifier });

    // Create new OTP with 5 mins expiry
    await Otp.create({
      identifier,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60000) // 5 minutes
    });

    if (isEmail) {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: `"ConsistPay" <${process.env.EMAIL_USER}>`,
          to: identifier,
          subject: "Your ConsistPay Login Code",
          text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
          html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>It is valid for 5 minutes.</p>`
        });
        console.log(`[AUTH] Sent real email OTP to ${identifier}`);
      } else {
        // Fallback for development without SMTP setup
        console.log(`[AUTH MOCK] OTP for ${identifier} is ${otp}`);
      }
    } else {
      // Mock SMS
      console.log(`[AUTH MOCK SMS] OTP for phone ${identifier} is ${otp}`);
    }

    res.status(200).json({ 
      message: "OTP sent successfully",
      mockOtp: otp // Included for testing/development purposes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login or request signup completion
 */
const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    
    const otpRecord = await Otp.findOne({ identifier });
    if (!otpRecord) return res.status(400).json({ message: "OTP expired or invalid" });

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // OTP Verified, clean up
    await Otp.deleteOne({ _id: otpRecord._id });

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    let user = await User.findOne(query);

    if (user) {
      // EXISTING USER -> Login directly
      if (!user.authProviders.includes(isEmail ? "email" : "phone")) {
        user.authProviders.push(isEmail ? "email" : "phone");
        await user.save();
      }
      return res.status(200).json({
        isNewUser: false,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, username: user.username, avatar: user.avatar }
      });
    } else {
      // NEW USER -> Needs to complete profile
      const tempToken = generateTempToken({ identifier, type: isEmail ? "email" : "phone" });
      return res.status(200).json({
        isNewUser: true,
        tempToken,
        message: "Please complete your profile"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate with Google OAuth
 */
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Google token missing" });

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (e) {
      console.error("Google Auth Error:", e);
      return res.status(401).json({ message: "Google authentication failed. Invalid token." });
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ message: "Invalid Google token payload" });

    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Link Google Account if not linked
      let updated = false;
      if (!user.googleId) { user.googleId = googleId; updated = true; }
      if (!user.authProviders.includes("google")) { user.authProviders.push("google"); updated = true; }
      if (!user.avatar && picture) { user.avatar = picture; updated = true; }
      
      if (updated) await user.save();

      return res.status(200).json({
        isNewUser: false,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, username: user.username, avatar: user.avatar }
      });
    } else {
      // New User via Google
      const tempToken = generateTempToken({ identifier: email, type: "google", googleId, name, picture });
      return res.status(200).json({
        isNewUser: true,
        tempToken,
        suggestedName: name,
        message: "Please complete your profile"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

/**
 * @route   GET /api/auth/check-username
 * @desc    Check if username is available
 */
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username required" });
    
    // basic format check: only letters, numbers, underscores
    const regex = /^[a-zA-Z0-9_]{3,15}$/;
    if (!regex.test(username)) {
      return res.status(200).json({ available: false, error: "Must be 3-15 chars, letters/numbers/_ only." });
    }

    const exists = await User.findOne({ username: username.toLowerCase() });
    res.status(200).json({ available: !exists });
  } catch (error) {
    res.status(500).json({ message: "Error checking username" });
  }
};

/**
 * @route   POST /api/auth/complete-signup
 * @desc    Complete registration for a new user
 */
const completeSignup = async (req, res) => {
  try {
    const { tempToken, name, username } = req.body;
    if (!tempToken || !name || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: "Session expired. Please try again." });
    }

    // Double check username availability
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) return res.status(400).json({ message: "Username already taken" });

    // Build new user object
    const newUser = {
      name: name.trim(),
      username: username.toLowerCase().trim(),
      authProviders: [decoded.type],
      avatar: decoded.picture || generateRandomAvatar(),
      onboardingComplete: false,
    };

    if (decoded.type === "email") {
      newUser.email = decoded.identifier;
    } else if (decoded.type === "phone") {
      newUser.phone = decoded.identifier;
    } else if (decoded.type === "google") {
      newUser.email = decoded.identifier;
      newUser.googleId = decoded.googleId;
    }

    const user = await User.create(newUser);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  googleAuth,
  checkUsername,
  completeSignup
};