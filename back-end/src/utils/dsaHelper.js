/**
 * DSA Helper utility to dynamically classify a coding problem based on its title,
 * extracting DSA topics, estimation of difficulty, recommendations, and motivational quotes.
 */

/**
 * Helper to dynamically classify any DSA problem based on its title keywords.
 * Extracts appropriate category topic, difficulty tier, recommendation guides, 
 * and positive reinforcement quotes for consistency tracking logs.
 * @param {string} problemName - The title of the solved DSA problem.
 * @returns {object} Object containing topic, difficulty, recommendation, and motivationLine fields.
 */
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
    topic,
    difficulty,
    recommendation,
    motivationLine
  };
};

module.exports = {
  getLocalFallbackDetails
};
