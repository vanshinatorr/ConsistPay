const nodemailer = require("nodemailer");

// Initialize Nodemailer SMTP Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Standard HTML wrapper for emails (Premium Dark Mode SaaS Styling)
const wrapHTMLContent = (title, headerText, bodyText, buttonText = "", buttonUrl = "") => {
  const buttonHTML = (buttonText && buttonUrl) ? `
    <div style="text-align: center; margin: 30px 0 10px 0;">
      <a href="${buttonUrl}" style="background-color: #6D28D9; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(109, 40, 217, 0.2); transition: all 0.2s ease;">
        ${buttonText}
      </a>
    </div>
  ` : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="background-color: #0B0B0F; color: #FFFFFF; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; margin: 0 auto; background-color: #16161F; border: 1px solid rgba(109, 40, 217, 0.15); border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
        <!-- Header Banner -->
        <tr>
          <td style="padding: 30px 40px 20px 40px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
            <div style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF;">
              Consist<span style="color: #10B981;">Pay</span>
            </div>
            <div style="font-size: 11px; color: #8B5CF6; text-transform: uppercase; font-weight: 800; tracking-widest: 1px; margin-top: 4px;">
              Consistency is Currency
            </div>
          </td>
        </tr>
        
        <!-- Content Area -->
        <tr>
          <td style="padding: 40px 40px 35px 40px;">
            <h1 style="font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 20px; color: #FFFFFF; letter-spacing: -0.5px; line-height: 1.2;">
              ${headerText}
            </h1>
            <div style="font-size: 13.5px; line-height: 1.6; color: #9CA3AF; font-weight: 450;">
              ${bodyText}
            </div>
            ${buttonHTML}
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 25px 40px; text-align: center; background-color: #0F0F16; border-top: 1px solid rgba(255, 255, 255, 0.03);">
            <p style="font-size: 10px; color: #4B5563; margin: 0; line-height: 1.5;">
              You received this transaction or lifecycle email because you are a registered user of ConsistPay.<br>
              &copy; 2026 ConsistPay Tech. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// 1. Send Welcome Email
const sendWelcomeEmail = async (email, name) => {
  try {
    const html = wrapHTMLContent(
      "Welcome to ConsistPay",
      "You're here. Let's make sure you don't disappear.",
      `Hey ${name || "there"},<br><br>
       You officially made the list. No more "I'll start coding tomorrow" promises.<br><br>
       To turn intentions into actual code:<br>
       1. <b>Connect your LeetCode or GeeksforGeeks</b> profile in Settings.<br>
       2. <b>Select your daily commitment</b> tier (₹5, ₹10, ₹20, or ₹50).<br>
       3. <b>Secure your onboarding deposit</b>.<br><br>
       Once your deposit is in, coding consistency isn't just a goal—it's backed by real stakes. Let's write some clean code today.`,
      "Link Profile & Set Commitment",
      "https://consistpay.tech/settings?tab=platforms"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: "Commitment issues? We got you.",
      html,
    });
    console.log(`[EmailService] Welcome email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Welcome email failed:`, err.message);
  }
};

// 2. Send Setup Reminder Email (24h Inactivity)
const sendSetupReminderEmail = async (email, name) => {
  try {
    const html = wrapHTMLContent(
      "Setup Pending",
      "Don't leave your coding goals on read.",
      `Hey ${name || "there"},<br><br>
       Yesterday you signed up, but you haven't locked in your coding commitment yet. It's a bit like buying a gym membership and just staring at the front door.<br><br>
       Setting a small daily stake is a proven way to bypass procrastination. It takes less than 2 minutes to link your profile and select a commitment level.<br><br>
       Your deposit remains fully refundable at the end of the 30-day consistency cycle. Lock it in today and make coding non-negotiable.`,
      "Complete Onboarding Setup",
      "https://consistpay.tech/onboarding"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: "Don't leave your coding goals on read.",
      html,
    });
    console.log(`[EmailService] Setup reminder email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Setup reminder email failed:`, err.message);
  }
};

