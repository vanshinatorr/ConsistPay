

const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
try {
  const { plan, dailyCommitment, depositAmount } = req.body;
  const planLower = plan ? plan.toLowerCase() : "free";
  const calculatedTotal = planLower === "pro" ? depositAmount + 49 : depositAmount;
  
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
  res.status(200).json({ order_id: order.id, amount: order.amount });
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
    plan,
    dailyCommitment,
    depositAmount,
  } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }
  const user = await User.findById(req.user._id);
  const planLower = plan ? plan.toLowerCase() : "free";
  const isRenewal = user.onboardingComplete;
  user.plan = planLower;
  user.dailyCommitment = dailyCommitment;
  user.balance = depositAmount;
  user.onboardingComplete = true;
  user.graceCoins = isRenewal ? ((user.graceCoins || 0) + 1) : 1;
  if (planLower === "pro") {
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  await user.save();
  res.status(200).json({
    message: "Payment verified successfully!",
    plan: user.plan,
    balance: user.balance,
    onboardingComplete: user.onboardingComplete,
  });
} catch (error) {
  console.log("Verify Error:", error);
  res.status(500).json({ message: error.message });
}
};

const skipPayment = async (req, res) => {
try {
  const { plan, dailyCommitment, depositAmount } = req.body;
  const user = await User.findById(req.user._id);
  
  const planLower = plan ? plan.toLowerCase() : "free";
  const isRenewal = user.onboardingComplete;
  user.plan = planLower;
  user.dailyCommitment = dailyCommitment;
  user.balance = depositAmount;
  user.onboardingComplete = true;
  user.graceCoins = isRenewal ? ((user.graceCoins || 0) + 1) : 1;
  
  if (planLower === "pro") {
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  await user.save();
  
  res.status(200).json({
    message: "Payment successful!",
    plan: user.plan,
    balance: user.balance,
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
    
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `topup_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        type: "pvp_topup",
      },
    });
    res.status(200).json({ order_id: order.id, amount: order.amount });
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
      amount, // passed from frontend to know how much to add (in rupees)
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const user = await User.findById(req.user._id);
    user.battleBalance = (user.battleBalance || 0) + Number(amount);
    await user.save();

    res.status(200).json({
      message: "Top-up successful!",
      battleBalance: user.battleBalance,
    });
  } catch (error) {
    console.log("Verify Top-up Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const skipTopup = async (req, res) => {
  try {
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
module.exports = {
  createOrder,
  verifyPayment,
  skipPayment,
  createTopupOrder,
  verifyTopup,
  skipTopup,
  upgradePlan
};
