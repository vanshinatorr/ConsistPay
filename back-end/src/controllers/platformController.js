const platformService = require("../services/platformService");

/**
 * Express controllers for external coding platforms integration.
 */

// 1. Link Platform
const linkPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;
    const userId = req.user._id;

    if (!platform || !username) {
      return res.status(400).json({ message: "Platform and username are required." });
    }

    if (platform !== "LeetCode") {
      return res.status(400).json({ message: `Platform "${platform}" is not supported in V1.` });
    }

    console.log(`[PlatformController] Initiating link for user: ${userId}, platform: ${platform}, username: ${username}`);
    
    const result = await platformService.initiateLinkage(userId, platform, username);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(`[PlatformController] Link failed:`, error.message);
    res.status(400).json({ message: error.message });
  }
};

// 2. Verify Ownership
const verifyPlatform = async (req, res) => {
  try {
    const { platform } = req.body;
    const userId = req.user._id;

    if (!platform) {
      return res.status(400).json({ message: "Platform is required." });
    }

    console.log(`[PlatformController] Initiating ownership verification for user: ${userId}, platform: ${platform}`);
    
    const result = await platformService.verifyOwnership(userId, platform);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(`[PlatformController] Verification failed:`, error.message);
    res.status(400).json({ message: error.message });
  }
};

// 3. Sync Daily Solves
const syncPlatform = async (req, res) => {
  try {
    const { platform, timezone } = req.body;
    const userId = req.user._id;

    if (!platform) {
      return res.status(400).json({ message: "Platform is required." });
    }

    const targetTimeZone = timezone || "Asia/Kolkata";

    console.log(`[PlatformController] Syncing daily solves for user: ${userId}, platform: ${platform}, timezone: ${targetTimeZone}`);
    
    const result = await platformService.syncDailySolve(userId, platform, targetTimeZone);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(`[PlatformController] Sync failed:`, error.message);
    
    // Send rate-limit response code if specified
    if (error.message.includes("rate limit") || error.message.includes("429") || error.message.includes("busy")) {
      return res.status(429).json({ message: error.message });
    }
    
    res.status(400).json({ message: error.message });
  }
};

// 4. Get Platform Linkage Details
const getPlatformLinkage = async (req, res) => {
  try {
    const { platform } = req.query;
    const userId = req.user._id;

    if (!platform) {
      return res.status(400).json({ message: "Platform parameter is required." });
    }

    const result = await platformService.getLinkage(userId, platform);
    
    res.status(200).json({ linkage: result });
  } catch (error) {
    console.error(`[PlatformController] Get linkage failed:`, error.message);
    res.status(400).json({ message: error.message });
  }
};

// 5. Delete Platform Linkage Details
const deletePlatformLinkage = async (req, res) => {
  try {
    const { platform } = req.body;
    const userId = req.user._id;

    if (!platform) {
      return res.status(400).json({ message: "Platform is required." });
    }

    console.log(`[PlatformController] Deleting linkage for user: ${userId}, platform: ${platform}`);
    const result = await platformService.deleteLinkage(userId, platform);
    
    res.status(200).json(result);
  } catch (error) {
    console.error(`[PlatformController] Delete linkage failed:`, error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  linkPlatform,
  verifyPlatform,
  syncPlatform,
  getPlatformLinkage,
  deletePlatformLinkage,
};
