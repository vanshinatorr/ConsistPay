const Submission = require("../models/Submission");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyScreenshot = async (base64Image, userProvidedProblemName) => {
  // Model version ko confirm karo - using gemini-flash-latest to avoid 404
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", temperature: 0.9 });

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

  const prompt = `Analyze this coding submission screenshot.
The user claims the problem name is: "${userProvidedProblemName || 'Unknown'}".

Tasks:
1. Detect platform (LeetCode/GFG/Code360/etc)
2. Detect whether submission is accepted (i.e., successful solution showing Accepted or Problem Solved Successfully)
3. Extract problem title from the screenshot (if missing, use the user's claim).
4. Determine the problem's DSA topic (e.g. Arrays, Strings, Trees, DP, Graphs, etc.) and difficulty (Easy, Medium, Hard).
5. Generate a 1-sentence recommended next step (e.g., "Try Medium Sliding Window problems tomorrow.").
6. Generate a very deep, hard-hitting 1-sentence motivation line focused on how consistency in DSA leads to top placements and jobs. Make the user realize that solving this one problem puts them ahead of the 99% who never even start. Keep it dynamic, intense, and highly variable each time so it hits hard. Examples of vibe: "While others are sleeping on their dreams, this one submission just secured a brick in your future FAANG offer.", "Consistency isn't just about streaks; it's the quiet language of top-tier placements."

Return ONLY a raw JSON response (no markdown, no backticks, just the JSON) with the following structure:
{
  "platform": "LeetCode" | "GFG" | "Code360" | "Unknown",
  "accepted": true/false,
  "problemName": "Extracted Problem Title",
  "topic": "DSA Topic",
  "difficulty": "Easy" | "Medium" | "Hard",
  "recommendation": "Recommendation text",
  "motivationLine": "Motivation text"
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

// getEnrichedAiAnalysis has been merged into verifyScreenshot for optimization

const submitSolution = async (req, res) => {
  try {
    const { problemName, screenshot } = req.body;
    const userId = req.user._id;

    console.log("Submit request received for user:", userId);

    if (!problemName || !screenshot) {
      return res.status(400).json({ message: "Problem name and screenshot are required." });
    }

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    // AI Verification start
    console.log("Starting unified AI verification and enrichment...");
    const verification = await verifyScreenshot(screenshot, problemName);
    console.log("AI Verification result:", verification);

    if (!verification.accepted) {
      return res.status(400).json({ message: "Verification failed: screenshot not accepted or not recognized as a success state." });
    }

    // Check if user has already completed a submission today
    const existingSubmission = await Submission.findOne({
      userId,
      date: today,
      status: "completed"
    });
    
    if (existingSubmission) {
      return res.status(400).json({ message: "You have already completed your daily commitment today!" });
    }

    // Extract problem name from AI or fallback to user input
    const finalProblemName = verification.problemName && verification.problemName !== "Unknown"
      ? verification.problemName
      : problemName;

    // Database save
    console.log("Saving submission with AI analysis to MongoDB...");
    const submission = await Submission.create({
      userId,
      problemName: finalProblemName,
      platform: verification.platform,
      date: today,
      status: "completed",
      topic: verification.topic || "General DSA",
      difficulty: verification.difficulty || "Easy",
      recommendation: verification.recommendation || "Keep practicing more problems to solidify your understanding.",
      motivationLine: verification.motivationLine || "One step is always better than never starting.",
      accepted: true
    });

    // Check Plan Expiry for Payouts
    const user = await User.findById(userId);
    const hasActivePlan = user.planExpiresAt && new Date(user.planExpiresAt) >= new Date();

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const yesterdaySubmission = await Submission.findOne({
      userId,
      date: yesterday,
      status: "completed"
    });

    let streakNotificationTitle = "";
    let streakNotificationMessage = "";

    if (yesterdaySubmission) {
      // Streak continues!
      user.streak = (user.streak || 0) + 1;
    } else {
      // Missed yesterday!
      if (user.streak > 0) {
        if (user.graceCoins > 0) {
          // Protected by Grace Coin
          user.graceCoins -= 1;
          user.streak = (user.streak || 0) + 1;
          streakNotificationTitle = "Streak Saved! 🛡️";
          streakNotificationMessage = "You missed yesterday, but your streak was protected by consuming 1 Grace Coin.";
        } else {
          // Streak broken
          user.streak = 1;
          streakNotificationTitle = "Streak Broken 💔";
          streakNotificationMessage = "You missed yesterday's submission. Your consistency streak has reset to 1.";
        }
      } else {
        // No active streak, just starting
        user.streak = 1;
      }
    }

    // Update max streak
    if (user.streak > (user.maxStreak || 0)) {
      user.maxStreak = user.streak;
    }

    // 15-day streak increments: every 15 days (15, 30, 45, 60, etc.), award +1 Grace Coin (Pro users only)
    if (user.streak % 15 === 0 && user.plan === "pro") {
      user.graceCoins = (user.graceCoins || 0) + 1;
      console.log(`Unlocked +1 grace coin for hitting ${user.streak}-day streak. Total: ${user.graceCoins}`);
      await createNotification(
        userId,
        "Grace Coin Unlocked! 🪙",
        `Congratulations on hitting a ${user.streak}-day streak! You've earned 1 Grace Coin.`,
        "streak"
      );
    }

    if (streakNotificationTitle) {
      await createNotification(userId, streakNotificationTitle, streakNotificationMessage, "streak");
    }

    // Balance payout is only for active plan holders
    if (hasActivePlan) {
      user.balance += (user.dailyCommitment || 0);
      console.log(`Paid balance reward of ₹${user.dailyCommitment} for active plan.`);
    }

    await user.save();
    console.log(`Updated user: streak=${user.streak}, maxStreak=${user.maxStreak}, balance=${user.balance}, graceCoins=${user.graceCoins}`);

    // Send Notification
    await createNotification(
      userId,
      "Submission Recorded 🚀",
      hasActivePlan ? "Your daily submission was verified and payout secured." : "Submission verified for active battles.",
      "streak"
    );

    console.log("Submission successful!");
    res.status(201).json({ 
      message: hasActivePlan ? "Verified & Payout Secured!" : "Verified for Battles!", 
      streak: user.streak, 
      submission,
      payoutGiven: hasActivePlan 
    });

  } catch (error) {
    console.error("CRITICAL SUBMIT ERROR:", error); 
    if (error.statusCode === 429) {
      return res.status(429).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const getTodaySubmission = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const submission = await Submission.findOne({
      userId: req.user._id,
      date: today,
      status: "completed"
    });
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const submissions = await Submission.find({
      userId: req.user._id,
      date: { $regex: `^${year}-${month.padStart(2, "0")}` }
    });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitSolution, getTodaySubmission, getMySubmissions, getCalendar };