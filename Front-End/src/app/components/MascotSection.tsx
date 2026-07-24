import React, { useState } from "react";
import { X, Check, Calculator, ShieldCheck, TrendingUp } from "lucide-react";

export function MascotSection() {
  const STAKE_VALUES = [5, 10, 15, 20, 50];
  const [stakeIndex, setStakeIndex] = useState(3); // Defaults to ₹20 (index 3)
  const dailyStake = STAKE_VALUES[stakeIndex];
  const [streakDays, setStreakDays] = useState(30);

  const principal = dailyStake * streakDays;
  const estYield = Math.floor(principal * 0.10); // Exactly 10% average slacker pool yield
  const totalReturn = principal + estYield;

  const comparisons = [
    {
      typical: "Easy to bypass (no actual code verification checks)",
      consistpay: "100% automated API verification via LeetCode & GFG",
    },
    {
      typical: "Zero consequences for slacking and breaking streaks",
      consistpay: "Refundable commitment stakes make consistency mandatory",
    },
    {
      typical: "Boring virtual badge rewards and vanity metrics",
      consistpay: "Retrieve your stake plus earn yield from lazy peers",
    },
  ];

  return (
    <section className="px-6 py-12 md:py-24 relative overflow-hidden bg-white dark:bg-[#090A0E] w-full border-b border-zinc-200 dark:border-white/[0.04]">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.2fr] gap-16 items-start">
          
          {/* Left Column: Mascot + Interactive Estimator */}
          <div className="flex flex-col items-center justify-center select-none w-full lg:sticky lg:top-24">
            
            {/* Mascot Visual */}
            <div className="relative flex flex-col items-center justify-center mb-8">
              <img 
                src="/logo/mascot-full.png" 
                alt="ConsistPay Accountability Partner - Consisty" 
                className="w-60 sm:w-64 md:w-[18rem] h-auto object-contain relative z-10 transition-all duration-500 hover:scale-[1.03] hover:rotate-1"
              />
              {/* 3D Floor Shadow */}
              <div className="w-40 sm:w-48 h-3.5 bg-zinc-200 dark:bg-white/5 rounded-[100%] blur-[12px] mt-2 opacity-50 relative z-0" />
            </div>

            {/* Interactive Stake & Yield Calculator Widget */}
            <div className="w-full max-w-sm bg-white dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm dark:shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-150 dark:border-white/[0.04] pb-4">
                <Calculator className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <h4 className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                  Yield & Stake Estimator
                </h4>
              </div>

              {/* Slider 1: Daily Stake */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Daily Commitment Stake</span>
                  <span className="font-bold text-zinc-800 dark:text-white text-sm">₹{dailyStake} / day</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  step="1"
                  value={stakeIndex} 
                  onChange={(e) => setStakeIndex(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-white"
                />
              </div>

              {/* Slider 2: Streak Target */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Streak Target Goal</span>
                  <span className="font-bold text-zinc-800 dark:text-white text-sm">{streakDays} Days</span>
                </div>
                <input 
                  type="range" 
                  min="7" 
                  max="30" 
                  step="1"
                  value={streakDays} 
                  onChange={(e) => setStreakDays(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-white"
                />
              </div>

              {/* Output Metrics Panel */}
              <div className="bg-zinc-50 dark:bg-[#090A0E] border border-zinc-200 dark:border-zinc-850 rounded-xl p-4 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-500 font-medium">Refundable Deposit</span>
                  <span className="font-semibold text-zinc-800 dark:text-white">₹{principal}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-505 font-medium flex items-center gap-1">
                    Est. Slacker Dividend <TrendingUp className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-450">+₹{estYield}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-3.5 border-t border-zinc-200 dark:border-white/[0.04]">
                  <span className="text-zinc-650 dark:text-zinc-300 font-bold">Total Return Payout</span>
                  <span className="font-bold text-zinc-800 dark:text-white">₹{totalReturn}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Comparative Proof Blocks */}
          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-zinc-105 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] mb-4 inline-block font-mono">
                Systems Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight mb-4 leading-tight">
                Designed for Real Discipline
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-455 leading-relaxed max-w-lg font-normal mb-8">
                Most platforms fail because self-reporting is easy to skip. We connect directly to your public profiles to verify every solve.
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Box 1: Typical Trackers */}
              <div className="bg-zinc-100/40 dark:bg-[#000000]/40 border border-zinc-205 dark:border-white/[0.03] rounded-2xl p-6 flex flex-col">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-555 uppercase tracking-wider mb-6">
                  Typical Habit Apps
                </h4>
                <div className="space-y-4 flex-1">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-450 text-xs leading-relaxed font-normal">
                        {item.typical}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: ConsistPay (Highlighted offset card) */}
              <div className="bg-white dark:bg-[#0D0E12] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-6 shadow-md dark:shadow-xl relative overflow-hidden flex flex-col sm:translate-y-[-8px] transition-colors">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-6 relative z-10">
                  ConsistPay
                </h4>
                <div className="space-y-4 flex-1 relative z-10">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-455" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-800 dark:text-zinc-200 text-xs leading-relaxed font-semibold">
                        {item.consistpay}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
