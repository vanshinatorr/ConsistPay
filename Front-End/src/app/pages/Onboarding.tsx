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
  const [plan, setPlan] = useState<"Free" | "Pro" | null>("Pro");
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
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
    console.log("Razorpay dummy mode: Redirecting to simulated checkout...");
    await handleSkipPayment();
  };

  // Skip payment for Testing & Demo purposes
  const handleSkipPayment = async () => {
    try {
      setLoading(true);
      setError("");
      setProcessingStep(1); // Connecting to secure server
      
      setTimeout(() => setProcessingStep(2), 1200); // Processing payment

      const depositAmount = amount ? amount * 30 : 0;

      setTimeout(async () => {
        try {
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
          if (!res.ok) throw new Error(data.message || "Failed to process.");

          // Update local storage cache immediately to prevent redirection loop
          const cachedUserStr = localStorage.getItem("consistpay_user_data");
          if (cachedUserStr) {
            const cachedUser = JSON.parse(cachedUserStr);
            cachedUser.onboardingComplete = true;
            cachedUser.plan = data.plan;
            cachedUser.balance = data.balance;
            cachedUser.activeDeposit = data.activeDeposit;
            localStorage.setItem("consistpay_user_data", JSON.stringify(cachedUser));
          }

          setProcessingStep(3); // Success
          setTimeout(() => {
            setStep(7);
            setProcessingStep(0);
            setLoading(false);
          }, 500);

        } catch (err: any) {
          setError(err.message);
          setLoading(false);
          setProcessingStep(0);
        }
      }, 2500);

    } catch (err: any) {
      setError(err.message || "Could not skip payment.");
      setLoading(false);
      setProcessingStep(0);
    }
  };

  const depositTotal = amount ? amount * 30 : 0;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative overflow-y-auto" style={{ backgroundColor: "#0F0F13" }}>
      
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <div className={`w-full relative z-10 my-auto transition-all duration-300 ${step === 3 || step === 5 ? "max-w-4xl" : "max-w-2xl"}`}>
        
        {/* Top Header Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
        </div>

        {/* Wizard Container */}
        <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-5 md:p-10 shadow-2xl relative">
          
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
                <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
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
                    <h3 className="font-semibold text-white text-sm">Automatic Verification</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Connect your LeetCode account to automatically sync and verify daily solves.</p>
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
                    <h4 className="text-sm font-semibold text-white">Connect LeetCode Profile</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Link your LeetCode profile during setup and verify ownership in under a minute.</p>
                  </div>
                </div>

                <div className="relative flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/25 flex items-center justify-center font-bold text-xs text-violet-400 shrink-0 z-10">
                    3
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-semibold text-white">Solve & Auto-Sync</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Solve problems on LeetCode. Our automated systems sync your solve history directly to update your streaks.</p>
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
                  className="px-5 py-3 border border-white/[0.04] hover:bg-white/5 rounded-xl font-medium text-sm transition-all"
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
            <div className="space-y-4 animate-in fade-in duration-500 text-left">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Choose Your Accountability Tier</h2>
                <p className="text-zinc-400 text-xs">Select how you want to build consistency. Pro tier is highly recommended for serious preparation.</p>
              </div>

              {/* Mobile Plan Selector (Segmented Tabs) */}
              <div className="flex md:hidden bg-zinc-900/60 p-1 rounded-xl border border-white/[0.04] mb-4 select-none">
                <button
                  type="button"
                  onClick={() => setPlan("Free")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    plan === "Free" ? "bg-white/10 text-white shadow" : "text-zinc-500"
                  }`}
                >
                  Free Plan
                </button>
                <button
                  type="button"
                  onClick={() => setPlan("Pro")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    plan === "Pro" ? "bg-violet-600 text-white shadow" : "text-zinc-500"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Pro Plan (Recommended)
                </button>
              </div>

              {/* Mobile Single Card Render */}
              <div className="block md:hidden">
                {plan === "Free" ? (
                  <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] text-left space-y-4 shadow-xl">
                    <div>
                      <h3 className="font-bold text-white text-lg tracking-tight">Basic Accountability</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Habit logging and basic streak tracking for routine builders.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-1 text-xs text-zinc-300">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>1 Daily verification submission</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>Basic consistency calendar</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>1 grace coin to protect streak</span>
                      </li>
                    </ul>
                    <div className="border-t border-white/[0.04] pt-3 flex justify-between items-center">
                      <span className="text-sm font-semibold text-zinc-350">Free Forever</span>
                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border border-violet-500/30 bg-violet-500/[0.02] text-left space-y-4 relative overflow-hidden shadow-[0_0_25px_rgba(124,58,237,0.05)]">
                    <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                      RECOMMENDED
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg tracking-tight">Premium Prep Mode</h3>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        Complete feature set designed for placement preparation.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-1 text-xs text-zinc-300">
                      <li className="flex items-center gap-2.5 font-semibold text-emerald-400">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>+10% Cash Streak Payout Bonus</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-violet-300">
                        <Users className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>Join PvP battles & Challenges</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>Double Grace Coins (milestones)</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>Gemini AI Performance Advisor</span>
                      </li>
                    </ul>
                    <div className="border-t border-white/[0.04] pt-3 space-y-2">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm font-semibold text-violet-400">₹49 setup + deposit</span>
                        <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">Active</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-normal font-medium flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg p-2">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>Affordable pricing to help you stay committed.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Dual Cards Compare Layout (md:grid) */}
              <div className="hidden md:grid md:grid-cols-2 gap-5 pt-1">
                {/* Free Card */}
                <button
                  onClick={() => setPlan("Free")}
                  type="button"
                  className={`p-4 sm:p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[290px] sm:min-h-[340px] relative overflow-hidden group ${
                    plan === "Free"
                      ? "border-white/[0.08] bg-white/[0.02] shadow-sm"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-850 border border-zinc-805 text-[9px] uppercase font-semibold tracking-wider text-zinc-400">
                        Free Tier
                      </span>
                      {plan === "Free" && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg tracking-tight">Basic Accountability</h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Habit logging and basic streak tracking for routine builders.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-1 text-xs text-zinc-300">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>1 Daily verification submission</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>Basic consistency calendar</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span>1 grace coin to protect streak</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-500">
                        <Info className="w-4 h-4 text-zinc-550 shrink-0" />
                        <span className="text-[10px]">Requires refundable deposit stake</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-between items-center w-full border-t border-white/[0.04] pt-3">
                    <span className="text-sm font-semibold text-zinc-350">Free Forever</span>
                    {plan === "Free" && <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Selected</span>}
                  </div>
                </button>

                {/* Pro Card */}
                <button
                  onClick={() => setPlan("Pro")}
                  type="button"
                  className={`p-4 sm:p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between min-h-[290px] sm:min-h-[340px] overflow-hidden group ${
                    plan === "Pro"
                      ? "border-violet-500 bg-violet-500/[0.02] shadow-md"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-violet-500/20 hover:bg-[#0E0E14]"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-4 py-1 uppercase tracking-wider rounded-bl-lg shadow-md">
                    RECOMMENDED
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] uppercase font-semibold tracking-wider text-violet-300">
                        Pro Tier
                      </span>
                      {plan === "Pro" && <CheckCircle2 className="w-4.5 h-4.5 text-violet-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg tracking-tight">Premium Prep Mode</h3>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        Complete feature set designed for placement preparation.
                      </p>
                    </div>
                    <ul className="space-y-2 pt-1 text-xs text-zinc-300">
                      <li className="flex items-center gap-2.5 font-semibold text-emerald-400">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>+10% Cash Streak Payout Bonus</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-violet-300">
                        <Users className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>Join PvP battles & Challenges</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-300">
                        <Zap className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>Double Grace Coins (milestones)</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-300">
                        <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                        <span>Gemini AI Performance Advisor</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-500">
                        <Info className="w-4 h-4 text-zinc-550 shrink-0" />
                        <span className="text-[10px]">Requires refundable deposit stake</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-col w-full border-t border-white/[0.04] pt-3 gap-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-semibold text-violet-400">₹49 setup + deposit</span>
                      {plan === "Pro" && <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">Active</span>}
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-normal font-medium flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg p-2 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>Affordable pricing to help you stay committed.</span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-4 pt-3 border-t border-white/[0.04] mt-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-white/[0.04] hover:bg-[#16161F] rounded-xl font-semibold text-xs transition-all text-zinc-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!plan}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  Continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 4: SELECT COMMITMENT ──────────────── */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500 text-left">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Select Daily Commitment</h2>
                <p className="text-zinc-400 text-xs">Choose the stake that will keep you accountable every single day.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAmount(5)}
                  type="button"
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    amount === 5
                      ? "border-emerald-500/50 bg-emerald-500/[0.02] text-emerald-400 font-semibold"
                      : "border-white/[0.04] bg-[#0F0F13] text-zinc-400 hover:border-white/[0.08]"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-semibold text-zinc-400">Casual</span>
                  <span className="text-base sm:text-lg font-bold text-white">₹5</span>
                  <span className="text-[9px] text-zinc-500">₹150 total</span>
                </button>

                <button
                  onClick={() => setAmount(20)}
                  type="button"
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    amount === 20
                      ? "border-violet-500/50 bg-violet-500/[0.02] text-violet-400 font-semibold"
                      : "border-white/[0.04] bg-[#0F0F13] text-zinc-400 hover:border-white/[0.08]"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-semibold text-zinc-400">Prep</span>
                  <span className="text-base sm:text-lg font-bold text-white">₹20</span>
                  <span className="text-[9px] text-zinc-500">₹600 total</span>
                </button>

                <button
                  onClick={() => setAmount(50)}
                  type="button"
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    amount === 50
                      ? "border-amber-500/50 bg-amber-500/[0.02] text-amber-400 font-semibold"
                      : "border-white/[0.04] bg-[#0F0F13] text-zinc-400 hover:border-white/[0.08]"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-semibold text-zinc-400">High</span>
                  <span className="text-base sm:text-lg font-bold text-white">₹50</span>
                  <span className="text-[9px] text-zinc-500">₹1,500 total</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#0F0F13] border border-white/[0.04] text-xs leading-relaxed text-zinc-400">
                Having "skin in the game" psychologically increases consistency by up to 3x. Your deposit is fully returned if you maintain your commitment.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/[0.04] hover:bg-white/5 rounded-xl font-medium text-sm transition-all text-zinc-400 hover:text-white"
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
            <div className="space-y-4 animate-in fade-in duration-500 text-left">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Review Your Commitment Challenge</h2>
                <p className="text-zinc-400 text-xs">Verify your 30-day program specifications before checkout.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch pt-1">
                {/* Left Side: Summary Table */}
                <div className="bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="font-bold text-white text-sm border-b border-white/[0.04] pb-2">Challenge Details</h3>
                    <div className="flex justify-between items-center text-xs border-b border-white/[0.04] pb-2">
                      <span className="text-zinc-500">Selected Plan</span>
                      <span className="font-semibold text-zinc-200 capitalize">{plan} Mode</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-white/[0.04] pb-2">
                      <span className="text-zinc-500">Daily Commitment</span>
                      <span className="font-semibold text-zinc-200">₹{amount} / day</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-white/[0.04] pb-2">
                      <span className="text-zinc-500">Challenge Duration</span>
                      <span className="font-semibold text-zinc-300">30 Days</span>
                    </div>

                    {plan === "Pro" && (
                      <>
                        <div className="flex justify-between items-center text-xs border-b border-white/[0.04] pb-2">
                          <span className="text-zinc-500">Pro Setup Fee</span>
                          <span className="font-semibold text-violet-400">₹49</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-white/[0.04] pb-2">
                          <span className="text-zinc-500">Premium 10% Bonus Payout</span>
                          <span className="font-semibold text-emerald-400">+₹{Math.round(depositTotal * 0.1)}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center text-xs border-b border-white/[0.04] pb-2 pt-0.5">
                      <span className="text-zinc-400">Total Projected Payout</span>
                      <span className="font-semibold text-emerald-400 text-sm">
                        ₹{plan === "Pro" ? Math.round(depositTotal * 1.1) : depositTotal}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1.5 bg-[#0F0F13] p-2.5 rounded-xl border border-white/[0.04]">
                    <span className="text-zinc-400 font-semibold">Refundable Deposit</span>
                    <span className="font-bold text-lg text-violet-400">₹{depositTotal}</span>
                  </div>
                </div>

                {/* Right Side: Simple Rules */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="p-4 md:p-5 rounded-2xl border border-emerald-500/10 bg-[#0F0F13] space-y-2.5 flex-1 flex flex-col justify-center">
                    <div>
                      <h4 className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                        If You Maintain Consistency
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        <li className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Get your full <strong className="text-white font-semibold">₹{depositTotal}</strong> refundable deposit back.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          {plan === "Pro" ? (
                            <span>
                              Receive extra <strong className="text-emerald-400 font-semibold">10% cash bonus (+₹{Math.round(depositTotal * 0.1)})</strong>. Total payout: <strong className="text-emerald-400 font-semibold">₹{Math.round(depositTotal * 1.1)}</strong>!
                            </span>
                          ) : (
                            <span className="text-zinc-400">
                              (Upgrade to Pro to unlock an extra 10% cash bonus of <strong>+₹{Math.round(depositTotal * 0.1)}</strong> at month-end).
                            </span>
                          )}
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Unlock placement multiplier milestones and achievements.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 md:p-5 rounded-2xl border border-amber-500/10 bg-[#0F0F13] space-y-2.5 flex-1 flex flex-col justify-center">
                    <div>
                      <h4 className="font-semibold text-amber-400 text-xs flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                        If You Miss a Day
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span><strong className="text-white font-semibold">₹{amount}</strong> deducted from your deposit pool (only for missed days).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>Streak-saving grace coins are automatically applied if you own any.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>Grace coins are disabled during active PvP Friend Challenges.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-3 border-t border-white/[0.04] mt-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-white/[0.04] hover:bg-[#16161F] rounded-xl font-semibold text-xs transition-all text-zinc-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                >
                  Continue to Secure Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 6: SECURE CHECKOUT ──────────────── */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-500 text-left">
              {loading && processingStep > 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-violet-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white animate-pulse">
                      {processingStep === 1 ? "Connecting to Bank..." : "Verifying Transaction..."}
                    </h3>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-mono font-semibold">
                      {processingStep === 1 ? "ESTABLISHING SECURE CONNECTION" : "PROCESSING PAYMENT OF ₹" + (plan === "Pro" ? (amount ? amount * 30 : 0) + 49 : (amount ? amount * 30 : 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Secure Checkout</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Complete your payment securely. Your refundable deposit will be returned after 30 days of consistency.
                    </p>
                  </div>

                  {/* Sandbox Banner */}
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300/90 shadow-sm shadow-amber-500/2">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Sandbox Mode Enabled — Production Gateway Pending</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        No real money will be charged. Please use the simulated checkout to complete onboarding verification and test the consistency flow.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                      <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="p-5 rounded-2xl border border-white/[0.04] bg-[#0F0F13] space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Selected Plan</span>
                      <span className="text-white font-semibold capitalize flex items-center gap-1.5">
                        {plan === "Pro" && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                        {plan} Mode
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Daily Commitment</span>
                      <span className="text-white font-semibold">₹{amount}/day</span>
                    </div>
                    
                    <div className="h-px bg-white/[0.04] w-full" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-zinc-300 font-semibold text-xs">Refundable Deposit</span>
                        <span className="text-zinc-500 text-[9px]">Held securely for 30 days. Fully refundable.</span>
                      </div>
                      <span className="text-white font-semibold text-sm">₹{amount ? amount * 30 : 0}</span>
                    </div>

                    {plan === "Pro" ? (
                      <>
                        <div className="flex items-center justify-between pt-1 border-b border-white/[0.04] pb-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-violet-300 font-semibold">Pro Setup & Subscription</span>
                            <span className="text-violet-500/60 text-[9px]">1 month feature access</span>
                          </div>
                          <span className="text-violet-400 font-semibold">₹49</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-semibold">Projected Monthly Refund Payout</span>
                            <span className="text-zinc-500 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit + 10% Cash Streak Bonus</span>
                          </div>
                          <span className="text-emerald-400 font-semibold text-sm">₹{Math.round((amount ? amount * 30 : 0) * 1.1)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-semibold">Projected Monthly Refund Payout</span>
                          <span className="text-zinc-500 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit returned on consistency</span>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">₹{amount ? amount * 30 : 0}</span>
                      </div>
                    )}
                    
                    <div className="h-px bg-white/[0.04] w-full" />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">Total to Pay</span>
                        <span className="text-emerald-400/80 text-[10px] font-semibold">Includes all payment fees & taxes</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-xl">
                        ₹{plan === "Pro" ? (amount ? amount * 30 : 0) + 49 : (amount ? amount * 30 : 0)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Methods and Trust */}
                  <div className="space-y-3 pt-1">
                    <button
                      onClick={handleSkipPayment}
                      disabled={loading}
                      className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4 shrink-0 text-white" />
                          Simulate Secure Payment (Test Mode)
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleRazorpayPayment}
                      disabled={loading}
                      className="w-full py-3 bg-[#16161F] border border-white/[0.04] hover:bg-[#1E1E2A] disabled:opacity-50 text-zinc-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      Razorpay Checkout (UPI, Cards, Netbanking)
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        disabled={loading}
                        className="w-full py-2 border border-white/[0.04] hover:bg-[#16161F] text-zinc-500 hover:text-zinc-300 font-semibold rounded-xl text-[10px] transition-all flex justify-center items-center"
                      >
                        Back to Review
                      </button>
                    </div>

                    <div className="flex justify-center items-center gap-1.5 text-[9px] text-zinc-500 pt-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>256-bit Encrypted SSL Secure Checkout Connection</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ──────────────── STEP 7: SUCCESS ACTIVATION SCREEN ──────────────── */}
          {step === 7 && (
            <div className="space-y-6 text-center animate-in scale-in duration-500">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-2">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Challenge Activated!</h1>
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
                  navigate("/dashboard");
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
