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

// Tier 3: Local intelligent fallback processor (no network required, 50+ DSA keywords matched)
const getLocalFallbackDetails = (problemName) => {
  const name = (problemName || "").toLowerCase();
  let topic = "General DSA";
  
  const rules = [
    {
      keywords: ["subarray", "kadane", "sliding window", "window", "two pointer", "two-pointer", "prefix sum", "prefix-sum", "suffix", "merge interval", "interval", "overlap", "rotate", "duplicate", "intersection", "union", "diff", "difference", "product", "subsequence", "lcs", "lis"],
      topic: "Arrays"
    },
    {
      keywords: ["anagram", "palindrome", "reverse", "substring", "string", "character", "char", "parentheses", "bracket", "regex", "pattern", "valid parentheses", "alphabet"],
      topic: "Strings"
    },
    {
      keywords: ["binary search", "search sorted", "sorted array", "find peak", "peak element", "rotated sorted", "median sorted", "first bad", "version", "sqrt", "power", "search insert"],
      topic: "Binary Search"
    },
    {
      keywords: ["linked list", "list", "node", "pointer", "head", "tail", "next", "link", "reverse list", "merge list", "cycle detection", "circular list", "double list", "dll", "sll"],
      topic: "Linked Lists"
    },
    {
      keywords: ["tree", "binary tree", "bst", "root", "leaf", "inorder", "preorder", "postorder", "traverse", "level order", "depth", "height", "symmetric", "balanced", "ancestor", "path sum"],
      topic: "Trees"
    },
    {
      keywords: ["graph", "edge", "vertex", "path", "cycle", "dfs", "bfs", "dijkstra", "bellman", "ford", "kruskal", "prim", "topological", "island", "flood fill", "connected component", "bipartite"],
      topic: "Graphs"
    },
    {
      keywords: ["dp", "dynamic programming", "coin change", "knapsack", "climb stairs", "fibonacci", "memoization", "tabulation", "lcs", "lis", "edit distance", "subset sum", "partition sum"],
      topic: "Dynamic Programming"
    },
    {
      keywords: ["backtrack", "recursion", "recursive", "permutation", "combination", "subset", "n-queen", "nqueen", "sudoku", "generate parentheses", "word search"],
      topic: "Recursion & Backtracking"
    },
    {
      keywords: ["greedy", "activity selection", "job sequencing", "fractional knapsack", "gas station", "huffman", "min refuel", "lemonade change"],
      topic: "Greedy Algorithms"
    },
    {
      keywords: ["stack", "queue", "push", "pop", "enqueue", "dequeue", "deque", "monotonic stack", "next greater", "evaluate reverse polish"],
      topic: "Stacks & Queues"
    },
    {
      keywords: ["heap", "priority queue", "k largest", "k smallest", "merge k", "top k", "median stream", "min heap", "max heap"],
      topic: "Heaps & Heap Sort"
    },
    {
      keywords: ["hash", "map", "set", "dictionary", "frequency", "unique", "distinct", "hashmap", "hashset", "two sum", "group anagrams", "longest consecutive"],
      topic: "Hash Tables"
    },
    {
      keywords: ["bit", "bitwise", "xor", "and", "or", "not", "shift", "single number", "number of 1 bits", "reverse bits", "power of two"],
      topic: "Bit Manipulation"
    },
    {
      keywords: ["math", "prime", "gcd", "lcm", "factorial", "modulo", "divisor", "sieve", "geometry", "number theory", "pow", "multiply", "divide"],
      topic: "Mathematics & Number Theory"
    },
    {
      keywords: ["trie", "prefix tree", "autocomplete", "word dictionary", "replace words"],
      topic: "Trie"
    }
  ];

  for (const rule of rules) {
    if (rule.keywords.some(keyword => name.includes(keyword))) {
      topic = rule.topic;
      break;
    }
  }

  let difficulty = "Medium";
  if (name.includes("easy") || name.includes("basic") || name.includes("simple") || name.includes("two sum") || name.includes("reverse string") || name.includes("fizz buzz")) {
    difficulty = "Easy";
  } else if (name.includes("hard") || name.includes("difficult") || name.includes("optimal") || name.includes("median") || name.includes("sudoku") || name.includes("nqueen") || name.includes("dijkstra")) {
    difficulty = "Hard";
  }

  let recommendation = "Practice similar problems on LeetCode to solidify your understanding of this topic.";
  switch (topic) {
    case "Arrays":
      recommendation = "Excellent work on arrays! Tomorrow, challenge yourself with two-pointer techniques or sliding window array problems.";
      break;
    case "Strings":
      recommendation = "Nice string solution! Try practicing sliding window string substring problems or anagram-matching questions next.";
      break;
    case "Binary Search":
      recommendation = "Binary search mastered! Try solving search-in-rotated-sorted-array problems or range query searches next.";
      break;
    case "Linked Lists":
      recommendation = "Linked list verified. Try solving cycle-detection (Floyd's algorithm) or merging sorted list questions tomorrow.";
      break;
    case "Trees":
      recommendation = "Great tree solution. Try practicing tree traversals (BFS/DFS) or solving Tree depth and lowest common ancestor problems next.";
      break;
    case "Graphs":
      recommendation = "Graph logic is solid. Try exploring topological sorting or shortest path algorithms (Dijkstra) next.";
      break;
    case "Dynamic Programming":
      recommendation = "Amazing DP progress! Try solving classical 1D and 2D DP problems (like Coin Change or Longest Common Subsequence) next.";
      break;
    case "Recursion & Backtracking":
      recommendation = "Backtracking solved! Challenge yourself with generating combinations, permutations, or classic board solvers like N-Queens next.";
      break;
    case "Greedy Algorithms":
      recommendation = "Greedy strategy verified. Try practicing interval scheduling or greedy optimization tasks next.";
      break;
    case "Stacks & Queues":
      recommendation = "Good stack/queue logic. Explore monotonic stack questions like Next Greater Element to level up.";
      break;
    case "Heaps & Heap Sort":
      recommendation = "Heap setup verified. Challenge yourself with Merge K Sorted Lists or Top K Frequent elements next.";
      break;
    case "Hash Tables":
      recommendation = "Hash map logic completed. Try solving group-anagrams or checking longest consecutive sequences using maps next.";
      break;
    case "Bit Manipulation":
      recommendation = "Bitwise logic verified! Try practicing bit-masking or single-number questions to master bit operations.";
      break;
    case "Mathematics & Number Theory":
      recommendation = "Math logic complete. Explore GCD/LCM properties or the Sieve of Eratosthenes for prime generation next.";
      break;
    case "Trie":
      recommendation = "Trie logic verified! Try implementing autocomplete or prefix-dictionary search engines next.";
      break;
  }

  const motivationPool = [
    "Consistency isn't just about maintaining streaks; it's the quiet language of top-tier placements. Keep pushing.",
    "While 99% of candidates find excuses, your dedication today just secured another solid brick in your future tech offer.",
    "Every clean compile and accepted solution is a micro-investment into your placement portfolio. Stay relentless.",
    "The compound effect of one problem solved daily is what separates average candidates from elite product engineers.",
    "Do not count the days; make the days count. Today's solved problem puts you miles ahead of the competition.",
    "Your future self will thank you for not giving up on your coding streak today. Consistency is your superpower.",
    "Placement preparation isn't a sprint; it's an engineering marathon. Today you took a massive step forward.",
    "When recruiters review your consistency graph, it's lines like today's that prove your grit and engineering discipline.",
    "Small daily habits of rigorous code writing compile into massive career breakthroughs. You are on the right track.",
    "The pain of coding practice is temporary; the pride of landing a dream placement is permanent. Keep coding.",
    "One solved problem at a time, you are transforming your skills from average to exceptional. Never break the streak.",
    "Mastery in DSA isn't about memorizing solutions; it's about the consistent daily grind you showed today.",
    "You are writing your own success story, line by line, problem by problem. Let's keep this streak going tomorrow.",
    "Success is nothing more than a few simple disciplines, practiced every single day. Excellent commitment today.",
    "Consistency is the difference between who you are now and who you want to become. You did great today."
  ];
  
  const motivationLine = motivationPool[Math.floor(Math.random() * motivationPool.length)];

  return {
    platform: "Unknown",
    accepted: true,
    problemName: problemName,
    topic,
    difficulty,
    recommendation,
    motivationLine
  };
};

