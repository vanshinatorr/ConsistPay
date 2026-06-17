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
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1a1a1a;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8b5cf6; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">ConsistPay</h1>
            </div>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px 30px; text-align: center;">
              <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 600;">Your Verification Code</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                Please use the following verification code to securely access your ConsistPay account.
              </p>
              
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 0 auto 30px auto; max-width: 250px; letter-spacing: 8px; font-size: 32px; font-weight: 700; color: #0f172a; text-align: center;">
                ${otp}
              </div>
              
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                This code is valid for <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
              <p style="margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Commit First. Motivation Later.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} ConsistPay. All rights reserved.</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"ConsistPay" <${process.env.EMAIL_USER}>`,
          to: identifier,
          subject: `${otp} is your ConsistPay verification code`,
          text: `Your ConsistPay verification code is: ${otp}. It is valid for 5 minutes.`,
          html: emailHtml
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
    const { credential, access_token } = req.body;
    if (!credential && !access_token) return res.status(400).json({ message: "Google token missing" });

    let payload;
    
    if (access_token) {
      // Flow for custom useGoogleLogin button (returns access_token)
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (!response.ok) {
        return res.status(401).json({ message: "Google authentication failed. Invalid access token." });
      }
      payload = await response.json();
    } else {
      // Flow for standard GoogleLogin component (returns credential id_token)
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
      payload = ticket.getPayload();
    }

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
    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Username required and must be a string" });
    }
    
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