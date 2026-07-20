

const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const timingSafeEqual = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");
  if (aBuf.length !== bBuf.length) {
    // Perform dummy timing safe comparison to preserve timing behavior
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
};

const createOrder = async (req, res) => {
try {
  const { plan, dailyCommitment, depositAmount } = req.body;
  const planLower = plan ? plan.toLowerCase() : "free";
  const calculatedTotal = planLower === "pro" ? depositAmount + 49 : depositAmount;
  
  let orderId;
  try {
    const order = await razorpay.orders.create({
      amount: calculatedTotal * 100,
      currency: "INR",
      receipt: `rcp_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        plan,
        dailyCommitment,
        depositAmount,
      },
    });
    orderId = order.id;
  } catch (rzpErr) {
    console.warn("Razorpay order creation failed, generating mock order:", rzpErr.message);
    orderId = `mock_order_${Date.now()}`;
  }
  
  res.status(200).json({ order_id: orderId, amount: calculatedTotal * 100 });
} catch (error) {
  console.log("Payment Error:", error);
  res.status(500).json({ message: error.message });
}
};

const verifyPayment = async (req, res) => {
try {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const isMock = razorpay_order_id && razorpay_order_id.startsWith("mock_");

  if (isMock && process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Bypassing payments is forbidden in production." });
  }

  if (!isMock) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: "Razorpay secret key configuration is missing on the server." });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");
    if (!timingSafeEqual(expectedSignature, razorpay_signature)) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  }

  let plan, dailyCommitment, depositAmount;
  if (isMock) {
    plan = req.body.plan;
    dailyCommitment = req.body.dailyCommitment;
    depositAmount = req.body.depositAmount;
  } else {
    // Fetch the order from Razorpay to verify details stored in notes on creation
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (!order || !order.notes) {
      return res.status(400).json({ message: "Razorpay order details not found" });
    }
    // Verify that this order belongs to the requesting user
    if (order.notes.userId !== req.user._id.toString()) {
      return res.status(400).json({ message: "Payment order does not belong to this user." });
    }
    plan = order.notes.plan;
    dailyCommitment = order.notes.dailyCommitment;
    depositAmount = order.notes.depositAmount;
  }

  if (!plan || dailyCommitment === undefined || depositAmount === undefined) {
    return res.status(400).json({ message: "Invalid order metadata in Razorpay notes" });
  }

  if (!isMock) {
    const Payment = require("../models/Payment");
    try {
      await Payment.create({
        userId: req.user._id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: Number(depositAmount),
        type: "onboarding",
      });
    } catch (dbErr) {
      // If duplicate key error (code 11000), payment has already been processed. Return success (idempotent).
      if (dbErr.code === 11000) {
        const user = await User.findById(req.user._id);
        return res.status(200).json({
          message: "Payment verified successfully!",
          plan: user.plan,
          balance: user.balance,
          activeDeposit: user.activeDeposit,
          onboardingComplete: user.onboardingComplete,
        });
      }
      throw dbErr;
    }
  }

  try {
    const user = await User.findById(req.user._id);
    const planLower = plan.toLowerCase();
    const isRenewal = user.onboardingComplete;
    const useWalletBalance = req.body.useWalletBalance === true;
    const depositVal = Number(depositAmount);

    if (useWalletBalance) {
      const offset = Math.min(user.balance || 0, depositVal);
      user.balance = (user.balance || 0) - offset;
    }

    user.activeDeposit = depositVal;
    user.plan = planLower;
    user.dailyCommitment = Number(dailyCommitment);
    user.onboardingComplete = true;
    if (!user.onboardingCompletedAt) {
      user.onboardingCompletedAt = new Date();
    }
    user.graceCoins = Math.max(user.graceCoins || 0, 1);
    user.lastGraceCoinEarnedMonth = "";
    const currentExpiry = user.planExpiresAt && new Date(user.planExpiresAt) > new Date()
      ? new Date(user.planExpiresAt)
      : new Date();
    user.planExpiresAt = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
    user.currentCycleUnprotectedMisses = 0;
    user.bonusCredited = false;

    await user.save();
    res.status(200).json({
      message: "Payment verified successfully!",
      plan: user.plan,
      balance: user.balance,
      activeDeposit: user.activeDeposit,
      onboardingComplete: user.onboardingComplete,
    });
  } catch (saveErr) {
    // Rollback payment registration if user document fails to save
    if (!isMock) {
      const Payment = require("../models/Payment");
      await Payment.deleteOne({ razorpayPaymentId: razorpay_payment_id });
    }
    throw saveErr;
  }
} catch (error) {
  console.log("Verify Error:", error);
  res.status(500).json({ message: error.message });
}
};

const skipPayment = async (req, res) => {
try {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Bypassing payments is forbidden in production." });
  }
  const { plan, dailyCommitment, depositAmount } = req.body;
  const user = await User.findById(req.user._id);
  
  const planLower = plan ? plan.toLowerCase() : "free";
  const isRenewal = user.onboardingComplete;
  const useWalletBalance = req.body.useWalletBalance === true;
  const depositVal = Number(depositAmount);

  if (useWalletBalance) {
    const offset = Math.min(user.balance || 0, depositVal);
    user.balance = (user.balance || 0) - offset;
  }

  user.activeDeposit = depositVal;
  user.plan = planLower;
  user.dailyCommitment = Number(dailyCommitment);
  user.onboardingComplete = true;
  if (!user.onboardingCompletedAt) {
    user.onboardingCompletedAt = new Date();
  }
  user.graceCoins = Math.max(user.graceCoins || 0, 1);
  user.lastGraceCoinEarnedMonth = "";
  const currentExpiry = user.planExpiresAt && new Date(user.planExpiresAt) > new Date()
    ? new Date(user.planExpiresAt)
    : new Date();
  user.planExpiresAt = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
  user.currentCycleUnprotectedMisses = 0;
  user.bonusCredited = false;

  await user.save();
  
  res.status(200).json({
    message: "Payment successful!",
    plan: user.plan,
    balance: user.balance,
    activeDeposit: user.activeDeposit,
    onboardingComplete: user.onboardingComplete,
  });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};













// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const User = require("../models/User");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const createOrder = async (req, res) => {
//   try {
//     const { plan, dailyCommitment, depositAmount, totalAmount } = req.body;
//     const order = await razorpay.orders.create({
//       amount: totalAmount * 100,
//       currency: "INR",
// receipt: `rcp_${Date.now()}`,
//       notes: {
//         userId: req.user._id.toString(),
//         plan,
//         dailyCommitment,
//         depositAmount,
//       },
//     });
//     res.status(200).json({ order_id: order.id, amount: order.amount });
//   } catch (error) {
//     console.log("Payment Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       plan,
//       dailyCommitment,
//       depositAmount,
//     } = req.body;
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");
//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid payment signature" });
//     }
//     const user = await User.findById(req.user._id);
//     user.plan = plan;
//     user.dailyCommitment = dailyCommitment;
//     user.balance = depositAmount;
//     user.onboardingComplete = true;
//     user.graceCoins = (user.graceCoins || 0) + 1;
//     if (plan === "pro") {
//       user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
//     }
//     await user.save();
//     res.status(200).json({
//       message: "Payment verified successfully!",
//       plan: user.plan,
//       balance: user.balance,
//       onboardingComplete: user.onboardingComplete,
//     });
//   } catch (error) {
//     console.log("Verify Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { createOrder, verifyPayment };
// ========================
// PVP TOP-UP LOGIC
// ========================

const createTopupOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 50) {
      return res.status(400).json({ message: "Minimum top-up amount is ₹50." });
    }
    
    let orderId;
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // in paise
        currency: "INR",
        receipt: `topup_${Date.now()}`,
        notes: {
          userId: req.user._id.toString(),
          type: "pvp_topup",
        },
      });
      orderId = order.id;
    } catch (rzpErr) {
      console.warn("Razorpay topup order creation failed, generating mock order:", rzpErr.message);
      orderId = `mock_topup_${Date.now()}`;
    }
    res.status(200).json({ order_id: orderId, amount: amount * 100 });
  } catch (error) {
    console.log("Top-up Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyTopup = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const isMock = razorpay_order_id && razorpay_order_id.startsWith("mock_");

    if (isMock && process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Bypassing payments is forbidden in production." });
    }

    if (!isMock) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return res.status(500).json({ message: "Razorpay secret key configuration is missing on the server." });
      }
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

      if (!timingSafeEqual(expectedSignature, razorpay_signature)) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    let actualAmount;
    if (isMock) {
      actualAmount = req.body.amount;
    } else {
      // Fetch the order from Razorpay to verify and credit the actual amount
      const order = await razorpay.orders.fetch(razorpay_order_id);
      if (!order) {
        return res.status(400).json({ message: "Razorpay order not found" });
      }
      // Verify that this order belongs to the requesting user
      if (order.notes && order.notes.userId !== req.user._id.toString()) {
        return res.status(400).json({ message: "Payment order does not belong to this user." });
      }
      actualAmount = order.amount / 100;
    }

    if (isNaN(actualAmount) || actualAmount <= 0) {
      return res.status(400).json({ message: "Invalid order amount recorded in Razorpay" });
    }

    if (!isMock) {
      const Payment = require("../models/Payment");
      try {
        await Payment.create({
          userId: req.user._id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          amount: actualAmount,
          type: "topup",
        });
      } catch (dbErr) {
        // If duplicate key error (code 11000), payment has already been processed. Return success (idempotent).
        if (dbErr.code === 11000) {
          const user = await User.findById(req.user._id);
          return res.status(200).json({
            message: "Top-up successful!",
            battleBalance: user.battleBalance,
          });
        }
        throw dbErr;
      }
    }

    try {
      const user = await User.findById(req.user._id);
      user.battleBalance = (user.battleBalance || 0) + actualAmount;
      await user.save();

      res.status(200).json({
        message: "Top-up successful!",
        battleBalance: user.battleBalance,
      });
    } catch (saveErr) {
      // Rollback payment registration if user document fails to save
      if (!isMock) {
        const Payment = require("../models/Payment");
        await Payment.deleteOne({ razorpayPaymentId: razorpay_payment_id });
      }
      throw saveErr;
    }
  } catch (error) {
    console.log("Verify Top-up Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const skipTopup = async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Bypassing payments is forbidden in production." });
    }
    const { amount } = req.body;
    if (!amount || amount < 10) {
      return res.status(400).json({ message: "Minimum top-up amount is ₹10." });
    }

    const user = await User.findById(req.user._id);
    user.battleBalance = (user.battleBalance || 0) + Number(amount);
    await user.save();

    res.status(200).json({
      message: "Demo Top-up successful!",
      battleBalance: user.battleBalance,
    });
  } catch (error) {
    console.log("Skip Top-up Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// END PVP TOP-UP LOGIC
// ========================

const upgradePlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.plan = "pro";
    user.graceCoins = (user.graceCoins || 0) + 1;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
    res.status(200).json({ message: "Successfully upgraded to Pro!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const { amount, upiId, walletType } = req.body;
    const userId = req.user._id;
    const Withdrawal = require("../models/Withdrawal");

    const amountVal = parseFloat(Number(amount).toFixed(2));
    if (isNaN(amountVal) || amountVal <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount." });
    }
    if (amountVal < 1) {
      return res.status(400).json({ message: "Minimum withdrawal amount is ₹1." });
    }
    if (!upiId || !upiId.includes("@")) {
      return res.status(400).json({ message: "Please enter a valid UPI ID (e.g. name@upi)." });
    }

    const type = walletType === "battle" ? "battle" : "consistency";
    let updatedUser;

    if (type === "battle") {
      // Atomically check if balance is sufficient and deduct in one step to prevent race conditions
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, battleBalance: { $gte: amountVal } },
        { $inc: { battleBalance: -amountVal } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json({ message: "Insufficient battle wallet balance." });
      }
    } else {
      // Atomically check if balance is sufficient and deduct in one step to prevent race conditions
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, balance: { $gte: amountVal } },
        { $inc: { balance: -amountVal } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(400).json({ message: "Insufficient consistency wallet balance." });
      }
    }

    try {
      const withdrawal = await Withdrawal.create({
        userId,
        amount: amountVal,
        upiId,
        walletType: type,
        status: "pending"
      });

      const Notification = require("../models/Notification");
      await Notification.create({
        userId,
        title: "Withdrawal Initiated",
        desc: `Your request to withdraw ₹${amountVal} to UPI: ${upiId} has been received.`,
        type: "wallet",
        read: false
      });

      res.status(200).json({
        message: "Withdrawal request submitted successfully!",
        balance: updatedUser.balance,
        battleBalance: updatedUser.battleBalance,
        withdrawal
      });
    } catch (createErr) {
      // Rollback deduction if DB write fails to maintain database consistency
      if (type === "battle") {
        await User.updateOne({ _id: userId }, { $inc: { battleBalance: amountVal } });
      } else {
        await User.updateOne({ _id: userId }, { $inc: { balance: amountVal } });
      }
      throw createErr;
    }
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getWithdrawals = async (req, res) => {
  try {
    const Withdrawal = require("../models/Withdrawal");
    const withdrawals = await Withdrawal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  skipPayment,
  createTopupOrder,
  verifyTopup,
  skipTopup,
  upgradePlan,
  withdrawFunds,
  getWithdrawals
};
