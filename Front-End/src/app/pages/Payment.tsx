import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Calendar, Lock, Clipboard, Shield, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, amount, totalAmount } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState<"payment" | "processing" | "success" | "commitment">("payment");

  const handlePasteTestCard = () => {
    setCardNumber("4111 1111 1111 1111");
    setExpiry("12/30");
    setCvv("123");
  };

  const handlePay = async () => {
    setLoading(true);
    setScreen("processing");
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const token = localStorage.getItem("token") || "";
      console.log("Initiating local payment bypass. URL:", `${import.meta.env.VITE_API_URL}/api/payment/skip`);
      console.log("Payload being sent:", { plan, dailyCommitment: amount, depositAmount: totalAmount });
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/skip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          dailyCommitment: amount,
          depositAmount: totalAmount,
        }),
      });

      console.log("API Response Status:", res.status);
      const data = await res.json();
      console.log("API Response Data:", data);

      if (res.ok && data.onboardingComplete) {
        setScreen("success");
        setTimeout(() => setScreen("commitment"), 2000);
      } else {
        console.error("Payment registration failed. Backend message:", data.message || "No message provided");
        alert(`Payment failed: ${data.message || "Something went wrong!"}`);
        setScreen("payment");
      }
    } catch (err: any) {
      console.error("Network error during payment submission:", err);
      alert(`Payment failed: ${err.message || "Network error. Please ensure your local backend is running at port 8000."}`);
      setScreen("payment");
    } finally {
      setLoading(false);
    }
  };

  if (screen === "payment") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Secure Payment</h1>
            <p className="text-zinc-400 text-sm mt-1">Complete your commitment setup</p>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-zinc-400">Plan</span>
              <span className="font-bold text-lg">{plan} Tier</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-zinc-400">Daily Stake</span>
              <span className="font-bold">₹{amount}</span>
            </div>
            <div className="flex justify-between items-center text-[#7C3AED]">
              <span className="font-medium">Total Amount</span>
              <span className="font-bold text-2xl">₹{totalAmount}</span>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="mb-4">
              <label className="text-sm text-zinc-400 mb-2 block">Card Number</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 1111 1111 1111"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED] transition-all"
                  />
                </div>
                <button
                  onClick={handlePasteTestCard}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 text-sm text-zinc-300"
                >
                  <Clipboard className="w-4 h-4" />
                  Paste
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="text-sm text-zinc-400 mb-2 block">Expiry</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED] transition-all"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-zinc-400 mb-2 block">CVV</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Secured by Razorpay. Your data is encrypted.</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-70 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Pay ₹{totalAmount}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              💡 Your ₹{totalAmount} is safe! Complete daily tasks → full refund + bonus at month end.
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              "Free motivation dies in 3 days. Your ₹{totalAmount} doesn't."
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "processing") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold">Securing your commitment...</h2>
        <p className="text-zinc-400 text-sm mt-2">Please wait while we process your payment</p>
      </div>
    );
  }

  if (screen === "success") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold">Payment Successful</h2>
        <p className="text-zinc-400 text-sm mt-2">₹{totalAmount} received</p>
        <p className="text-zinc-500 text-xs mt-1">Transaction ID: CP{Date.now()}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.5)]">
        <Shield className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2">🎯 Commitment Locked!</h2>
      <p className="text-zinc-400 text-center max-w-md mb-2">
        "Free motivation dies in 3 days. Your ₹{totalAmount} doesn't."
      </p>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 mb-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm">₹{totalAmount} secured in your wallet</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm">Show up daily → full refund + 10% bonus</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm">Miss a day → only that day's amount deducted</span>
        </div>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
