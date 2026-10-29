
const crypto = require("crypto");

/**
 * Securely obtains a Nexconn access token for the authenticated user.
 * App Secret stays on the backend.
 */
const getChatToken = async (req, res) => {
  try {
    const appKey = process.env.NEXCONN_APP_KEY;
    const appSecret = process.env.NEXCONN_APP_SECRET;
    const apiUrl = (
      process.env.NEXCONN_API_URL ||
      "https://api.sg-light-api.com"
    ).replace(/\/+$/, "");

    if (!appKey || !appSecret) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: "Nexconn credentials are not configured on the backend.",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userId = req.user._id.toString();
    const name =
      req.user.name || req.user.username || "ConsistPay Coder";

    const avatarUrl =
      req.user.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
        req.user.username || userId
      )}`;

    // Nexconn requires a unique nonce and Unix timestamp in milliseconds.
    const nonce = crypto.randomBytes(8).toString("hex");
    const timestamp = Date.now().toString();

    const signature = crypto
      .createHash("sha1")
      .update(appSecret + nonce + timestamp)
      .digest("hex");

    const response = await fetch(
      `${apiUrl}/v4/auth/access-token/issue`,
      {
        method: "POST",
        headers: {
          "App-Key": appKey,
          Nonce: nonce,
          Timestamp: timestamp,
          Signature: signature,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name,
          avatarUrl,
        }),
      }
    );

    const data = await response.json();

    if (
      response.ok &&
      data.code === 0 &&
      data.result?.accessToken
    ) {
      return res.status(200).json({
        success: true,
        configured: true,
        appKey,
        token: data.result.accessToken,
        userId: data.result.userId || userId,
      });
    }

    // Never return App Secret or request-signing details to the client.
    console.error("Nexconn token API rejected request:", {
      httpStatus: response.status,
      code: data.code,
      message: data.message,
    });

    return res.status(200).json({
      success: false,
      configured: true,
      code: data.code,
      message:
        data.message || "Nexconn could not issue an access token.",
    });
  } catch (error) {
    console.error("Nexconn token request failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to the Nexconn token service.",
    });
  }
};

module.exports = {
  getChatToken,
};
