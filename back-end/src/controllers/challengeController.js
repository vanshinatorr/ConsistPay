const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const Submission = require("../models/Submission");

// Generate unique CP-XXXXXX invite code
const generateInviteCode = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let code = "";
  while (!isUnique) {
    code = "CP-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await Challenge.findOne({ inviteCode: code });
    if (!existing) isUnique = true;
  }
  return code;
};

// Count completed submissions in a date range (Unique Days)
const countCompletedSubmissions = async (userId, startDate, endDate, duration) => {
  if (!startDate || !endDate) return 0;
  const startStr = new Date(startDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  
  let endStr;
  if (duration) {
    const startObj = new Date(startDate);
    const endObj = new Date(startObj.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
    endStr = endObj.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  } else {
    endStr = new Date(endDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  }
  
  const result = await Submission.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: "completed",
        date: { $gte: startStr, $lte: endStr }
      }
    },
    {
      $group: {
        _id: "$date"
      }
    },
    {
      $count: "uniqueDays"
    }
  ]);
  
  return result.length > 0 ? result[0].uniqueDays : 0;
};

// Resolve expired challenges and payout/refund
const autoResolveChallenges = async (userId) => {
  const now = new Date();
  // Find active challenges for the user that have passed their end date
  const expiredChallenges = await Challenge.find({
    status: "active",
    endDate: { $lt: now },
    $or: [{ creatorId: userId }, { opponentId: userId }]
  });

  if (expiredChallenges.length === 0) return;

  const platformService = require("../services/platformService");
  const PlatformLinkage = require("../models/PlatformLinkage");
  const Notification = require("../models/Notification");

  for (const challenge of expiredChallenges) {
    try {
      // Atomically lock the challenge as completed before distributing payouts
      const lockedChallenge = await Challenge.findOneAndUpdate(
        { _id: challenge._id, status: "active" },
        { $set: { status: "completed" } },
        { new: true }
      );

      if (!lockedChallenge) {
        console.log(`[Resolution] Challenge ${challenge._id} already resolved by another request.`);
        continue;
      }

      // Fetch creator and opponent profile linkages and trigger an auto-sync for both
      // to make sure any last-minute coding solves are recorded before resolution.
      const syncUserPlatforms = async (uId) => {
        const linkages = await PlatformLinkage.find({ userId: uId, isVerified: true });
        for (const linkage of linkages) {
          try {
            await platformService.syncDailySolve(uId, linkage.platform);
          } catch (syncErr) {
            console.error(`[Resolution Sync] Failed to sync ${linkage.platform} for user ${uId}:`, syncErr.message);
          }
        }
      };

      await Promise.all([
        syncUserPlatforms(challenge.creatorId),
        syncUserPlatforms(challenge.opponentId)
      ]);

      const creatorScore = await countCompletedSubmissions(challenge.creatorId, challenge.startDate, challenge.endDate, challenge.duration);
      const opponentScore = await countCompletedSubmissions(challenge.opponentId, challenge.startDate, challenge.endDate, challenge.duration);

      console.log(`Resolving challenge ${challenge._id}. Scores: Creator=${creatorScore}, Opponent=${opponentScore}`);

      const creator = await User.findById(challenge.creatorId);
      const opponent = await User.findById(challenge.opponentId);

      if (!creator || !opponent) {
        console.error(`[Resolution] Creator or Opponent not found during resolution of ${challenge._id}`);
        continue;
      }

      const challengeName = `${challenge.duration}-Day Consistency Challenge`;

      if (creatorScore > opponentScore) {
        // Creator wins atomically
        await User.updateOne(
          { _id: challenge.creatorId },
          { $inc: { battleBalance: challenge.stake * 2 } }
        );

        // Send notifications
        await Notification.create([
          {
            userId: challenge.creatorId,
            title: "Battle Won",
            desc: `You won the ${challengeName} against ${opponent.name}! ₹${challenge.stake * 2} has been added to your wallet.`,
            type: "battle"
          },
          {
            userId: challenge.opponentId,
            title: "Battle Ended",
            desc: `${creator.name} won the ${challengeName} with a higher consistency score. Better luck next time!`,
            type: "battle"
          }
        ]);
        console.log(`Creator ${creator.email} won stakes: +₹${challenge.stake * 2}`);
      } else if (opponentScore > creatorScore) {
        // Opponent wins atomically
        await User.updateOne(
          { _id: challenge.opponentId },
          { $inc: { battleBalance: challenge.stake * 2 } }
        );

        // Send notifications
        await Notification.create([
          {
            userId: challenge.opponentId,
            title: "Battle Won",
            desc: `You won the ${challengeName} against ${creator.name}! ₹${challenge.stake * 2} has been added to your wallet.`,
            type: "battle"
          },
          {
            userId: challenge.creatorId,
            title: "Battle Ended",
            desc: `${opponent.name} won the ${challengeName} with a higher consistency score. Better luck next time!`,
            type: "battle"
          }
        ]);
        console.log(`Opponent ${opponent.email} won stakes: +₹${challenge.stake * 2}`);
      } else {
        // Tie - Refund stakes atomically
        await Promise.all([
          User.updateOne({ _id: challenge.creatorId }, { $inc: { battleBalance: challenge.stake } }),
          User.updateOne({ _id: challenge.opponentId }, { $inc: { battleBalance: challenge.stake } })
        ]);

        // Send notifications
        await Notification.create([
          {
            userId: challenge.creatorId,
            title: "Battle Tied",
            desc: `The ${challengeName} against ${opponent.name} ended in a tie. Your stake of ₹${challenge.stake} has been refunded to your wallet.`,
            type: "battle"
          },
          {
            userId: challenge.opponentId,
            title: "Battle Tied",
            desc: `The ${challengeName} against ${creator.name} ended in a tie. Your stake of ₹${challenge.stake} has been refunded to your wallet.`,
            type: "battle"
          }
        ]);
        console.log("Challenge tied. Stakes refunded to both.");
      }
    } catch (err) {
      console.error(`Error resolving challenge ${challenge._id}:`, err.message);
    }
  }
};

