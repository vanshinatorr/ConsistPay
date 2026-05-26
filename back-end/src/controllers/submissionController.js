const Submission = require("../models/Submission");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyScreenshot = async (base64Image) => {
  // Model version ko confirm karo
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Prefix hatao
  const base64Data = base64Image.split(",")[1] || base64Image;

  const prompt = `You are verifying a coding submission screenshot.
Look for: LeetCode/GFG/Code360 and a SUCCESS/ACCEPTED status.
Return ONLY JSON: {"valid": true, "platform": "LeetCode/GFG/Code360", "reason": "..."}`;

  try {
    const result = await model.generateContent([
      { inlineData: { mimeType: "image/png", data: base64Data } },
      { text: prompt },
    ]);

    const response = await result.response;
    let text = response.text().trim();
    
    // JSON nikalne ka robust tarika
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) throw new Error("AI response was not JSON: " + text);
    
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("GEMINI API ERROR:", err.message);
    throw err;
  }
};

const submitSolution = async (req, res) => {
  try {
    const { problemName, screenshot } = req.body;
    const userId = req.user._id;

    console.log("Submit request received for user:", userId);

    if (!problemName || !screenshot) {
      return res.status(400).json({ message: "Problem name and screenshot are required." });
    }

    const today = new Date().toISOString().split("T")[0];

    // AI Verification start
    console.log("Starting AI verification...");
    const verification = await verifyScreenshot(screenshot);
    console.log("AI Verification result:", verification);

    if (!verification.valid) {
      return res.status(400).json({ message: `Verification failed: ${verification.reason}` });
    }

    // Database save
    console.log("Saving to MongoDB...");
    await Submission.create({
      userId,
      problemName,
      platform: verification.platform,
      date: today,
      status: "completed",
    });

    // User update
    const user = await User.findById(userId);
    user.streak = (user.streak || 0) + 1;
    user.balance += (user.dailyCommitment || 0);
    await user.save();

    console.log("Submission successful!");
    res.status(201).json({ message: "Verified!", streak: user.streak });

  } catch (error) {
    // YAHI LINE HUMEIN ASLI ERROR BATAYEGI RENDER MEIN
    console.error("CRITICAL SUBMIT ERROR:", error); 
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ... Baki functions (getMySubmissions, getCalendar) as it is rehne do
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