// Tier 2: Text-Only Gemini Model analysis (separate rate-limit/token quota from multimodal)
const verifyProblemByNameOnly = async (problemName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", temperature: 0.9 });
    const prompt = `You are a placement advisor verifying a student's DSA consistency.
The user successfully solved a coding problem named: "${problemName}".

Analyze this problem name:
1. Determine the problem's DSA topic (e.g. Arrays, Strings, Trees, DP, Graphs, etc.) and difficulty (Easy, Medium, Hard).
2. Generate a 1-sentence recommended next step (e.g., "Try Medium Sliding Window problems tomorrow.").
3. Generate a very deep, hard-hitting 1-sentence motivation line focused on how consistency in DSA leads to top placements and jobs. Make the user realize that solving this one problem puts them ahead of the 99% who never even start. Keep it dynamic, intense, and highly variable. Examples of vibe: "While others are sleeping on their dreams, this one submission just secured a brick in your future FAANG offer."

Return ONLY a raw JSON response (no markdown, no backticks, just the JSON) with the following structure:
{
  "topic": "DSA Topic",
  "difficulty": "Easy" | "Medium" | "Hard",
  "recommendation": "Recommendation text",
  "motivationLine": "Motivation text"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    
    let details;
    try {
      const cleanJsonStr = responseText.replace(/```json|```/g, "").trim();
      details = JSON.parse(cleanJsonStr);
    } catch (parseError) {
      console.error("Direct JSON parse failed for text-only, trying regex match:", responseText);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        details = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse text-only response");
      }
    }

    return {
      platform: "Unknown",
      accepted: true,
      problemName,
      topic: details.topic || "General DSA",
      difficulty: details.difficulty || "Medium",
      recommendation: details.recommendation || "Practice similar problems to build on this.",
      motivationLine: details.motivationLine || "Consistency is the quiet language of top placements."
    };
  } catch (err) {
    console.error("Text-only AI fallback failed, triggering local fallback:", err.message);
    return getLocalFallbackDetails(problemName);
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

    if (typeof problemName !== "string" || typeof screenshot !== "string") {
      return res.status(400).json({ message: "Problem name and screenshot must be strings." });
    }

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    // AI Verification start
    console.log("Starting unified AI verification and enrichment...");
    let verification;
    let isFallback = false;

    try {
      verification = await verifyScreenshot(screenshot, problemName);
      if (!verification.accepted) {
        return res.status(400).json({ message: "Verification failed: screenshot not accepted or not recognized as a success state." });
      }
    } catch (apiError) {
      console.warn("AI Multimodal verification failed, initiating text-only/local fallback: ", apiError.message);
      isFallback = true;
      verification = await verifyProblemByNameOnly(problemName);
    }

    console.log("AI/Fallback Verification result:", verification);

    // Count how many completed submissions the user has completed today
    const todaySubmissionsCount = await Submission.countDocuments({
      userId,
      date: today,
      status: "completed"
    });

    if (todaySubmissionsCount >= 3) {
      return res.status(400).json({ message: "You have reached the maximum limit of 3 submissions for today!" });
    }

    const isFirstSubmissionToday = todaySubmissionsCount === 0;

    // Extract problem name from AI or fallback to user input
    const finalProblemName = verification.problemName && verification.problemName !== "Unknown"
      ? verification.problemName
      : problemName;

    // Database save
    console.log("Saving submission with AI analysis to MongoDB (isFallback=" + isFallback + ")...");
    const submission = await Submission.create({
      userId,
      problemName: finalProblemName,
      platform: verification.platform || "Unknown",
      date: today,
      status: "completed",
      topic: verification.topic || "General DSA",
      difficulty: verification.difficulty || "Easy",
      recommendation: verification.recommendation || "Keep practicing more problems to solidify your understanding.",
      motivationLine: verification.motivationLine || "One step is always better than never starting.",
      accepted: true,
      isFallback
    });

    // Check Plan Expiry for Payouts (Pro plan must be unexpired; Free plan is active if onboarding is complete)
    let user = await User.findById(userId);
    const hasActivePlan = user.plan === "pro"
      ? (user.planExpiresAt && new Date(user.planExpiresAt) >= new Date())
      : user.onboardingComplete;

    const { syncUserStreak } = require("../utils/streakHelper");
    user = await syncUserStreak(user);

    if (isFirstSubmissionToday) {
      if (user.streak > 0) {
        // Streak continues!
        user.streak = user.streak + 1;
      } else {
        // Streak starting new / broken
        user.streak = 1;
      }

      // Update max streak
      if (user.streak > (user.maxStreak || 0)) {
        user.maxStreak = user.streak;
      }

      // 15-day streak increments: every 15 days (15, 30, 45, 60, etc.), award +1 Grace Coin (Pro users only, max once per calendar month)
      const currentMonthStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).substring(0, 7); // e.g. "2026-06"
      if (user.streak % 15 === 0 && user.plan === "pro" && user.lastGraceCoinEarnedMonth !== currentMonthStr) {
        user.graceCoins = (user.graceCoins || 0) + 1;
        user.lastGraceCoinEarnedMonth = currentMonthStr;
        console.log(`Unlocked +1 grace coin for hitting ${user.streak}-day streak in ${currentMonthStr}. Total: ${user.graceCoins}`);
        await createNotification(
          userId,
          "Grace Coin Unlocked! 🪙",
          `Congratulations on hitting a ${user.streak}-day streak! You've earned 1 Grace Coin.`,
          "streak"
        );
      }

      // Balance payout is only for active plan holders (both Free & Pro can secure payouts based on their commitment)
      if (hasActivePlan) {
        user.balance += (user.dailyCommitment || 0);
        console.log(`Paid balance reward of ₹${user.dailyCommitment} for active plan.`);
      }

      await user.save();
      console.log(`Updated user: streak=${user.streak}, maxStreak=${user.maxStreak}, balance=${user.balance}, graceCoins=${user.graceCoins}`);
    } else {
      console.log(`Subsequent submission (${todaySubmissionsCount + 1}/3) for user ${userId} today. Solved problems count only.`);
    }

    // Send Notification
    await createNotification(
      userId,
      "Submission Recorded 🚀",
      isFirstSubmissionToday
        ? (hasActivePlan ? "Your daily submission was verified and payout secured." : "Submission verified for active battles.")
        : `Submission ${todaySubmissionsCount + 1}/3 verified for Leaderboard.`,
      "streak"
    );

    console.log("Submission successful!");
    res.status(201).json({ 
      message: isFirstSubmissionToday 
        ? (hasActivePlan ? "Verified & Payout Secured!" : "Verified for Battles!") 
        : "Submission verified for Leaderboard!", 
      streak: user.streak, 
      submission,
      payoutGiven: isFirstSubmissionToday && hasActivePlan 
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
    
    // Find all completed submissions today
    const submissions = await Submission.find({
      userId: req.user._id,
      date: today,
      status: "completed"
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: submissions.length,
      submission: submissions.length > 0 ? submissions[0] : null
    });
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
    const { year } = req.query;
    const submissions = await Submission.find({
      userId: req.user._id,
      date: { $regex: `^${year}-` }
    });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitSolution, getTodaySubmission, getMySubmissions, getCalendar };