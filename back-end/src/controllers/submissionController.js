const Submission = require("../models/Submission");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyScreenshot = async (base64Image) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // 1. Detect MimeType and Extract Pure Base64 Data
  const mimeTypeMatch = base64Image.match(/^data:(image\/\w+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
  const base64Data = base64Image.split(",")[1] || base64Image;

  const prompt = `You are verifying a coding submission screenshot for ConsistPay.
Check if this image shows a SUCCESSFUL/ACCEPTED coding submission.
Platform must be one of: LeetCode, GeeksforGeeks, or Code360.

Return ONLY a JSON object in this format:
{"valid": true, "platform": "LeetCode/GFG/Code360/Unknown", "status": "accepted/failed", "reason": "brief reason"}

Rules:
- valid = true only if platform is LeetCode/GFG/Code360 AND status is clearly accepted/solved.
- LeetCode: look for green "Accepted".
- GFG: look for "Problem Solved Successfully".
- Code360: look for "Accepted" or "All Test Cases Passed".`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      { text: prompt },
    ]);

    const response = await result.response;
    let text = response.text().trim();
    
    // 2. Robust JSON Extraction (Find first { and last })
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanJson = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(cleanJson);
    } else {
        console.error("AI response is not JSON:", text);
        throw new Error("Invalid AI response format");
    }
  } catch (err) {
    console.error("Gemini Internal Error:", err.message);
    throw new Error("AI verification failed due to an internal error.");
  }
};

const submitSolution = async (req, res) => {
  try {
    const { problemName, screenshot } = req.body;
    const userId = req.user._id;

    if (!problemName || !screenshot) {
      return res.status(400).json({ message: "Problem name and screenshot are required." });
    }

    // Check if already submitted today
    const today = new Date().toISOString().split("T")[0];
    const alreadySubmitted = await Submission.findOne({ userId, date: today });
    
    if (alreadySubmitted) {
      return res.status(400).json({ message: "Already submitted today. Keep it up tomorrow!" });
    }

    // Verify with Gemini
    let verification;
    try {
      verification = await verifyScreenshot(screenshot);
    } catch (err) {
      return res.status(500).json({ message: "AI Verification failed. Please ensure the screenshot is clear." });
    }

    if (!verification.valid) {
      return res.status(400).json({
        message: `Verification failed: ${verification.reason}`,
      });
    }

    // Save Submission
    await Submission.create({
      userId,
      problemName,
      platform: verification.platform,
      date: today,
      status: "completed",
    });

    // Update User Streak and Balance
    const user = await User.findById(userId);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    const yesterdaySub = await Submission.findOne({ userId, date: yesterdayStr });
    
    if (yesterdaySub) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }

    user.balance += user.dailyCommitment;
    await user.save();

    res.status(201).json({
      message: "Verified! Streak and balance updated.",
      streak: user.streak,
      balance: user.balance,
      platform: verification.platform
    });

  } catch (error) {
    console.error("Submission Controller Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;
    // Regex to match YYYY-MM-DD
    const submissions = await Submission.find({
      userId: req.user._id,
      date: { $regex: `^${year}-${month.padStart(2, "0")}` }
    });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitSolution, getMySubmissions, getCalendar };