// CREATE CHALLENGE
const createChallenge = async (req, res) => {
  try {
    const { duration, stake } = req.body;
    const userId = req.user._id;

    console.log("Create challenge request received:", { duration, stake, userId });

    // Enforce Pro Plan Gating
    const user = await User.findById(userId);
    console.log("User details for challenge:", { name: user.name, plan: user.plan });
    
    if (user.plan !== "pro") {
      console.log("Create challenge rejected: user plan is not pro");
      return res.status(403).json({ message: "Only Pro users can create custom challenges." });
    }

    // Check if creator already has a pending challenge
    const existingPending = await Challenge.findOne({ creatorId: userId, status: "pending" });
    if (existingPending) {
      return res.status(400).json({ message: "You already have a pending battle invitation. Please cancel the existing invitation or wait for it to expire (5 mins) before creating a new one." });
    }

    if (!duration || !stake) {
      console.log("Create challenge rejected: duration or stake missing");
      return res.status(400).json({ message: "Duration and stake amount are required." });
    }

    const stakeVal = parseInt(stake);
    if (stakeVal < 100 || stakeVal > 1000) {
      return res.status(400).json({ message: "Stake must be between ₹100 and ₹1000." });
    }

    const entryFee = 19;
    const totalCost = stakeVal + entryFee;

    if (user.battleBalance < totalCost) {
      const deficit = totalCost - user.battleBalance;
      return res.status(400).json({ message: `Insufficient balance. You need ₹${deficit} more to lock this commitment.` });
    }

    // Deduct from battle wallet atomically
    await User.updateOne(
      { _id: userId },
      { $inc: { battleBalance: -totalCost } }
    );

    const inviteCode = await generateInviteCode();

    const challenge = await Challenge.create({
      creatorId: userId,
      duration,
      stake: stakeVal,
      entryFee,
      inviteCode,
      status: "pending"
    });

    console.log("Challenge created in DB:", challenge);

    res.status(201).json({
      message: "Challenge created successfully!",
      inviteCode: challenge.inviteCode,
      battleBalance: user.battleBalance - totalCost,
      challengeId: challenge._id
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET INVITE DETAILS
const getInviteDetails = async (req, res) => {
  try {
    const { code } = req.params;
    const challenge = await Challenge.findOne({ inviteCode: code, status: "pending" })
      .populate("creatorId", "name email streak");

    if (!challenge) {
      return res.status(404).json({ message: "Challenge invite code not found or already accepted." });
    }

    res.status(200).json({
      code: challenge.inviteCode,
      createdBy: challenge.creatorId.name,
      createdByEmail: challenge.creatorId.email,
      creatorStreak: challenge.creatorId.streak,
      duration: challenge.duration,
      stake: challenge.stake,
      entryFee: challenge.entryFee,
      totalCost: challenge.stake + challenge.entryFee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// JOIN CHALLENGE
const joinChallenge = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findOne({ inviteCode: code, status: "pending" });
    if (!challenge) {
      return res.status(404).json({ message: "Challenge invite not found or already active." });
    }

    if (challenge.creatorId.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot join your own challenge." });
    }

    const totalCost = challenge.stake + challenge.entryFee;
    const user = await User.findById(userId);

    // Enforce Pro Plan Gating for joining challenges
    if (user.plan !== "pro") {
      return res.status(403).json({ message: "Only Pro users can join custom challenges." });
    }

    if (user.battleBalance < totalCost) {
      return res.status(400).json({ message: `Insufficient balance. Required: ₹${totalCost}, Available: ₹${user.battleBalance}.` });
    }

    // Start Challenge Dates (Current local date)
    const startDate = new Date();

    // Calculate endDate as 23:59:59 on the last calendar day (Asia/Kolkata timezone)
    // Inclusive of the start day (e.g. if started on July 12 for 7 days, it ends July 18 at 23:59:59)
    const endDayObj = new Date(startDate.getTime());
    endDayObj.setDate(endDayObj.getDate() + (challenge.duration - 1));
    const year = endDayObj.getFullYear();
    const month = endDayObj.getMonth();
    const date = endDayObj.getDate();
    const endDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}T23:59:59+05:30`;
    const endDate = new Date(endDateStr);

    // Atomically transition the challenge status to prevent race conditions
    const lockedChallenge = await Challenge.findOneAndUpdate(
      { _id: challenge._id, status: "pending" },
      { 
        $set: { 
          opponentId: userId, 
          status: "active", 
          startDate, 
          endDate 
        } 
      },
      { new: true }
    );

    if (!lockedChallenge) {
      return res.status(400).json({ message: "This battle invitation has already been accepted by another participant." });
    }

    // Deduct from battle wallet atomically
    await User.updateOne(
      { _id: userId },
      { $inc: { battleBalance: -totalCost } }
    );

    const creator = await User.findById(challenge.creatorId);

    res.status(200).json({
      message: "Challenge joined successfully!",
      battleBalance: user.battleBalance - totalCost,
      challengeId: challenge._id,
      opponent: {
        name: creator.name,
        streak: creator.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVE CHALLENGES
const getActiveChallenges = async (req, res) => {
  try {
    const userId = req.user._id;

    // Resolve any expired ones first
    await autoResolveChallenges(userId);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const active = await Challenge.find({
      $and: [
        {
          $or: [
            { status: "active" },
            { status: "completed", updatedAt: { $gte: oneDayAgo } }
          ]
        },
        {
          $or: [
            { creatorId: userId },
            { opponentId: userId }
          ]
        }
      ]
    })
      .populate("creatorId", "name streak")
      .populate("opponentId", "name streak");

    const formatted = [];
    const now = new Date();

    for (const ch of active) {
      // Null-safety check for populated user models
      if (!ch.creatorId || !ch.opponentId) {
        continue;
      }

      const isCreator = ch.creatorId._id.toString() === userId.toString();
      const userRole = isCreator ? "creator" : "opponent";

      const creatorScore = await countCompletedSubmissions(ch.creatorId._id, ch.startDate, ch.endDate, ch.duration);
      const opponentScore = await countCompletedSubmissions(ch.opponentId._id, ch.startDate, ch.endDate, ch.duration);

      // Days elapsed (at least 1) based on calendar days in Asia/Kolkata timezone
      const d1 = new Date(ch.startDate.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }));
      const d2 = new Date(now.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }));
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      const currentDay = Math.min(ch.duration, Math.max(1, diffDays + 1));

      formatted.push({
        id: ch._id,
        inviteCode: ch.inviteCode,
        duration: ch.duration,
        stake: ch.stake,
        pool: ch.stake * 2,
        currentDay,
        startDate: ch.startDate,
        endDate: ch.endDate,
        status: ch.status,
        userRole,
        creator: {
          name: ch.creatorId.name,
          streak: ch.creatorId.streak,
          score: creatorScore
        },
        opponent: {
          name: ch.opponentId.name,
          streak: ch.opponentId.streak,
          score: opponentScore
        }
      });
    }

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CHALLENGE HISTORY
const getChallengeHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Resolve any expired ones first
    await autoResolveChallenges(userId);

    const history = await Challenge.find({
      status: "completed",
      $or: [{ creatorId: userId }, { opponentId: userId }]
    })
      .populate("creatorId", "name")
      .populate("opponentId", "name")
      .sort({ updatedAt: -1 });

    const formatted = [];

    for (const ch of history) {
      const creatorScore = await countCompletedSubmissions(ch.creatorId._id, ch.startDate, ch.endDate, ch.duration);
      const opponentScore = await countCompletedSubmissions(ch.opponentId._id, ch.startDate, ch.endDate, ch.duration);

      const isCreator = ch.creatorId._id.toString() === userId.toString();
      
      let outcome = "TIE";
      if (creatorScore > opponentScore) {
        outcome = isCreator ? "WON" : "LOST";
      } else if (opponentScore > creatorScore) {
        outcome = isCreator ? "LOST" : "WON";
      }

      formatted.push({
        id: ch._id,
        duration: ch.duration,
        stake: ch.stake,
        opponentName: isCreator ? ch.opponentId.name : ch.creatorId.name,
        outcome,
        payoutChange: outcome === "WON" ? ch.stake : outcome === "LOST" ? -ch.stake : 0
      });
    }

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CHALLENGE BY ID
const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Resolve any expired ones first
    await autoResolveChallenges(userId);

    const ch = await Challenge.findById(id)
      .populate("creatorId", "name email streak avatar")
      .populate("opponentId", "name email streak avatar");

    if (!ch) {
      return res.status(404).json({ message: "Challenge not found." });
    }

    if (
      ch.creatorId._id.toString() !== userId.toString() &&
      (!ch.opponentId || ch.opponentId._id.toString() !== userId.toString())
    ) {
      return res.status(403).json({ message: "Not authorized to view this challenge." });
    }

    const isCreator = ch.creatorId._id.toString() === userId.toString();
    const userRole = isCreator ? "creator" : "opponent";

    const creatorScore = await countCompletedSubmissions(ch.creatorId._id, ch.startDate || new Date(), ch.endDate || new Date(), ch.duration);
    const opponentScore = ch.opponentId ? await countCompletedSubmissions(ch.opponentId._id, ch.startDate || new Date(), ch.endDate || new Date(), ch.duration) : 0;

    let currentDay = 1;
    if ((ch.status === "active" || ch.status === "completed") && ch.startDate) {
      const d1 = new Date(ch.startDate.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }));
      const d2 = new Date(new Date().toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }));
      const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      currentDay = Math.min(ch.duration, Math.max(1, diffDays + 1));
    }

    const grid = [];
    const feed = [];

    if ((ch.status === "active" || ch.status === "completed") && ch.startDate && ch.endDate) {
      const start = new Date(ch.startDate);
      const startStr = start.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      const endStr = new Date(ch.endDate).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      const creatorSubs = await Submission.find({
        userId: ch.creatorId._id,
        status: "completed",
        date: { $gte: startStr, $lte: endStr }
      });

      const opponentSubs = ch.opponentId ? await Submission.find({
        userId: ch.opponentId._id,
        status: "completed",
        date: { $gte: startStr, $lte: endStr }
      }) : [];

      const creatorDatesMap = new Map(creatorSubs.map(s => [s.date, s]));
      const opponentDatesMap = new Map(opponentSubs.map(s => [s.date, s]));

      const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      for (let i = 0; i < ch.duration; i++) {
        const dayDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const dayStr = dayDate.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

        let creatorStatus = "future";
        let opponentStatus = "future";

        const creatorSub = creatorDatesMap.get(dayStr);
        const opponentSub = opponentDatesMap.get(dayStr);

        if (creatorSub) {
          creatorStatus = "completed";
        } else if (dayStr === todayStr) {
          creatorStatus = "pending";
        } else if (dayStr < todayStr) {
          creatorStatus = "missed";
        }

        if (ch.opponentId) {
          if (opponentSub) {
            opponentStatus = "completed";
          } else if (dayStr === todayStr) {
            opponentStatus = "pending";
          } else if (dayStr < todayStr) {
            opponentStatus = "missed";
          }
        }

        grid.push({
          dayNumber: i + 1,
          date: dayStr,
          creatorStatus,
          opponentStatus,
          creatorProblem: creatorSub ? creatorSub.problemName : null,
          opponentProblem: opponentSub ? opponentSub.problemName : null
        });
      }

      // Fetch feed submissions
      const subs = await Submission.find({
        userId: { $in: [ch.creatorId._id, ch.opponentId ? ch.opponentId._id : null].filter(Boolean) },
        status: "completed",
        date: { $gte: startStr, $lte: endStr }
      }).sort({ createdAt: -1 });

      for (const sub of subs) {
        const isSubCreator = sub.userId.toString() === ch.creatorId._id.toString();
        const solverName = isSubCreator ? ch.creatorId.name : (ch.opponentId ? ch.opponentId.name : "Opponent");
        const diffTime = new Date(sub.createdAt).getTime() - start.getTime();
        const dayNumber = Math.max(1, Math.min(ch.duration, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

        feed.push({
          id: sub._id,
          solverName,
          isCreator: isSubCreator,
          problemName: sub.problemName,
          platform: sub.platform,
          dayNumber,
          createdAt: sub.createdAt
        });
      }
    }

    const formatted = {
      id: ch._id,
      inviteCode: ch.inviteCode,
      duration: ch.duration,
      stake: ch.stake,
      pool: ch.stake * 2,
      currentDay,
      startDate: ch.startDate,
      endDate: ch.endDate,
      status: ch.status,
      userRole,
      grid,
      feed,
      creator: {
        id: ch.creatorId._id,
        name: ch.creatorId.name,
        email: ch.creatorId.email,
        streak: ch.creatorId.streak,
        avatar: ch.creatorId.avatar,
        score: creatorScore
      },
      opponent: ch.opponentId ? {
        id: ch.opponentId._id,
        name: ch.opponentId.name,
        email: ch.opponentId.email,
        streak: ch.opponentId.streak,
        avatar: ch.opponentId.avatar,
        score: opponentScore
      } : null
    };

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CANCEL PENDING CHALLENGE (Instant Refund)
const cancelPendingChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    const pendingChallenge = await Challenge.findOne({ creatorId: userId, status: "pending" });
    
    if (!pendingChallenge) {
      return res.status(400).json({ message: "No pending battle invitation found to cancel." });
    }
    
    // Atomically transition the status to prevent multiple cancellation refunds
    const lockedChallenge = await Challenge.findOneAndUpdate(
      { _id: pendingChallenge._id, status: "pending" },
      { $set: { status: "expired" } },
      { new: true }
    );

    if (!lockedChallenge) {
      return res.status(400).json({ message: "This battle invitation has already been cancelled or accepted." });
    }

    const refundAmount = pendingChallenge.stake + pendingChallenge.entryFee;

    // Atomically increment user balance
    await User.updateOne(
      { _id: userId },
      { $inc: { battleBalance: refundAmount } }
    );

    const user = await User.findById(userId);

    res.status(200).json({
      message: "Battle cancelled and stakes refunded successfully.",
      battleBalance: user ? user.battleBalance : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER'S PENDING CHALLENGE
const getPendingChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    const pending = await Challenge.findOne({ creatorId: userId, status: "pending" });
    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPIRE PENDING CHALLENGES (Cron Job logic)
const expirePendingChallenges = async () => {
  try {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const expired = await Challenge.find({ status: "pending", createdAt: { $lt: fiveMinsAgo } });
    
    for (const ch of expired) {
      // Atomically transition the status to prevent multiple cancellation refunds
      const lockedChallenge = await Challenge.findOneAndUpdate(
        { _id: ch._id, status: "pending" },
        { $set: { status: "expired" } },
        { new: true }
      );

      if (lockedChallenge) {
        // Refund the creator atomically
        await User.updateOne(
          { _id: ch.creatorId },
          { $inc: { battleBalance: ch.stake + ch.entryFee } }
        );
      }
    }
    
    if (expired.length > 0) {
      console.log(`[Cron] Expired ${expired.length} pending battle(s) and refunded creators.`);
    }
  } catch (error) {
    console.error("Error in expirePendingChallenges:", error);
  }
};

module.exports = {
  createChallenge,
  getInviteDetails,
  joinChallenge,
  getActiveChallenges,
  getChallengeHistory,
  getChallengeById,
  cancelPendingChallenge,
  getPendingChallenge,
  expirePendingChallenges
};
