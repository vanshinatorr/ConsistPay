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

// Count completed submissions in a date range
const countCompletedSubmissions = async (userId, startDate, endDate) => {
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];
  return await Submission.countDocuments({
    userId,
    status: "completed",
    date: { $gte: startStr, $lte: endStr }
  });
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

  for (const challenge of expiredChallenges) {
    try {
      const creatorScore = await countCompletedSubmissions(challenge.creatorId, challenge.startDate, challenge.endDate);
      const opponentScore = await countCompletedSubmissions(challenge.opponentId, challenge.startDate, challenge.endDate);

      challenge.status = "completed";
      await challenge.save();

      console.log(`Resolving challenge ${challenge._id}. Scores: Creator=${creatorScore}, Opponent=${opponentScore}`);

      if (creatorScore > opponentScore) {
        // Creator wins
        const creator = await User.findById(challenge.creatorId);
        creator.balance += challenge.stake * 2;
        await creator.save();
        console.log(`Creator ${creator.email} won stakes: +₹${challenge.stake * 2}`);
      } else if (opponentScore > creatorScore) {
        // Opponent wins
        const opponent = await User.findById(challenge.opponentId);
        opponent.balance += challenge.stake * 2;
        await opponent.save();
        console.log(`Opponent ${opponent.email} won stakes: +₹${challenge.stake * 2}`);
      } else {
        // Tie - Refund stakes
        const creator = await User.findById(challenge.creatorId);
        const opponent = await User.findById(challenge.opponentId);
        creator.balance += challenge.stake;
        opponent.balance += challenge.stake;
        await creator.save();
        await opponent.save();
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

    // Enforce Pro Plan Gating
    const user = await User.findById(userId);
    if (user.plan !== "pro") {
      return res.status(403).json({ message: "Only Pro users can create custom challenges." });
    }

    if (!duration || !stake) {
      return res.status(400).json({ message: "Duration and stake amount are required." });
    }

    const stakeVal = parseInt(stake);
    if (stakeVal < 100 || stakeVal > 1000) {
      return res.status(400).json({ message: "Stake must be between ₹100 and ₹1000." });
    }

    const entryFee = 19;
    const totalCost = stakeVal + entryFee;

    const inviteCode = await generateInviteCode();

    const challenge = await Challenge.create({
      creatorId: userId,
      duration,
      stake: stakeVal,
      entryFee,
      inviteCode,
      status: "pending"
    });

    res.status(201).json({
      message: "Challenge created successfully!",
      inviteCode: challenge.inviteCode,
      balance: user.balance
    });
  } catch (error) {
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

    // Start Challenge Dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + challenge.duration * 24 * 60 * 60 * 1000);

    challenge.opponentId = userId;
    challenge.status = "active";
    challenge.startDate = startDate;
    challenge.endDate = endDate;
    await challenge.save();

    const creator = await User.findById(challenge.creatorId);

    res.status(200).json({
      message: "Challenge joined successfully!",
      balance: user.balance,
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

    const active = await Challenge.find({
      status: "active",
      $or: [{ creatorId: userId }, { opponentId: userId }]
    })
      .populate("creatorId", "name streak")
      .populate("opponentId", "name streak");

    const formatted = [];
    const now = new Date();

    for (const ch of active) {
      const isCreator = ch.creatorId._id.toString() === userId.toString();
      const userRole = isCreator ? "creator" : "opponent";

      const creatorScore = await countCompletedSubmissions(ch.creatorId._id, ch.startDate, ch.endDate);
      const opponentScore = await countCompletedSubmissions(ch.opponentId._id, ch.startDate, ch.endDate);

      // Days elapsed (at least 1)
      const diffTime = now.getTime() - ch.startDate.getTime();
      const currentDay = Math.min(ch.duration, Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));

      formatted.push({
        id: ch._id,
        inviteCode: ch.inviteCode,
        duration: ch.duration,
        stake: ch.stake,
        pool: ch.stake * 2,
        currentDay,
        startDate: ch.startDate,
        endDate: ch.endDate,
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
      const creatorScore = await countCompletedSubmissions(ch.creatorId._id, ch.startDate, ch.endDate);
      const opponentScore = await countCompletedSubmissions(ch.opponentId._id, ch.startDate, ch.endDate);

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

module.exports = {
  createChallenge,
  getInviteDetails,
  joinChallenge,
  getActiveChallenges,
  getChallengeHistory
};
