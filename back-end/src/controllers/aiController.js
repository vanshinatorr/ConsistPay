const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getInsights = async (req, res) => {
  try {
    const { streak, coins, totalSolved, totalMissed } = req.body;

    const prompt = `You are an AI coach for ConsistPay. Analyze this user data and respond ONLY in JSON format:
Streak: ${streak} days, Solved: ${totalSolved}, Missed: ${totalMissed}, Coins: ${coins}

Respond with this exact JSON:
{"placementReadiness":75,"riskLevel":"Medium","riskMessage":"Stay consistent this weekend","recommendedFocus":"Binary Search","consistencyMessage":"Good progress this week","strongestTopic":"Arrays","weakestTopic":"Dynamic Programming"}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const insights = JSON.parse(clean);

    res.status(200).json(insights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInsights };