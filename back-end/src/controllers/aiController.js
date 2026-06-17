const { GoogleGenerativeAI } = require("@google/generative-ai");
const Submission = require("../models/Submission");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { streak, coins, totalSolved, totalMissed } = req.body;

    // Fetch user's submission history to analyze solved topics (limited to last 30 to prevent token bloat)
    const submissions = await Submission.find({ userId })
      .select("problemName platform date")
      .sort({ date: -1 })
      .limit(30);
    const problemsList = submissions.map(s => `${s.problemName} (${s.platform})`).join(", ");

    const prompt = `You are an AI placement readiness and coding consistency coach for ConsistPay.
Analyze this user's coding statistics and submission history to generate highly personalized insights:
- Streak: ${streak} days
- Solved challenges: ${totalSolved}
- Missed challenges: ${totalMissed}
- Current Wallet Coins: ${coins}
- Recently solved problems: [${problemsList || "None yet"}]

Based on the problems solved, analyze the data structures & algorithms (DSA) topics (e.g. Arrays, Strings, Trees, Sorting, Binary Search, Graphs, Dynamic Programming, Stacks, Queues, etc.) and their frequency.
Determine:
1. placementReadiness: a score from 0 to 100 based on their solved count, streak, and consistency.
2. riskLevel: "High" | "Medium" | "Low" (risk of breaking their consistency streak based on missed days and active streak).
3. riskMessage: A brief warning or motivational message to prevent them from missing days (e.g. "Stay consistent this weekend to keep your streak").
4. recommendedFocus: Which DSA topic they should practice next (suggest a topic based on their solved history, or a core topic if they haven't solved much).
5. consistencyMessage: A brief sentence commenting on their habit consistency.
6. strongestTopic: The DSA topic they solved the most problems in (infer this from problem names, e.g. "Two Sum" -> "Arrays", "Binary Search" -> "Binary Search"). If no problems, return "None".
7. weakestTopic: A topic they need to focus on or haven't solved much yet (e.g. "Dynamic Programming" or "Trees").

Respond ONLY in raw JSON format (no markdown code blocks, no backticks, no extra text) matching this structure:
{
  "placementReadiness": 75,
  "riskLevel": "Medium",
  "riskMessage": "Stay consistent this weekend to keep your streak",
  "recommendedFocus": "Binary Search",
  "consistencyMessage": "Good progress this week",
  "strongestTopic": "Arrays",
  "weakestTopic": "Dynamic Programming"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean response of any markdown formatting and parse safely
    let insights;
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      insights = JSON.parse(clean);
    } catch (parseError) {
      console.warn("Direct insights JSON parse failed, trying regex match:", text);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          insights = JSON.parse(jsonMatch[0]);
        } catch (regexParseError) {
          console.error("Failed to parse matched insights JSON:", jsonMatch[0]);
          throw new Error("Invalid response format from insights AI.");
        }
      } else {
        throw new Error("Could not extract JSON from insights AI response.");
      }
    }

    res.status(200).json(insights);
  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInsights };