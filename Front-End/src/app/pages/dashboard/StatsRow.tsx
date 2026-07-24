import React from "react";
import { TrendingUp, Flame, CheckCircle2 } from "lucide-react";

interface StatsRowProps {
  currentStreak: number;
  completedDays: number;
  consistencyScore: number;
  onboardingComplete?: boolean;
  activeDeposit?: number;
  balance?: number;
}

export function StatsRow({
  currentStreak,
  completedDays,
  consistencyScore,
  onboardingComplete = true,
  activeDeposit = 0,
  balance = 0,
}: StatsRowProps) {
  return (
    <>
      {/* Desktop View: Original 3 boxes layout */}
      <div className="hidden lg:grid grid-cols-3 gap-4 h-full">
        {/* Current Streak */}
        <div className="relative group h-full">
          {/* Glow backdrop */}
          <div className="absolute -inset-px bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          
          {/* Card */}
          <div className="relative h-full bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.03] rounded-2xl p-5 transition-all duration-300 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-zinc-300 dark:hover:border-white/[0.07]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Current Streak
              </span>
              <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
                <Flame className="w-4 h-4 fill-orange-500/20" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center my-3">
              <div className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
                {onboardingComplete ? currentStreak : "-"}
              </div>
              <p className="text-xs text-zinc-555 dark:text-zinc-500 mt-2">
                Active for {currentStreak} day{currentStreak !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="relative group h-full">
          {/* Glow backdrop */}
          <div className="absolute -inset-px bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          
          {/* Card */}
          <div className="relative h-full bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.03] rounded-2xl p-5 transition-all duration-300 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-zinc-300 dark:hover:border-white/[0.07]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Problems Solved
              </span>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center my-3">
              <div className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
                {onboardingComplete ? completedDays : "-"}
              </div>
              <p className="text-xs text-zinc-555 dark:text-zinc-500 mt-2">
                Lifetime verified solutions
              </p>
            </div>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="relative group h-full">
          {/* Glow backdrop */}
          <div className="absolute -inset-px bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          
          {/* Card */}
          <div className="relative h-full bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.03] rounded-2xl p-5 transition-all duration-300 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-zinc-300 dark:hover:border-white/[0.07]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Consistency Score
              </span>
              <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center my-3">
              <div className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
                {onboardingComplete ? `${consistencyScore}%` : "-"}
              </div>
              <p className="text-xs text-zinc-550 dark:text-zinc-500 mt-2">
                Based on verified activity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View: Consolidated 4-column ribbon */}
      <div className="block lg:hidden bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-4 divide-x divide-zinc-200 dark:divide-white/[0.06]">
          
          {/* Streak */}
          <div className="text-center flex flex-col justify-center px-1">
            <span className="block text-[8px] md:text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
              Streak
            </span>
            <div className="text-sm md:text-xl font-black text-orange-500 dark:text-orange-400 mt-1 md:mt-1.5 tracking-tight leading-none">
              {onboardingComplete ? `🔥 ${currentStreak}d` : "-"}
            </div>
            <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-550 dark:text-zinc-500 mt-1">
              Active days
            </span>
          </div>

          {/* Locked Deposit */}
          <div className="text-center flex flex-col justify-center px-1">
            <span className="block text-[8px] md:text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
              Locked
            </span>
            <div className="text-sm md:text-xl font-black text-zinc-800 dark:text-white mt-1 md:mt-1.5 tracking-tight leading-none">
              {onboardingComplete ? `₹${Math.round(activeDeposit)}` : "-"}
            </div>
            <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-555 dark:text-zinc-500 mt-1">
              Commitment pool
            </span>
          </div>

          {/* Wallet Balance */}
          <div className="text-center flex flex-col justify-center px-1">
            <span className="block text-[8px] md:text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
              Wallet
            </span>
            <div className="text-sm md:text-xl font-black text-emerald-500 dark:text-emerald-400 mt-1 md:mt-1.5 tracking-tight leading-none">
              {onboardingComplete ? `₹${Math.round(balance)}` : "-"}
            </div>
            <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-555 dark:text-zinc-500 mt-1">
              Withdrawable funds
            </span>
          </div>

          {/* Consistency Score */}
          <div className="text-center flex flex-col justify-center px-1">
            <span className="block text-[8px] md:text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
              Consistency
            </span>
            <div className="text-sm md:text-xl font-black text-violet-500 dark:text-violet-400 mt-1 md:mt-1.5 tracking-tight leading-none">
              {onboardingComplete ? `${consistencyScore}%` : "-"}
            </div>
            <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-555 dark:text-zinc-500 mt-1">
              Activity rate
            </span>
          </div>

        </div>
      </div>
    </>
  );
}