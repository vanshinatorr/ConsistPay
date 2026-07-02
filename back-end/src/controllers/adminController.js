const User = require("../models/User");
const PlatformLinkage = require("../models/PlatformLinkage");
const Submission = require("../models/Submission");
const Challenge = require("../models/Challenge");
const Withdrawal = require("../models/Withdrawal");

// Helper to format "time ago" dynamically on the backend
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getAdminStats = async (req, res) => {
  try {
    // 1. Overview Metrics calculations
    const [
      totalUsers,
      connectedUsers,
      activeStreaks,
      newUsersToday,
      newUsersThisWeek,
      totalGoals
    ] = await Promise.all([
      User.countDocuments({}),
      PlatformLinkage.countDocuments({ isVerified: true }),
      User.countDocuments({ streak: { $gt: 0 } }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Submission.countDocuments({ status: "solved" })
    ]);

    // Average Streak length calculation
    const avgStreakResult = await User.aggregate([
      { $group: { _id: null, avgStreak: { $avg: "$streak" } } }
    ]);
    const averageStreak = parseFloat((avgStreakResult[0]?.avgStreak || 0).toFixed(1));

    // Total Problems Solved (Sum of all totalSolved across verified linkages)
    const totalSolvedResult = await PlatformLinkage.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: null, total: { $sum: "$totalSolved" } } }
    ]);
    const totalProblemsSolved = totalSolvedResult[0]?.total || 0;

    // Coins Distributed (sum of graceCoins and battleBalance)
    const coinsResult = await User.aggregate([
      { $group: { _id: null, totalGrace: { $sum: "$graceCoins" }, totalBattle: { $sum: "$battleBalance" } } }
    ]);
    const totalCoins = (coinsResult[0]?.totalGrace || 0) + (coinsResult[0]?.totalBattle || 0);

    // Active Users (DAU, WAU, MAU based on distinct submissions activity)
    const [dauUsers, wauUsers, mauUsers] = await Promise.all([
      Submission.distinct("userId", { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Submission.distinct("userId", { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Submission.distinct("userId", { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    ]);

    // 2. Growth Timeline calculation (Group users registered per day for past 30 days)
    const userGrowthRaw = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build user growth timeline array
    const userGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const match = userGrowthRaw.find(g => g._id === dateStr);
      userGrowth.push({ date: dateStr.substring(5), count: match ? match.count : 0 });
    }

    // 3. User Analytics list (detailed overview table)
    const allUsersList = await User.find({}).sort({ streak: -1 }).limit(10);
    const platformLinkages = await PlatformLinkage.find({ userId: { $in: allUsersList.map(u => u._id) } });

    const userAnalyticsList = allUsersList.map(u => {
      const link = platformLinkages.find(l => String(l.userId) === String(u._id));
      return {
        user: u.name,
        handle: link?.platformUsername || "not-linked",
        streak: u.streak,
        solved: link?.totalSolved || 0,
        today: false, // will update dynamically below if they have a solve today
        plan: u.plan === "pro" ? "Pro" : "Free"
      };
    });

    // Mark who solved today
    const solvedTodayUserIds = await Submission.distinct("userId", {
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    userAnalyticsList.forEach(item => {
      const dbUser = allUsersList.find(u => u.name === item.user);
      if (dbUser && solvedTodayUserIds.map(String).includes(String(dbUser._id))) {
        item.today = true;
      }
    });

    // 4. Live Activity timeline feed construction
    const [latestSubmissions, latestLinkages, latestUsers] = await Promise.all([
      Submission.find({}).sort({ createdAt: -1 }).limit(5).populate("userId", "name username"),
      PlatformLinkage.find({}).sort({ createdAt: -1 }).limit(5).populate("userId", "name username"),
      User.find({}).sort({ createdAt: -1 }).limit(5)
    ]);

    const feedEvents = [];
    latestSubmissions.forEach(sub => {
      feedEvents.push({
        id: `sub-${sub._id}`,
        time: formatTimeAgo(sub.createdAt),
        rawTime: sub.createdAt,
        user: sub.userId?.name || "Anonymous",
        event: `Solved "${sub.problemTitle || "DSA Problem"}"`,
        detail: `Verified on ${sub.platform} • +50 Coins`,
        type: "solve"
      });
    });

    latestLinkages.forEach(link => {
      feedEvents.push({
        id: `link-${link._id}`,
        time: formatTimeAgo(link.createdAt),
        rawTime: link.createdAt,
        user: link.userId?.name || "Anonymous",
        event: `Connected ${link.platform}`,
        detail: `Profile: @${link.platformUsername}`,
        type: "link"
      });
    });

    latestUsers.forEach(u => {
      feedEvents.push({
        id: `user-${u._id}`,
        time: formatTimeAgo(u.createdAt),
        rawTime: u.createdAt,
        user: u.name,
        event: "Joined ConsistPay",
        detail: "Account created successfully",
        type: "signup"
      });
    });

    // Sort combined feed chronologically
    feedEvents.sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime());

    // 5. Wallet & Financial stats
    const totalDepositsResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$activeDeposit" } } }
    ]);
    const activeDepositPool = totalDepositsResult[0]?.total || 0;

    const coinsEarnedToday = solvedTodayUserIds.length * 50;

    res.status(200).json({
      overview: {
        totalUsers,
        connectedUsers,
        dau: dauUsers.length,
        wau: wauUsers.length,
        mau: mauUsers.length,
        newUsersToday,
        newUsersThisWeek,
        activeStreaks,
        averageStreak,
        totalGoals,
        totalProblemsSolved,
        totalCoins
      },
      growth: {
        userGrowth
      },
      userAnalytics: userAnalyticsList,
      activityFeed: feedEvents.slice(0, 8),
      wallet: {
        coinsEarnedToday,
        activeDepositPool,
        payoutReserves: activeDepositPool * 1.5 // Mock prediction factor
      }
    });

  } catch (error) {
    console.error("Admin stats aggregation error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };
