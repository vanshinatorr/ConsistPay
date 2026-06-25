

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

  if (!isMock) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_secret")
      .update(body)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
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
    plan = order.notes.plan;
    dailyCommitment = order.notes.dailyCommitment;
    depositAmount = order.notes.depositAmount;
  }

  if (!plan || dailyCommitment === undefined || depositAmount === undefined) {
    return res.status(400).json({ message: "Invalid order metadata in Razorpay notes" });
  }

  const user = await User.findById(req.user._id);
  const planLower = plan.toLowerCase();
  const isRenewal = user.onboardingComplete;
  user.plan = planLower;
  user.dailyCommitment = Number(dailyCommitment);
  user.balance = Number(depositAmount);
  user.onboardingComplete = true;
  user.onboardingCompletedAt = user.onboardingCompletedAt || new Date();
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
  user.onboardingCompletedAt = user.onboardingCompletedAt || new Date();
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

    if (!isMock) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_secret")
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
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
      actualAmount = order.amount / 100;
    }

    if (isNaN(actualAmount) || actualAmount <= 0) {
      return res.status(400).json({ message: "Invalid order amount recorded in Razorpay" });
    }

    const user = await User.findById(req.user._id);
    user.battleBalance = (user.battleBalance || 0) + actualAmount;
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
