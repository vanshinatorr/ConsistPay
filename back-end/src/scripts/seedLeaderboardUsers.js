const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../../.env" });

const User = require("../models/User");
const Submission = require("../models/Submission");
const PlatformLinkage = require("../models/PlatformLinkage");

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const SIMULATED_PROFILES = [
  // ── Cohort 1: High Performers (Joined ~30 Days Ago) ──
  { name: "Rohan Sharma", username: "rohan_codes", email: "rohan.sharma.sim@consistpay.in", streak: 27, solvesPerDay: 4, joinedDaysAgo: 30, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
  { name: "Devansh Gupta", username: "devansh.dsa", email: "devansh.gupta.sim@consistpay.in", streak: 25, solvesPerDay: 5, joinedDaysAgo: 29, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh" },
  { name: "Priyansh Mehta", username: "priyansh.cpp", email: "priyansh.m.sim@consistpay.in", streak: 23, solvesPerDay: 3, joinedDaysAgo: 28, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priyansh" },
  { name: "Aarav Patel", username: "aarav_dev", email: "aarav.patel.sim@consistpay.in", streak: 22, solvesPerDay: 4, joinedDaysAgo: 27, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" },
  { name: "Tanisha Roy", username: "tanisha_bits", email: "tanisha.roy.sim@consistpay.in", streak: 20, solvesPerDay: 3, joinedDaysAgo: 26, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanisha" },
  { name: "Ananya Verma", username: "ananya_algo", email: "ananya.verma.sim@consistpay.in", streak: 19, solvesPerDay: 4, joinedDaysAgo: 25, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
  { name: "Tanmay Singh", username: "tanmay_nitro", email: "tanmay.singh.sim@consistpay.in", streak: 18, solvesPerDay: 5, joinedDaysAgo: 24, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanmay" },
  { name: "Ishaan Joshi", username: "ishaan_07", email: "ishaan.joshi.sim@consistpay.in", streak: 17, solvesPerDay: 3, joinedDaysAgo: 24, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan" },
  { name: "Kavya Menon", username: "kavya.dev", email: "kavya.menon.sim@consistpay.in", streak: 16, solvesPerDay: 4, joinedDaysAgo: 23, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya" },
  { name: "Aditya Kumar", username: "aditya_py", email: "aditya.kumar.sim@consistpay.in", streak: 16, solvesPerDay: 3, joinedDaysAgo: 22, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" },
  { name: "Sneha Reddy", username: "sneha_algo", email: "sneha.reddy.sim@consistpay.in", streak: 15, solvesPerDay: 4, joinedDaysAgo: 21, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
  { name: "Vikram Malhotra", username: "vikram_stack", email: "vikram.m.sim@consistpay.in", streak: 15, solvesPerDay: 3, joinedDaysAgo: 21, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },

  // ── Cohort 2: Solid Mid-Tier (Joined ~15 Days Ago) ──
  { name: "Riddhima Sen", username: "riddhima_cs", email: "riddhima.sen.sim@consistpay.in", streak: 14, solvesPerDay: 3, joinedDaysAgo: 17, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riddhima" },
  { name: "Siddharth Nair", username: "sid_builds", email: "siddharth.n.sim@consistpay.in", streak: 13, solvesPerDay: 4, joinedDaysAgo: 16, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth" },
  { name: "Mehul Chawla", username: "mehul_leetcoder", email: "mehul.chawla.sim@consistpay.in", streak: 12, solvesPerDay: 3, joinedDaysAgo: 15, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mehul" },
  { name: "Shreya Agarwal", username: "shreya_codez", email: "shreya.a.sim@consistpay.in", streak: 11, solvesPerDay: 4, joinedDaysAgo: 14, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shreya" },
  { name: "Yashvardhan Rao", username: "yash_dsa_pro", email: "yash.rao.sim@consistpay.in", streak: 10, solvesPerDay: 3, joinedDaysAgo: 13, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yash" },
  { name: "Nisha Kapoor", username: "nisha_geek", email: "nisha.kapoor.sim@consistpay.in", streak: 10, solvesPerDay: 2, joinedDaysAgo: 13, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nisha" },
  { name: "Karthik Pillai", username: "karthik_kernel", email: "karthik.p.sim@consistpay.in", streak: 9, solvesPerDay: 3, joinedDaysAgo: 12, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik" },
  { name: "Avani Deshmukh", username: "avani_dsa", email: "avani.d.sim@consistpay.in", streak: 9, solvesPerDay: 4, joinedDaysAgo: 12, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Avani" },
  { name: "Harsh Vardhan", username: "harsh_codex", email: "harsh.v.sim@consistpay.in", streak: 8, solvesPerDay: 2, joinedDaysAgo: 11, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh" },
  { name: "Diya Banerjee", username: "diya_logic", email: "diya.b.sim@consistpay.in", streak: 8, solvesPerDay: 3, joinedDaysAgo: 11, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diya" },
  { name: "Utkarsh Srivastava", username: "utkarsh_dev", email: "utkarsh.s.sim@consistpay.in", streak: 8, solvesPerDay: 3, joinedDaysAgo: 10, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Utkarsh" },
  { name: "Prisha Saxena", username: "prisha_code", email: "prisha.saxena.sim@consistpay.in", streak: 8, solvesPerDay: 2, joinedDaysAgo: 10, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prisha" },
  { name: "Manav Shah", username: "manav_byte", email: "manav.shah.sim@consistpay.in", streak: 7, solvesPerDay: 3, joinedDaysAgo: 9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manav" },

  // ── Cohort 3: Steady Starters (Joined ~5–7 Days Ago) ──
  { name: "Samarth Jain", username: "samarth_cpp", email: "samarth.jain.sim@consistpay.in", streak: 7, solvesPerDay: 2, joinedDaysAgo: 8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samarth" },
  { name: "Vaidehi Kulkarni", username: "vaidehi_codes", email: "vaidehi.k.sim@consistpay.in", streak: 6, solvesPerDay: 3, joinedDaysAgo: 7, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vaidehi" },
  { name: "Chirag Bhatt", username: "chirag_algo", email: "chirag.bhatt.sim@consistpay.in", streak: 6, solvesPerDay: 2, joinedDaysAgo: 7, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chirag" },
  { name: "Palak Tiwari", username: "palak_dev", email: "palak.tiwari.sim@consistpay.in", streak: 5, solvesPerDay: 3, joinedDaysAgo: 6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Palak" },
  { name: "Aaryan Sinha", username: "aaryan_solver", email: "aaryan.s.sim@consistpay.in", streak: 5, solvesPerDay: 2, joinedDaysAgo: 6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aaryan" },
  { name: "Nidhi Tripathi", username: "nidhi_cs", email: "nidhi.t.sim@consistpay.in", streak: 5, solvesPerDay: 3, joinedDaysAgo: 6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nidhi" },
  { name: "Gaurav Pandey", username: "gaurav_builds", email: "gaurav.p.sim@consistpay.in", streak: 4, solvesPerDay: 2, joinedDaysAgo: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gaurav" },
  { name: "Ananya Iyer", username: "ananya_iyer_dev", email: "ananya.i.sim@consistpay.in", streak: 4, solvesPerDay: 3, joinedDaysAgo: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaIyer" },
  { name: "Varun Nambiar", username: "varun_n", email: "varun.n.sim@consistpay.in", streak: 4, solvesPerDay: 2, joinedDaysAgo: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Varun" },
  { name: "Riya Singhal", username: "riya_codes", email: "riya.singhal.sim@consistpay.in", streak: 4, solvesPerDay: 2, joinedDaysAgo: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya" },
  { name: "Kunal Mehra", username: "kunal_dsa", email: "kunal.m.sim@consistpay.in", streak: 3, solvesPerDay: 3, joinedDaysAgo: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kunal" },
  { name: "Shruti Hegde", username: "shruti_geek", email: "shruti.h.sim@consistpay.in", streak: 3, solvesPerDay: 2, joinedDaysAgo: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shruti" },

  // ── Cohort 4: Recent Challengers (Joined 1–3 Days Ago) ──
  { name: "Kabir Gill", username: "kabir_codes", email: "kabir.g.sim@consistpay.in", streak: 3, solvesPerDay: 2, joinedDaysAgo: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir" },
  { name: "Trisha Dutt", username: "trisha_algo", email: "trisha.d.sim@consistpay.in", streak: 3, solvesPerDay: 3, joinedDaysAgo: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Trisha" },
  { name: "Abhinav Rastogi", username: "abhinav_dev", email: "abhinav.r.sim@consistpay.in", streak: 2, solvesPerDay: 2, joinedDaysAgo: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhinav" },
  { name: "Isha Mahajan", username: "isha_dsa", email: "isha.m.sim@consistpay.in", streak: 2, solvesPerDay: 2, joinedDaysAgo: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isha" },
  { name: "Tushar Bhatia", username: "tushar_cpp", email: "tushar.b.sim@consistpay.in", streak: 2, solvesPerDay: 1, joinedDaysAgo: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tushar" },
  { name: "Sanya Roy", username: "sanya_builds", email: "sanya.r.sim@consistpay.in", streak: 1, solvesPerDay: 2, joinedDaysAgo: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya" },
  { name: "Pranav Pillai", username: "pranav_codes", email: "pranav.p.sim@consistpay.in", streak: 1, solvesPerDay: 1, joinedDaysAgo: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav" },
  { name: "Bhavya Gupta", username: "bhavya_dsa", email: "bhavya.g.sim@consistpay.in", streak: 1, solvesPerDay: 2, joinedDaysAgo: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bhavya" },
];

const SAMPLE_DSA_PROBLEMS = [
  { title: "Two Sum", topic: "Arrays & Hashing", diff: "Easy" },
  { title: "Best Time to Buy and Sell Stock", topic: "Arrays & Hashing", diff: "Easy" },
  { title: "Valid Anagram", topic: "Strings", diff: "Easy" },
  { title: "Container With Most Water", topic: "Two Pointers", diff: "Medium" },
  { title: "3Sum", topic: "Two Pointers", diff: "Medium" },
  { title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", diff: "Medium" },
  { title: "Valid Parentheses", topic: "Stack", diff: "Easy" },
  { title: "Search in Rotated Sorted Array", topic: "Binary Search", diff: "Medium" },
  { title: "Reverse Linked List", topic: "Linked List", diff: "Easy" },
  { title: "Merge K Sorted Lists", topic: "Linked List", diff: "Hard" },
  { title: "Lowest Common Ancestor of a Binary Search Tree", topic: "Trees", diff: "Medium" },
  { title: "Binary Tree Level Order Traversal", topic: "Trees", diff: "Medium" },
  { title: "Maximum Depth of Binary Tree", topic: "Trees", diff: "Easy" },
  { title: "Number of Islands", topic: "Graphs", diff: "Medium" },
  { title: "Climbing Stairs", topic: "Dynamic Programming", diff: "Easy" },
  { title: "Coin Change", topic: "Dynamic Programming", diff: "Medium" },
  { title: "Word Break", topic: "Dynamic Programming", diff: "Medium" },
  { title: "Trapping Rain Water", topic: "Two Pointers", diff: "Hard" }
];

async function seedSimulatedUsers() {
  console.log("=== SEEDING 45 REALISTIC SIMULATED INDIAN LEADERBOARD USERS ===");
  await mongoose.connect(process.env.MONGO_URI);

  // Clean up existing simulated users
  const oldSimUsers = await User.find({ isSimulated: true });
  const oldSimIds = oldSimUsers.map(u => u._id);
  await Submission.deleteMany({ userId: { $in: oldSimIds } });
  await PlatformLinkage.deleteMany({ userId: { $in: oldSimIds } });
  await User.deleteMany({ isSimulated: true });
  console.log(`Cleaned up ${oldSimUsers.length} previous simulated users.`);

  const userDocs = [];
  const linkageDocs = [];
  const submissionDocs = [];

  for (const prof of SIMULATED_PROFILES) {
    const userId = new mongoose.Types.ObjectId();
    const createdDate = daysAgo(prof.joinedDaysAgo);
    const planExpiryDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    userDocs.push({
      _id: userId,
      name: prof.name,
      username: prof.username,
      email: prof.email,
      password: "simulated_user_hash_123",
      role: "user",
      plan: "pro",
      dailyCommitment: [10, 20, 50][Math.floor(Math.random() * 3)],
      activeDeposit: 300,
      streak: prof.streak,
      maxStreak: prof.streak + Math.floor(Math.random() * 3),
      onboardingComplete: true,
      onboardingCompletedAt: createdDate,
      planExpiresAt: planExpiryDate,
      graceCoins: Math.floor(Math.random() * 3),
      avatar: prof.avatar,
      isSimulated: true,
      createdAt: createdDate,
      updatedAt: new Date()
    });

    linkageDocs.push({
      userId: userId,
      platform: "LeetCode",
      username: prof.username,
      verificationToken: `CP-LEET-${Math.floor(100000 + Math.random() * 900000)}`,
      isVerified: true,
      verifiedAt: createdDate,
      totalSolved: prof.streak * prof.solvesPerDay + Math.floor(Math.random() * 10),
      easySolved: Math.floor(prof.streak * prof.solvesPerDay * 0.4),
      mediumSolved: Math.floor(prof.streak * prof.solvesPerDay * 0.5),
      hardSolved: Math.floor(prof.streak * prof.solvesPerDay * 0.1),
      createdAt: createdDate,
      updatedAt: new Date()
    });

    // Create daily submissions for each day of streak
    for (let day = 0; day < prof.streak; day++) {
      const subDate = daysAgo(prof.streak - 1 - day);
      const subDateStr = formatDate(subDate);

      for (let s = 0; s < prof.solvesPerDay; s++) {
        const prob = SAMPLE_DSA_PROBLEMS[Math.floor(Math.random() * SAMPLE_DSA_PROBLEMS.length)];
        submissionDocs.push({
          userId: userId,
          problemName: prob.title,
          platform: "LeetCode",
          date: subDateStr,
          status: "completed",
          topic: prob.topic,
          difficulty: prob.diff,
          recommendation: "Solid solve!",
          motivationLine: "Keep pushing!",
          accepted: true,
          submissionId: `sim-${userId}-${subDateStr}-${s}`,
          verificationMethod: "auto",
          verificationStatus: "verified",
          createdAt: subDate,
          updatedAt: subDate
        });
      }
    }
  }

  // Fast Batch Insert
  await User.insertMany(userDocs);
  await PlatformLinkage.insertMany(linkageDocs);
  await Submission.insertMany(submissionDocs);

  console.log(`\n✅ SUCCESSFULLY SEEDED ${userDocs.length} REALISTIC SIMULATED USERS!`);
  console.log(`✅ TOTAL SUBMISSIONS CREATED: ${submissionDocs.length}`);
  process.exit(0);
}

seedSimulatedUsers().catch(err => {
  console.error("FATAL SEED ERROR:", err);
  process.exit(1);
});
