import React from "react";

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
    <div className="bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-4 md:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-4 divide-x divide-zinc-200 dark:divide-white/[0.06]">
        
        {/* Streak */}
        <div className="text-center flex flex-col justify-center px-1">
          <span className="block text-[8px] md:text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
            Streak
          </span>
          <div className="text-sm md:text-xl font-black text-orange-500 dark:text-orange-400 mt-1 md:mt-1.5 tracking-tight leading-none">
            {onboardingComplete ? `🔥 ${currentStreak}d` : "-"}
          </div>
          <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-500 mt-1">
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
          <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-500 mt-1">
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
          <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-500 mt-1">
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
          <span className="hidden sm:block text-[9px] md:text-[10px] text-zinc-550 dark:text-zinc-500 mt-1">
            Activity rate
          </span>
        </div>

      </div>
    </div>
  );
}