// 3. Send Profile Verification Nudge Email
const sendVerificationNudgeEmail = async (email, name, platform, verificationToken) => {
  try {
    const html = wrapHTMLContent(
      "Verification Code",
      "One tiny detail is missing...",
      `Hey ${name || "there"},<br><br>
       You linked your ${platform} username, but we haven't verified it yet.<br><br>
       To protect the integrity of the leaderboard and payouts, we need to make sure this profile is yours:<br>
       1. Copy this unique verification code: <b>${verificationToken}</b><br>
       2. Paste it into the bio section of your ${platform} profile.<br>
       3. Visit the dashboard and click "Verify Profile".<br><br>
       Once verified, you can immediately activate your commitment contract and start tracking daily solves.`,
      "Verify Profile Now",
      "https://consistpay.tech/settings?tab=platforms"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: "One tiny detail is missing... ⏳",
      html,
    });
    console.log(`[EmailService] Verification nudge sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Verification nudge failed:`, err.message);
  }
};

// 4. Send Contract Activated Email
const sendContractActivatedEmail = async (email, name, plan, dailyCommitment, activeDeposit, expiryDate) => {
  try {
    const formattedExpiry = new Date(expiryDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = wrapHTMLContent(
      "Contract Activated",
      "Your consistency contract is active. 💳",
      `Hey ${name || "there"},<br><br>
       Your ConsistPay contract is officially active. Here is your setup ledger:<br><br>
       • Plan Tier: <b>${plan.toUpperCase()} Mode</b><br>
       • Daily Commitment: <b>₹${dailyCommitment}/day</b><br>
       • Active Deposit Pool: <b>₹${activeDeposit}</b><br>
       • Next Cycle Expiry: <b>${formattedExpiry}</b><br><br>
       The rules are simple: solve at least 1 problem on LeetCode or GFG and sync your progress on the dashboard daily. If you miss a day, your commitment is deducted from your deposit pool. Keep your streak active to secure your refund.`,
      "Go to Dashboard",
      "https://consistpay.tech/dashboard"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: "Your consistency contract is active. 💳",
      html,
    });
    console.log(`[EmailService] Contract activation email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Contract activation email failed:`, err.message);
  }
};

// 5. Send Daily Streak Warning Email
const sendStreakWarningEmail = async (email, name, dailyCommitment) => {
  try {
    const html = wrapHTMLContent(
      "Streak Warning",
      "Quick coding check-in (before midnight collects the tax) ⏳",
      `Hey ${name || "there"},<br><br>
       We ran a quick check on your linked profiles, and we didn't find any solved problems for today yet.<br><br>
       You have a daily commitment of <b>₹${dailyCommitment}</b> locked for today. To protect your streak and your deposit:<br>
       1. Solve at least 1 problem on LeetCode or GFG.<br>
       2. Visit ConsistPay and click "Sync Progress" before 12:00 AM midnight.<br><br>
       If you have already solved today's problem, make sure you tap "Sync" on the dashboard so we can verify it.`,
      "Sync Your Progress Now",
      "https://consistpay.tech/dashboard"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: `Quick coding check-in (before midnight collects the tax) ⏳`,
      html,
    });
    console.log(`[EmailService] Daily streak warning sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Daily streak warning failed:`, err.message);
  }
};

// 6. Send Deduction Email (Rollover Miss)
const sendDeductionEmail = async (email, name, dailyCommitment, remainingDeposit, graceCoins = 0, isProtected = false) => {
  try {
    let html;
    let subject;
    
    if (isProtected) {
      subject = "Streak Protected! 🛡️";
      html = wrapHTMLContent(
        "Streak Protected",
        "Your streak is safe! 🛡️",
        `Hey ${name || "there"},<br><br>
         You missed yesterday's solve, but your streak is safe!<br><br>
         ConsistPay automatically consumed <b>1 Grace Coin</b> to protect your progress. Keep coding today so your hard work keeps building!<br><br>
         Remaining Grace Coins: <b>${graceCoins}</b>`,
        "Start Today's Solve",
        "https://consistpay.tech/dashboard"
      );
    } else {
      subject = "Oof. Yesterday was a slip. 💸";
      html = wrapHTMLContent(
        "Deduction Notification",
        "We had to collect the consistency tax.",
        `Hey ${name || "there"},<br><br>
         Yesterday was a miss. The consistency tax has been collected:<br><br>
         • Deducted Stake: <b>-₹${dailyCommitment}</b><br>
         • Remaining Deposit: <b>₹${remainingDeposit}</b><br>
         • Current Streak: <b>0 days</b><br><br>
         A single miss is just a slip. Two misses in a row is the start of a new habit. Let's make sure you secure today's solve early.`,
        "Start Today's Solve",
        "https://consistpay.tech/dashboard"
      );
    }

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject,
      html,
    });
    console.log(`[EmailService] Deduction/Protection email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Deduction email failed:`, err.message);
  }
};

