import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Zap,
  IndianRupee,
  Shield,
  ArrowRight,
  Lock,
  Calendar,
  AlertTriangle,
  Code2,
  Users,
  Award,
  Check,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Info,
  Loader2,
  ArrowLeft
} from "lucide-react";

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<"Free" | "Pro" | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Reset error when step changes
  useEffect(() => {
    setError("");
  }, [step]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  // Trigger Actual Razorpay Checkout
  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const depositAmount = amount ? amount * 30 : 0;
      const totalAmount = plan === "Pro" ? depositAmount + 49 : depositAmount;

      // Step 1: Create Order in backend
      const orderRes = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          dailyCommitment: amount,
          depositAmount,
          totalAmount,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "Failed to initiate transaction order.");
      }

      const orderData = await orderRes.json();

      // Step 2: Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount, // Paise
        currency: "INR",
        name: "ConsistPay",
        description: `${plan} Plan - Daily Commitment: ₹${amount}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            setLoading(true);
            // Step 3: Verify Payment in backend
            const verifyRes = await fetch(`${API}/api/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                dailyCommitment: amount,
                depositAmount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.onboardingComplete) {
              setStep(7); // Jump to success screen
            } else {
              throw new Error(verifyData.message || "Payment verification failed.");
            }
          } catch (err: any) {
            setError(err.message || "Something went wrong verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Placement Candidate",
          email: "candidate@consistpay.com",
        },
        theme: {
          color: "#7C3AED",
        },
      };

      // Step 3: Open Razorpay modal
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay integration error:", err);
      setError(err.message || "Could not connect to Razorpay. Try skip payment below for demo.");
      setLoading(false);
    }
  };

  // Skip payment for Testing & Demo purposes
  const handleSkipPayment = async () => {
    try {
      setLoading(true);
      setError("");
      const depositAmount = amount ? amount * 30 : 0;

      const res = await fetch(`${API}/api/payment/skip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
          dailyCommitment: amount,
          depositAmount,
        }),
      });

      const data = await res.json();
      if (res.ok && data.onboardingComplete) {
        setStep(7); // Jump to success screen
      } else {
        throw new Error(data.message || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.message || "Connection error. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const depositTotal = amount ? amount * 30 : 0;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: "#08080B" }}>
      
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        
        {/* Top Header Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay
          </span>
        </div>

        {/* Wizard Container */}
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative">
          
          {/* Progress Indicators (Only for Steps 1-6) */}
          {step < 7 && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04]">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Step {step} of 6
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      step === num 
                        ? "w-6 bg-violet-500" 
                        : step > num 
                        ? "w-2 bg-violet-500/40" 
                        : "w-2 bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start gap-3 animate-in fade-in duration-300">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ──────────────── STEP 1: WELCOME SCREEN ──────────────── */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Build coding consistency that actually lasts.
                </h1>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                  Daily proof tracking, accountability challenges, and refundable commitment systems designed for placement preparation.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <div className="p-2.5 bg-violet-500/10 rounded-lg text-violet-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Daily Proof Tracking</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Upload daily coding screenshots to maintain streaks and unlock benefits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <div className="p-2.5 bg-violet-500/10 rounded-lg text-violet-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Accountability Challenges</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Participate in community coding goals and consistency battles.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <div className="p-2.5 bg-violet-500/10 rounded-lg text-violet-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Refundable Commitment</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Stay consistent, protect your stake, and receive your full refund at cycle end.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-4 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Continue Setup
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ──────────────── STEP 2: HOW IT WORKS ──────────────── */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">How ConsistPay Works</h2>
                <p className="text-zinc-400 text-xs">A psychology-backed accountability system built for placement prep.</p>
              </div>

              {/* Step Timeline */}
              <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.06] pl-2">
                
                <div className="relative flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center font-bold text-xs text-violet-400 shrink-0 z-10">
                    1
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-white">Choose Commitment</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Select a daily stake you care about. This establishes your accountability deposit pool.</p>
                  </div>
                </div>

                <div className="relative flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center font-bold text-xs text-violet-400 shrink-0 z-10">
                    2
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-white">Submit Daily Coding Proof</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Upload your successful LeetCode, GFG, or Code360 solution screenshot before 12:00 AM.</p>
                  </div>
                </div>

                <div className="relative flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center font-bold text-xs text-violet-400 shrink-0 z-10">
                    3
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-white">Maintain Consistency</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Gemini AI verifies your screenshot. Streaks are recorded, and grace coins protect your busy days.</p>
                  </div>
                </div>

                <div className="relative flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center font-bold text-xs text-violet-400 shrink-0 z-10">
                    4
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-white">Unlock Refund + Rewards</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">At the end of the challenge, claim your full refundable deposit and earn consistency rewards.</p>
                  </div>
                </div>

              </div>

              {/* Trust badges grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-zinc-300">100% Refundable System</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-zinc-300">Secure Razorpay Payments</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-zinc-300">Grace Day Protection</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-zinc-300">Automated AI Verification</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-medium text-sm transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: CHOOSE PLAN ──────────────── */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Choose Your Accountability Tier</h2>
                <p className="text-zinc-400 text-xs">Select how you want to build consistency.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setPlan("Free")}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    plan === "Free"
                      ? "border-violet-500/60 bg-violet-500/[0.03]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] uppercase font-semibold tracking-wider text-zinc-300">
                      Free Tier
                    </span>
                    {plan === "Free" && <Check className="w-4 h-4 text-violet-400" />}
                  </div>
                  <h3 className="font-bold text-white text-base">Basic Accountability</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Access to daily habit logging, basic streak calendar, and 1 grace day protect coin.
                  </p>
                </button>

                <button
                  onClick={() => setPlan("Pro")}
                  className={`p-5 rounded-xl border text-left transition-all relative ${
                    plan === "Pro"
                      ? "border-violet-500 bg-violet-500/[0.04]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] uppercase font-bold tracking-wider text-violet-300">
                      Pro Tier
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Best for serious prep
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                    Premium Prep Mode <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Unlocks consistency battles (challenges), AI placement recommendations, 2 cycle-saver grace coins, priority verification, and detailed analytics.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-violet-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>Requires ₹49 setup fee + Refundable Commitment</span>
                  </div>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-medium text-sm transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!plan}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: SELECT COMMITMENT ──────────────── */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Select Daily Commitment</h2>
                <p className="text-zinc-400 text-xs">Choose the stake that will keep you accountable every single day.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setAmount(5)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                    amount === 5
                      ? "border-violet-500 bg-violet-500/[0.03]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-lg shrink-0">
                    ₹5
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Casual Consistency</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">₹150 refundable deposit pool. Great for building routine.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(20)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                    amount === 20
                      ? "border-violet-500 bg-violet-500/[0.03]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-bold text-violet-400 text-lg shrink-0">
                    ₹20
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      Serious Placement Prep
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">₹600 refundable deposit pool. Keep your focus locked.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(50)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                    amount === 50
                      ? "border-violet-500 bg-violet-500/[0.03]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-lg shrink-0">
                    ₹50
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">High Accountability Mode</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">₹1,500 refundable deposit pool. Maximum dedication.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500">/ day</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/10 flex gap-3 text-xs leading-relaxed text-zinc-400">
                <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <p>
                  Having "skin in the game" psychologically increases consistency by up to 3x. Your deposit is fully returned if you maintain your commitment.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-medium text-sm transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!amount}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 5: CHALLENGE REVIEW SCREEN ──────────────── */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Review Your Commitment Challenge</h2>
                <p className="text-zinc-400 text-xs">Verify your 30-day program specifications.</p>
              </div>

              {/* Review Card */}
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-3">
                  <span className="text-zinc-500">Selected Plan</span>
                  <span className="font-semibold text-white">{plan} Mode</span>
                </div>

                <div className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-3">
                  <span className="text-zinc-500">Daily Commitment</span>
                  <span className="font-semibold text-white">₹{amount} / day</span>
                </div>

                <div className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-3">
                  <span className="text-zinc-500">Challenge Duration</span>
                  <span className="font-semibold text-white">30 Days</span>
                </div>

                {plan === "Pro" && (
                  <div className="flex justify-between items-center text-sm border-b border-white/[0.04] pb-3">
                    <span className="text-zinc-500">Pro Setup Fee</span>
                    <span className="font-semibold text-white">₹49</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-zinc-400 font-medium">Refundable Deposit</span>
                  <span className="font-bold text-xl text-violet-400">₹{depositTotal}</span>
                </div>
              </div>

              {/* Psychological Outcome Indicators */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 space-y-1.5 text-xs text-emerald-300">
                  <h4 className="font-semibold flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    If you maintain consistency:
                  </h4>
                  <p>• Receive 100% of your ₹{depositTotal} refundable deposit back.</p>
                  <p>• Unlock consistency rewards and streak multipliers.</p>
                  <p>• Boost placement-readiness score on the leaderboard.</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 space-y-1.5 text-xs text-amber-300">
                  <h4 className="font-semibold flex items-center gap-1.5 text-white">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    If you miss a day:
                  </h4>
                  <p>• ₹{amount} deducted from your deposit pool (only for missed days).</p>
                  <p>• Grace day coins automatically save your streak (if available).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-xl font-medium text-sm transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue to Secure Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 6: SECURE CHECKOUT ──────────────── */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center space-y-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Secure Checkout</h2>
                <p className="text-zinc-400 text-xs">
                  Your refundable deposit secures your accountability challenge.
                </p>
              </div>

              {/* Simple Premium Summary Card */}
              <div className="bg-[#0C0C10] border border-white/[0.04] rounded-xl p-5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase tracking-wide">Product / Plan</span>
                  <span className="font-semibold text-white">{plan === "Pro" ? "Pro Plan Setup + Challenge" : "Free Plan Challenge"}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase tracking-wide">Duration</span>
                  <span className="font-semibold text-white">30 Days</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 uppercase tracking-wide">Refundable Deposit</span>
                  <span className="font-semibold text-white">₹{depositTotal}</span>
                </div>

                {plan === "Pro" && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 uppercase tracking-wide">Pro Setup Fee</span>
                    <span className="font-semibold text-white">₹49</span>
                  </div>
                )}

                <div className="border-t border-white/[0.04] pt-3.5 flex justify-between items-center">
                  <span className="text-sm font-semibold text-zinc-300">Amount Due Now</span>
                  <span className="text-2xl font-bold text-white">
                    ₹{plan === "Pro" ? depositTotal + 49 : depositTotal}
                  </span>
                </div>
              </div>

              {/* Payment Methods and Trust */}
              <div className="space-y-3.5">
                <div className="flex justify-center items-center gap-5 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Razorpay SSL Secured</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Supports UPI, Cards & Netbanking</span>
                </div>

                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2.5 text-sm"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Continue with Razorpay
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Demo Sandbox Mode */}
              <div className="pt-4 border-t border-white/[0.04] text-center">
                <p className="text-zinc-500 text-[10px]">Testing environment or API issues?</p>
                <button
                  onClick={handleSkipPayment}
                  disabled={loading}
                  className="mt-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-all"
                >
                  [Demo Mode] Skip Payment & Activate Onboarding
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 7: SUCCESS ACTIVATION SCREEN ──────────────── */}
          {step === 7 && (
            <div className="space-y-6 text-center animate-in scale-in duration-500">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-2">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-white">Challenge Activated!</h1>
                <p className="text-zinc-400 text-xs">Your accountability framework is officially active.</p>
              </div>

              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-5 text-left max-w-sm mx-auto space-y-3.5">
                <div className="flex items-start gap-3 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white">Commitment Deposit Pool Active</h5>
                    <p className="text-zinc-400 mt-0.5">₹{depositTotal} is locked. Maintain your habit to protect your balance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white">Streak starts today</h5>
                    <p className="text-zinc-400 mt-0.5">Solve a problem and upload your verified proof before 12:00 AM.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white">AI Assistant Active</h5>
                    <p className="text-zinc-400 mt-0.5">Automated submission parsing and personalized dsa recommendations are active.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  // Redirect to dashboard page
                  window.location.href = "/dashboard";
                }}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] italic text-zinc-500 pt-2">
                "Consistency is what transforms average programmers into exceptional engineers."
              </p>
            </div>
          )}

        </div>

        {/* Back Link */}
        {step > 1 && step < 7 && (
          <button
            onClick={handleBack}
            className="mt-5 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-all mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous step
          </button>
        )}

      </div>
    </div>
  );
}
