import { useState, useEffect } from "react";
import { X } from "lucide-react";
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

interface CommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function CommitmentModal({ isOpen, onClose, onComplete }: CommitmentModalProps) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<"Free" | "Pro" | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingStep, setProcessingStep] = useState(0);

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
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
      
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <div className={`w-full relative z-10 my-auto transition-all duration-300 ${step === 3 || step === 5 ? "max-w-4xl" : "max-w-2xl"}`}>
        
        {/* Top Header Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay Setup
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Container */}
        <div className="bg-[#0F0F13] border border-zinc-800 rounded-3xl p-5 md:p-10 shadow-2xl relative">
          
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

          {error && step !== 6 && (
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
            <div className="space-y-5 animate-in fade-in duration-500 text-left">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Choose Your Accountability Tier</h2>
                <p className="text-zinc-405 text-xs">Select how you want to build consistency. Pro tier is highly recommended for serious preparation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* Free Card */}
                <button
                  onClick={() => setPlan("Free")}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between min-h-[340px] relative overflow-hidden group ${
                    plan === "Free"
                      ? "border-zinc-700 bg-white/[0.02] shadow-[0_0_20px_rgba(255,255,255,0.01)] ring-1 ring-zinc-500/20"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-zinc-700 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-850 border border-zinc-800 text-[9px] uppercase font-bold tracking-wider text-zinc-400">
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
                        <div className="w-4 h-4 rounded-full bg-zinc-850 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-zinc-400" />
                        </div>
                        <span>1 Daily verification submission</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-zinc-850 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-zinc-400" />
                        </div>
                        <span>Basic consistency calendar</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-zinc-850 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-zinc-400" />
                        </div>
                        <span>1 grace coin to protect streak</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-550">
                        <div className="w-4 h-4 rounded-full bg-zinc-850 flex items-center justify-center shrink-0">
                          <Info className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="text-[10px]">Requires refundable deposit stake</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-between items-center w-full border-t border-white/[0.04] pt-3">
                    <span className="text-sm font-semibold text-zinc-350">Free Forever</span>
                    {plan === "Free" && <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Selected</span>}
                  </div>
                </button>

                {/* Pro Card */}
                <button
                  onClick={() => setPlan("Pro")}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between min-h-[340px] overflow-hidden group ${
                    plan === "Pro"
                      ? "border-violet-500 bg-violet-955/10 shadow-[0_0_30px_rgba(124,58,237,0.1)] ring-1 ring-violet-500/20"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-violet-500/20 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-4 py-1 uppercase tracking-wider rounded-bl-lg shadow-md">
                    RECOMMENDED
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] uppercase font-bold tracking-wider text-violet-300">
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
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span>+10% Cash Streak Payout Bonus</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-violet-350 font-semibold">
                        <div className="w-4 h-4 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <Users className="w-3 h-3 text-violet-400" />
                        </div>
                        <span>Join PvP battles & Challenges</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-350">
                        <div className="w-4 h-4 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <Zap className="w-3 h-3 text-violet-400" />
                        </div>
                        <span>Double Grace Coins (milestones)</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-300">
                        <div className="w-4 h-4 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                        </div>
                        <span>Gemini AI Performance Advisor</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-zinc-550">
                        <div className="w-4 h-4 rounded-full bg-zinc-850 flex items-center justify-center shrink-0">
                          <Info className="w-3 h-3 text-zinc-550" />
                        </div>
                        <span className="text-[10px]">Requires refundable deposit stake</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-col w-full border-t border-violet-900/20 pt-3 gap-1">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-semibold text-violet-450">₹49 setup + deposit</span>
                      {plan === "Pro" && <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">Active</span>}
                    </div>
                    <div className="text-[10px] text-violet-300/80 leading-normal italic font-normal flex items-center gap-1.5 bg-violet-500/5 border border-violet-500/10 rounded-lg p-1.5 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>Less than a cup of coffee to unlock Pro!</span>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-4 pt-3 border-t border-zinc-800/40 mt-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-zinc-800 hover:bg-[#16161F] rounded-xl font-semibold text-xs transition-all text-zinc-400 hover:text-white"
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
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Select Daily Commitment</h2>
                <p className="text-zinc-405 text-sm">Choose the stake that will keep you accountable every single day.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <button
                  onClick={() => setAmount(5)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-5 ${
                    amount === 5
                      ? "border-zinc-700 bg-white/[0.02] ring-2 ring-zinc-500/10"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-zinc-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#131316] border border-white/[0.04] flex items-center justify-center font-bold text-zinc-300 text-xl shrink-0">
                    ₹5
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Casual Consistency</h4>
                    <p className="text-xs text-zinc-400 mt-1">₹150 refundable deposit pool. Great for building routine.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500 font-medium uppercase tracking-wider">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(20)}
                  className={`p-5 rounded-2xl border text-left relative flex items-center gap-5 overflow-hidden ${
                    amount === 20
                      ? "border-violet-500 bg-violet-950/10 ring-2 ring-violet-500/20"
                      : "border-white/[0.04] bg-white/[0.01] hover:border-violet-500/20"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[8px] font-bold px-3 py-0.5 uppercase tracking-widest rounded-bl-lg shadow-sm">
                    POPULAR
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-bold text-violet-400 text-xl shrink-0">
                    ₹20
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                      Serious Placement Prep
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1">₹600 refundable deposit pool. Keep your focus locked.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-400 font-medium uppercase tracking-wider">/ day</span>
                </button>

                <button
                  onClick={() => setAmount(50)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-5 ${
                    amount === 50
                      ? "border-emerald-500 bg-emerald-955/10"
                      : "border-zinc-800 bg-[#0C0C10] hover:border-emerald-500/20"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xl shrink-0">
                    ₹50
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">High Accountability Mode</h4>
                    <p className="text-xs text-zinc-300 mt-1">₹1,500 refundable deposit pool. Maximum dedication.</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-550 font-medium uppercase tracking-wider">/ day</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs leading-relaxed text-zinc-400">
                Having "skin in the game" psychologically increases consistency by up to 3x. Your deposit is fully returned if you maintain your commitment.
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleBack}
                  className="px-6 py-3.5 border border-zinc-800 hover:bg-[#16161F] rounded-xl font-semibold text-sm transition-all text-zinc-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!amount}
                  className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-500 text-left">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Review Your Commitment Challenge</h2>
                <p className="text-zinc-405 text-xs">Verify your 30-day program specifications before checkout.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch pt-1">
                {/* Left Side: Summary Table */}
                <div className="bg-[#0C0C10] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="font-bold text-white text-sm border-b border-zinc-800/80 pb-2">Challenge Details</h3>
                    <div className="flex justify-between items-center text-xs border-b border-zinc-800/60 pb-2">
                      <span className="text-zinc-500">Selected Plan</span>
                      <span className="font-bold text-zinc-200 capitalize">{plan} Mode</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-zinc-800/60 pb-2">
                      <span className="text-zinc-500">Daily Commitment</span>
                      <span className="font-bold text-zinc-200">₹{amount} / day</span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-zinc-800/60 pb-2">
                      <span className="text-zinc-500">Challenge Duration</span>
                      <span className="font-semibold text-zinc-300">30 Days</span>
                    </div>

                    {plan === "Pro" && (
                      <>
                        <div className="flex justify-between items-center text-xs border-b border-zinc-800/60 pb-2">
                          <span className="text-zinc-500">Pro Setup Fee</span>
                          <span className="font-semibold text-violet-400">₹49</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-zinc-800/60 pb-2">
                          <span className="text-zinc-500">Premium 10% Bonus Payout</span>
                          <span className="font-extrabold text-emerald-400">+₹{Math.round(depositTotal * 0.1)}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center text-xs border-b border-zinc-800/60 pb-2 pt-0.5">
                      <span className="text-zinc-400">Total Projected Payout</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        ₹{plan === "Pro" ? Math.round(depositTotal * 1.1) : depositTotal}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1.5 bg-zinc-900/20 p-2.5 rounded-xl border border-zinc-800">
                    <span className="text-zinc-400 font-semibold">Refundable Deposit</span>
                    <span className="font-black text-lg text-violet-400">₹{depositTotal}</span>
                  </div>
                </div>

                {/* Right Side: Simple Rules */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div className="p-4 md:p-5 rounded-2xl border border-emerald-500/10 bg-[#0C0C10] space-y-2.5 flex-1 flex flex-col justify-center">
                    <div>
                      <h4 className="font-bold text-emerald-400 text-xs flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        If You Maintain Consistency
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        <li className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Get your full <strong>₹{depositTotal}</strong> refundable deposit back.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          {plan === "Pro" ? (
                            <span>
                              Receive extra <strong className="text-emerald-400 font-bold">10% cash bonus (+₹{Math.round(depositTotal * 0.1)})</strong>. Total payout: <strong className="text-emerald-400 font-extrabold">₹{Math.round(depositTotal * 1.1)}</strong>!
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

                  <div className="p-4 md:p-5 rounded-2xl border border-amber-500/10 bg-[#0C0C10] space-y-2.5 flex-1 flex flex-col justify-center">
                    <div>
                      <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        If You Miss a Day
                      </h4>
                      <ul className="space-y-1.5 text-[11px] text-zinc-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span><strong>₹{amount}</strong> deducted from your deposit pool (only for missed days).</span>
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

              <div className="flex gap-4 pt-3 border-t border-zinc-800/40 mt-3">
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-zinc-800 hover:bg-[#16161F] rounded-xl font-semibold text-xs transition-all text-zinc-400 hover:text-white"
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
                    <h3 className="text-xl font-bold text-white animate-pulse">
                      {processingStep === 1 ? "Connecting to Bank..." : "Verifying Transaction..."}
                    </h3>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-mono font-bold">
                      {processingStep === 1 ? "ESTABLISHING SECURE CONNECTION" : "PROCESSING PAYMENT OF ₹" + (plan === "Pro" ? (amount ? amount * 30 : 0) + 49 : (amount ? amount * 30 : 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Secure Checkout</h3>
                    <p className="text-xs text-zinc-405 leading-relaxed">
                      Complete your payment securely. Your refundable deposit will be returned after 30 days of consistency.
                    </p>
                  </div>

                  {/* Sandbox Banner */}
                  <div className="p-3 bg-amber-500/5 border border-white/[0.04] rounded-xl flex items-start gap-2.5 text-amber-300/90 shadow-sm shadow-amber-500/2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-450" />
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Sandbox Mode Enabled — Production Gateway Pending
                      </h4>
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

                  <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-3 shadow-inner">
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
                        <span className="text-zinc-550 text-[9px]">Held securely for 30 days. Fully refundable.</span>
                      </div>
                      <span className="text-white font-semibold text-sm">₹{amount ? amount * 30 : 0}</span>
                    </div>

                    {plan === "Pro" ? (
                      <>
                        <div className="flex items-center justify-between pt-1 border-b border-white/[0.04] pb-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-violet-300 font-semibold">Pro Setup & Subscription</span>
                            <span className="text-violet-550/60 text-[9px]">1 month feature access</span>
                          </div>
                          <span className="text-violet-400 font-semibold">₹49</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-semibold">Projected Monthly Refund Payout</span>
                            <span className="text-zinc-550 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit + 10% Cash Streak Bonus</span>
                          </div>
                          <span className="text-emerald-400 font-semibold text-sm">₹{Math.round((amount ? amount * 30 : 0) * 1.1)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex flex-col">
                          <span className="text-emerald-400 font-semibold">Projected Monthly Refund Payout</span>
                          <span className="text-zinc-555 text-[9px]">Your ₹{amount ? amount * 30 : 0} deposit returned on consistency</span>
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
                      className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
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
                      className="w-full py-3 bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] disabled:opacity-50 text-zinc-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      Razorpay Checkout (UPI, Cards, Netbanking)
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBack}
                        disabled={loading}
                        className="w-full py-2 border border-white/[0.04] hover:bg-white/[0.02] text-zinc-500 hover:text-zinc-300 font-semibold rounded-xl text-[10px] transition-all flex justify-center items-center"
                      >
                        Back to Review
                      </button>
                    </div>

                    <div className="flex justify-center items-center gap-1.5 text-[9px] text-zinc-550 pt-1">
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
                <h1 className="text-3xl font-black text-white">Challenge Activated!</h1>
                <p className="text-zinc-400 text-sm">Your accountability framework is officially active.</p>
              </div>

              <div className="bg-[#0C0C10] border border-zinc-800 rounded-2xl p-6 text-left max-w-md mx-auto space-y-4 shadow-inner">
                <div className="flex items-start gap-3.5 text-sm">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Commitment Deposit Pool Active</h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">₹{depositTotal} is locked in. Solve problems daily to protect your balance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Daily Streak Tracking Enabled</h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Submit your DSA completion screenshot before midnight daily to build consistency.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Gemini AI Assistant Online</h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Automated DSA proof verification and personalized placement advisory are active.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    onComplete();
                    onClose();
                  }, 1200);
                }}
                disabled={loading}
                className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Activating Dashboard...
                  </span>
                ) : (
                  "Go to Dashboard"
                )}
              </button>

              <p className="text-[10px] italic text-zinc-500 pt-2">
                "Consistency is what transforms average programmers into exceptional engineers."
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