// 7. Send Low Deposit Warning Email
const sendLowBalanceEmail = async (email, name, activeDeposit, dailyCommitment) => {
  try {
    const html = wrapHTMLContent(
      "Low Deposit Warning",
      "Your deposit is running low. ⚠️",
      `Hey ${name || "there"},<br><br>
       Your active deposit pool has fallen to <b>₹${activeDeposit}</b>, which is less than two days of your daily commitment (₹${dailyCommitment}/day).<br><br>
       If your active deposit drops to ₹0, your consistency contract will be suspended, and your streak tracking will halt. To prevent your streak from breaking automatically, please top up your active deposit pool.<br><br>
       Keep your deposit funded, and keep your streak going.`,
      "Top Up Deposit Pool",
      "https://consistpay.tech/dashboard"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: "Your deposit is running low. ⚠️",
      html,
    });
    console.log(`[EmailService] Low balance email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Low balance email failed:`, err.message);
  }
};

// 8. Send Streak Milestone Celebration
const sendMilestoneEmail = async (email, name, streak, securedBalance) => {
  try {
    const html = wrapHTMLContent(
      "Milestone Celebration",
      `${streak} days of pure focus. You're in the zone. 🚀`,
      `Hey ${name || "there"},<br><br>
       You just hit a <b>${streak}-day coding streak!</b> That's a massive achievement of showing up, compiling code, and building your habit.<br><br>
       Here is your ledger progress:<br>
       • Current Streak: <b>${streak} Days</b><br>
       • Secured Balance: <b>₹${securedBalance}</b><br><br>
       Keep the momentum going. Head to the dashboard to see your global rank on the leaderboard.`,
      "View Leaderboard Rank",
      "https://consistpay.tech/leaderboard"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: `${streak} days of pure focus. You're in the zone. 🚀`,
      html,
    });
    console.log(`[EmailService] Milestone email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Milestone email failed:`, err.message);
  }
};

// 9. Send Dormancy Re-engagement Email
const sendDormancyEmail = async (email, name) => {
  try {
    const html = wrapHTMLContent(
      "Dormancy Re-engagement",
      "Coding is a muscle. Let's do 1 easy solve today. 🕸️",
      `Hey ${name || "there"},<br><br>
       It's been 7 days since your last activity on ConsistPay.<br><br>
       Streaks are built one day at a time, but they are also rebuilt that way. You don't have to solve a hard problem today—just go to LeetCode, pick an easy one, compile, and sync it.<br><br>
       Get back in the game and rebuild your coding habit today.`,
      "Sync Today's Solve",
      "https://consistpay.tech/dashboard"
    );

    await transporter.sendMail({
      from: '"ConsistPay" <vanshvijay9784@gmail.com>',
      to: email,
      subject: "Coding is a muscle. Let's do 1 easy solve today. 🕸️",
      html,
    });
    console.log(`[EmailService] Dormancy email sent to ${email}`);
  } catch (err) {
    console.error(`[EmailService] Dormancy email failed:`, err.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendSetupReminderEmail,
  sendVerificationNudgeEmail,
  sendContractActivatedEmail,
  sendStreakWarningEmail,
  sendDeductionEmail,
  sendLowBalanceEmail,
  sendMilestoneEmail,
  sendDormancyEmail,
};
