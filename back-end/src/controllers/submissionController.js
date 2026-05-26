const Submission = require("../models/Submission");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyScreenshot = async (base64Image) => {
  // Model version ko confirm karo - using gemini-flash-latest to avoid 404
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  // Dynamic mimeType detection and base64 cleanup
  let mimeType = "image/png"; // default fallback
  let base64Data = base64Image;
  
  if (base64Image.includes(";base64,")) {
    const parts = base64Image.split(";base64,");
    const mimePart = parts[0];
    base64Data = parts[1];
    if (mimePart.startsWith("data:")) {
      mimeType = mimePart.substring(5);
    }
  }

  const prompt = `You are verifying a coding submission screenshot.
Look for: LeetCode, GeeksforGeeks (GFG), or Code360.
Verify that the screenshot shows a successful code submission:
- LeetCode: look for "Accepted" (usually in green text), along with test case stats (e.g. "Runtime", "Memory" or list of test cases passed).
- GeeksforGeeks (GFG): look for "Problem Solved Successfully" or stats showing all test cases passed.
- Code360: look for "Accepted", "All Test Cases Passed", or similar successful indicators.

Return ONLY a raw JSON response (no markdown, no backticks, just the JSON) with the following structure:
{
  "valid": true/false,
  "platform": "LeetCode" | "GFG" | "Code360" | "Unknown",
  "problemName": "Name of the problem extracted from the screenshot or 'Unknown'",
  "reason": "Brief explanation of why it is valid or invalid"
}`;

  try {
    const result = await model.generateContent([
      { inlineData: { mimeType, data: base64Data } },
      { text: prompt },
    ]);

    const response = await result.response;
    const responseText = response.text().trim();
    
    // JSON nikalne ka robust tarika (removing markdown code blocks/backticks)
    let verification;
    try {
      const cleanJsonStr = responseText.replace(/```json|```/g, "").trim();
      verification = JSON.parse(cleanJsonStr);
    } catch (parseError) {
      console.error("Direct JSON parse failed, trying regex match:", responseText);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          verification = JSON.parse(jsonMatch[0]);
        } catch (regexParseError) {
          console.error("Failed to parse matched JSON:", jsonMatch[0]);
          throw new Error("Invalid response format from verification AI.");
        }
      } else {
        throw new Error("Could not extract JSON from verification AI response.");
      }
    }

    return verification;
  } catch (err) {
    console.error("GEMINI API ERROR:", err.message);
    if (err.message.includes("429") || err.message.includes("Quota exceeded") || err.message.includes("Too Many Requests")) {
      const rateLimitError = new Error("AI verification service is busy (rate limit exceeded). Please try again in a few seconds.");
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }
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

    // Check if user has already completed a submission today
    const existingSubmission = await Submission.findOne({
      userId,
      date: today,
      status: "completed"
    });
    
    const isFirstSubmissionToday = !existingSubmission;

    // Extract problem name from AI or fallback to user input
    const finalProblemName = verification.problemName && verification.problemName !== "Unknown"
      ? verification.problemName
      : problemName;

    // Database save
    console.log("Saving to MongoDB...");
    await Submission.create({
      userId,
      problemName: finalProblemName,
      platform: verification.platform,
      date: today,
      status: "completed",
    });

    // User update
    const user = await User.findById(userId);
    if (isFirstSubmissionToday) {
      user.streak = (user.streak || 0) + 1;
      user.balance += (user.dailyCommitment || 0);
      await user.save();
      console.log(`Updated streak to ${user.streak} and balance to ${user.balance}`);
    } else {
      console.log(`User already submitted today. Streak (${user.streak}) and Balance (${user.balance}) remain unchanged.`);
    }

    console.log("Submission successful!");
    res.status(201).json({ message: "Verified!", streak: user.streak });

  } catch (error) {
    console.error("CRITICAL SUBMIT ERROR:", error); 
    if (error.statusCode === 429) {
      return res.status(429).json({ message: error.message });
    }
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