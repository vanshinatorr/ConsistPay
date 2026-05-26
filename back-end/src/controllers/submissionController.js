const Submission = require("../models/Submission");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyScreenshot = async (base64Image) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // FIX 1: Remove Base64 Prefix (data:image/png;base64, etc.)
  const base64Data = base64Image.split(",")[1] || base64Image;

  const prompt = `You are verifying a coding submission screenshot for ConsistPay.
Check this screenshot and respond ONLY in this exact JSON format:
{"valid": true, "platform": "LeetCode/GFG/Code360/Unknown", "status": "accepted/failed/unknown", "reason": "brief reason"}

Rules:
- valid = true ONLY if platform is LeetCode OR GeeksforGeeks OR Code360 AND status shows accepted/correct
- LeetCode accepted = green "Accepted" text
- GFG accepted = "Problem Solved Successfully" 
- Code360 accepted = green "Accepted" with test cases passed
- Any other platform = valid false
- If screenshot is unclear or fake looking = valid false`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/png", // Usually works for all formats
        data: base64Data,
      },
    },
    { text: prompt },
  ]);

  const response = await result.response;
  let text = response.text();
  
  // FIX 2: Better JSON cleaning
  text = text.replace(/```json|```/gi, "").trim();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error from Gemini:", text);
    throw new Error("AI response was not valid JSON");
  }
};

const submitSolution = async (req, res) => {
  try {
    const { problemName, screenshot } = req.body;
    const userId = req.user._id;

    if (!problemName || !screenshot) {
      return res.status(400).json({ message: "Problem name and screenshot are required." });
    }

    const today = new Date().toISOString().split("T")[0];
    const alreadySubmitted = await Submission.findOne({ userId, date: today });
    
    if (alreadySubmitted) {
      return res.status(400).json({ message: "Already submitted today. Come back tomorrow!" });
    }

    // 3. Gemini verification
    let verification;
    try {
      verification = await verifyScreenshot(screenshot);
    } catch (err) {
      console.error("Gemini Error:", err.message);
      return res.status(500).json({ message: "AI Verification failed. Please try a clearer screenshot." });
    }

    if (!verification.valid) {
      return res.status(400).json({
        message: `Verification failed: ${verification.reason}`,
      });
    }

    // 4. Save Submission
    await Submission.create({
      userId,
      problemName,
      platform: verification.platform,
      date: today,
      status: "completed",
    });

    // 5. Update Streak and Balance
    const user = await User.findById(userId);
    
    // Check if yesterday had a submission to continue streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    const yesterdaySub = await Submission.findOne({ userId, date: yesterdayStr });
    
    if (yesterdaySub) {
      user.streak += 1;
    } else {
      user.streak = 1; // Streak resets or starts at 1
    }

    user.balance += user.dailyCommitment;
    await user.save();

    res.status(201).json({
      message: "Verified! Streak updated.",
      streak: user.streak,
      balance: user.balance
    });

  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ... baki functions same rahenge
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
      // Simple regex search or date range for the month
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