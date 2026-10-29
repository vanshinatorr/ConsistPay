const crypto = require("crypto");

/**
 * Controller for Nexconn / RongCloud Web Chat integrations.
 * Securely generates client connection tokens using server-side App Secret.
 */
const getChatToken = async (req, res) => {
  try {
    const appKey = process.env.NEXCONN_APP_KEY;
    const appSecret = process.env.NEXCONN_APP_SECRET;
    const apiUrl = process.env.NEXCONN_API_URL || "https://api.rong-api.com";

    // If server environment variables are not yet configured, notify the client safely
    if (!appKey || !appSecret) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: "Nexconn Chat credentials (NEXCONN_APP_KEY and NEXCONN_APP_SECRET) are not configured in backend environment."
      });
    }

    const userId = req.user._id.toString();
    const name = req.user.name || req.user.username || "ConsistPay Coder";
    const portraitUri = req.user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(req.user.username || userId)}`;

    // Official Nexconn Server API signature generation:
    // Signature = SHA1(AppSecret + Nonce + Timestamp)
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHash("sha1")
      .update(appSecret + nonce + timestamp)
      .digest("hex");

    const formParams = new URLSearchParams({
      userId,
      name,
      portraitUri
    });

    const response = await fetch(`${apiUrl}/user/getToken.json`, {
      method: "POST",
      headers: {
        "App-Key": appKey,
        "Nonce": nonce,
        "Timestamp": timestamp,
        "Signature": signature,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formParams.toString()
    });

    const data = await response.json();

    if (data.code === 200 && data.token) {
      return res.status(200).json({
        success: true,
        configured: true,
        appKey,
        token: data.token,
        userId: data.userId || userId
      });
    }

    // Return detailed error code from server API
    return res.status(200).json({
      success: false,
      configured: true,
      code: data.code,
      message: data.errorMessage || data.msg || "Failed to generate Nexconn user token"
    });
  } catch (error) {
    console.error("Error generating Nexconn chat token:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while communicating with Nexconn API",
      error: error.message
    });
  }
};

module.exports = {
  getChatToken
};
