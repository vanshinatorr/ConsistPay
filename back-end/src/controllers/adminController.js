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
      Submission.countDocuments({ status: "completed" })
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
        handle: link?.username || "not-linked",
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
      if (!sub.userId) return; // Skip if user is null/deleted
      feedEvents.push({
        id: `sub-${sub._id}`,
        time: formatTimeAgo(sub.createdAt),
        rawTime: sub.createdAt,
        user: sub.userId.name || "Anonymous",
        event: `Solved "${sub.problemName || "DSA Problem"}"`,
        detail: `Verified on ${sub.platform} • +50 Coins`,
        type: "solve"
      });
    });

    latestLinkages.forEach(link => {
      if (!link.userId) return; // Skip if user is null/deleted
      feedEvents.push({
        id: `link-${link._id}`,
        time: formatTimeAgo(link.createdAt),
        rawTime: link.createdAt,
        user: link.userId.name || "Anonymous",
        event: `Connected ${link.platform}`,
        detail: `Profile: @${link.username}`,
        type: "link"
      });
    });

    latestUsers.forEach(u => {
      if (!u) return;
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

const getBetaRequests = async (req, res) => {
  try {
    const BetaAccessRequest = require("../models/BetaAccessRequest");
    const requests = await BetaAccessRequest.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Filter out requests where user is null (deleted users)
    const validRequests = requests.filter(r => r.userId !== null);
    res.status(200).json(validRequests);
  } catch (error) {
    console.error("Error fetching admin beta requests:", error);
    res.status(500).json({ message: error.message });
  }
};

const dismissBetaRequest = async (req, res) => {
  try {
    const BetaAccessRequest = require("../models/BetaAccessRequest");
    const { id } = req.params;
    await BetaAccessRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Beta request resolved successfully." });
  } catch (error) {
    console.error("Error dismissing beta request:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAdminWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(withdrawals);
  } catch (error) {
    console.error("Error fetching admin withdrawals:", error);
    res.status(500).json({ message: error.message });
  }
};

const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found." });
    }
    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Withdrawal request is already resolved." });
    }
    withdrawal.status = "completed";
    await withdrawal.save();

    // Create a notification for the user
    const Notification = require("../models/Notification");
    await Notification.create({
      userId: withdrawal.userId,
      title: "Withdrawal Completed",
      desc: `Your withdrawal of ₹${withdrawal.amount} has been successfully sent to UPI: ${withdrawal.upiId}.`,
      type: "wallet",
      read: false
    });

    res.status(200).json({ message: "Withdrawal approved successfully.", withdrawal });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    res.status(500).json({ message: error.message });
  }
};

const rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found." });
    }
    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Withdrawal request is already resolved." });
    }
    withdrawal.status = "failed";
    await withdrawal.save();

    // Refund the amount to user's wallet
    const User = require("../models/User");
    const user = await User.findById(withdrawal.userId);
    if (user) {
      if (withdrawal.walletType === "battle") {
        user.battleBalance += withdrawal.amount;
      } else {
        user.balance += withdrawal.amount;
      }
      await user.save();
    }

    // Create notification
    const Notification = require("../models/Notification");
    await Notification.create({
      userId: withdrawal.userId,
      title: "Withdrawal Failed",
      desc: `Your withdrawal request of ₹${withdrawal.amount} failed. Funds have been refunded to your wallet.`,
      type: "wallet",
      read: false
    });

    res.status(200).json({ message: "Withdrawal rejected successfully and funds refunded.", withdrawal });
  } catch (error) {
    console.error("Error rejecting withdrawal:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAdminStats, 
  getBetaRequests, 
  dismissBetaRequest, 
  getAdminWithdrawals, 
  approveWithdrawal, 
  rejectWithdrawal 
};
