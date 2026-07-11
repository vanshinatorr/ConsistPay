import React, { useState } from "react";
import { Wallet, Lock, Coins, Shield, TrendingDown, RefreshCw, Check, AlertTriangle, ArrowUpRight, HelpCircle, CheckCircle2, Clock } from "lucide-react";
// WithdrawModal rendered globally at Dashboard level
import { useNavigate } from "react-router-dom";

interface WalletCardProps {
  plan?: string;
  monthlyBudget: number;
  completedDays: number;
  missedDays: number;
  dailyCommitment: number;
  graceCoins: number;
  balance?: number;
  activeDeposit?: number;
  planStatus?: string;
  onboardingComplete?: boolean;
  onRefreshRequest?: () => void;
  planExpiresAt?: string | Date;
  // Sync integration props
  handleSync?: () => Promise<void>;
  syncLoading?: boolean;
  apiError?: string;
  setApiError?: (err: string) => void;
  todaySubmissionsCount?: number;
  timeLeft?: { h: number; m: number; s: number };
  linkedPlatforms?: Array<{ platform: string; username: string; isVerified: boolean }>;
  syncLogs?: string[];
}

export function WalletCard({
  plan,
  monthlyBudget,
  completedDays,
  missedDays,
  dailyCommitment,
  graceCoins,
  balance = 0,
  activeDeposit = 0,
  planStatus = "active",
  onboardingComplete = true,
  onRefreshRequest,
  planExpiresAt,
  handleSync,
  syncLoading = false,
  apiError = "",
  setApiError,
  todaySubmissionsCount = 0,
  timeLeft,
  linkedPlatforms = [],
  syncLogs = [],
}: WalletCardProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const navigate = useNavigate();

  const hasSolvedToday = todaySubmissionsCount > 0;
  const verifiedPlatforms = linkedPlatforms.filter((p) => p.isVerified);
  const hasVerifiedPlatform = verifiedPlatforms.length > 0;
  const isStakeAtRisk = onboardingComplete && hasVerifiedPlatform && !hasSolvedToday && (timeLeft ? (timeLeft.h === 0 && timeLeft.m < 30) : false);

  const getPlanRangeString = () => {
    if (!planExpiresAt) return "Not Started";
    const end = new Date(planExpiresAt);
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    const formatOption: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", formatOption)} - ${end.toLocaleDateString("en-US", formatOption)}`;
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl blur-2xl opacity-35 bg-gradient-to-br from-yellow-500/15 via-orange-500/10 to-transparent pointer-events-none" />

      <div className="relative bg-white dark:bg-gradient-to-b dark:from-[#141522]/95 dark:to-[#0F1018]/95 border border-zinc-200 dark:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between h-[522px] min-h-[522px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden hover:border-zinc-300 dark:hover:border-white/[0.18] transition-all duration-300">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-40 dark:opacity-100" />

        {/* ─── HEADER ─── */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.04] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shadow-inner">
              <Wallet className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-xs font-bold text-zinc-800 dark:text-white uppercase tracking-widest">
              Consistency Wallet
            </span>
          </div>

          <span
            className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider shadow-sm relative z-10 ${
              plan?.toLowerCase() === "pro"
                ? "text-violet-600 dark:text-violet-400 bg-violet-500/5 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20"
                : "text-zinc-650 dark:text-zinc-550 bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.06]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        {/* ─── 2-COLUMN MAIN CONTENT GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 mt-4 relative z-10 overflow-hidden">
          
          {/* ════ LEFT COLUMN: STAKES & CASH WALLET ════ */}
          <div className="flex flex-col justify-between h-full gap-3">
            
            {/* 1. Withdrawable Balance Card */}
            <div className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/[0.03] rounded-xl py-3 px-4 flex items-center justify-between hover:border-zinc-300 dark:hover:border-white/[0.06] transition-all duration-200 shadow-md">
              <div>
                <span className="text-[9.5px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest block">
                  Withdrawable Balance
                </span>
                <span className="text-3xl font-bold text-zinc-800 dark:text-white tracking-tight mt-1 block">
                  <span className="text-zinc-400 dark:text-zinc-500 text-2xl font-light mr-0.5">₹</span>
                  {onboardingComplete ? Math.round(balance) : "0"}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-450 block mt-1 leading-normal font-normal">
                  Funds secured from completed commitments.
                </span>
              </div>
              {onboardingComplete && balance > 0 ? (
                <button
                  onClick={() => {
                    const event = new CustomEvent("open-withdraw-modal", { detail: { walletType: "consistency" } });
                    window.dispatchEvent(event);
                  }}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  Withdraw
                </button>
              ) : (
                <span className="text-[9px] text-zinc-500 dark:text-zinc-550 font-bold bg-zinc-150 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/[0.03] px-2.5 py-1.5 rounded-md select-none shrink-0">
                  Empty Wallet
                </span>
              )}
            </div>

            {/* 2. Money At Stake Card */}
            <div className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/[0.03] rounded-xl py-3 px-4 flex-1 flex flex-col justify-center hover:border-zinc-300 dark:hover:border-white/[0.06] transition-all duration-200 shadow-md">
              <span className="text-[9.5px] text-zinc-550 dark:text-zinc-400 uppercase tracking-widest font-bold block">
                Money At Stake
              </span>
              <span className="text-2xl font-bold text-zinc-800 dark:text-white tracking-tight mt-1 block">
                <span className="text-zinc-400 dark:text-zinc-500 text-xl font-light mr-0.5">₹</span>
                {onboardingComplete ? Math.round(activeDeposit) : "0"}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-450 block mt-1 leading-normal font-normal">
                Missed days forfeit ₹{dailyCommitment} from this pool.
              </span>
            </div>

            {/* 3. Month-end Payout Preview Card (Gold theme) */}
            <div className="bg-amber-500/[0.03] dark:bg-amber-500/[0.01] border border-amber-200 dark:border-amber-500/10 rounded-xl py-3 px-4 flex-1 flex flex-col justify-center hover:border-amber-400 dark:hover:border-amber-500/20 transition-all duration-200 shadow-md">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400/90">
                <Coins className="w-4 h-4" />
                <span className="text-[9.5px] font-bold uppercase tracking-widest block">
                  Month-end Payout Preview
                </span>
              </div>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-1 block">
                <span className="text-amber-600/60 dark:text-amber-600/60 text-xl font-light mr-0.5">₹</span>
                {completedDays * dailyCommitment}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-450 block mt-1 leading-normal font-normal">
                {Math.max(30 - (completedDays + missedDays), 0)} days left — keep submitting!
              </span>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: VERIFICATION HUB & STREAKS ════ */}
          <div className="flex flex-col justify-between h-full gap-3">
            
            {/* Daily Safety Alert Banner */}
            <div className={`border rounded-xl py-2.5 px-3.5 text-left flex flex-col items-start justify-center transition-all duration-300 ${
              hasSolvedToday
                ? "bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border-emerald-200 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : isStakeAtRisk
                ? "bg-red-500/[0.03] dark:bg-red-500/[0.02] border-red-200 dark:border-red-500/15 text-red-500 dark:text-red-400 animate-pulse"
                : hasVerifiedPlatform
                ? "bg-zinc-50 dark:bg-white/[0.005] border-zinc-200 dark:border-white/[0.03] text-zinc-700 dark:text-zinc-400"
                : "bg-zinc-50 dark:bg-white/[0.005] border-zinc-200 dark:border-white/[0.03] text-zinc-700 dark:text-zinc-550"
            }`}>
              <div className="flex items-center gap-2">
                {hasSolvedToday ? (
                  <>
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Streak Protected!</span>
                  </>
                ) : isStakeAtRisk ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-red-500 animate-bounce" />
                    <span className="text-xs font-bold tracking-wider text-red-500 dark:text-red-400">Action Required: Stake At Risk!</span>
                  </>
                ) : hasVerifiedPlatform ? (
                  <>
                    <Clock className="w-4 h-4 text-zinc-550" />
                    <span className="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-400">Daily Solve Pending</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4.5 h-4.5 text-zinc-500" />
                    <span className="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-400">No Profile Connected</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-zinc-550 dark:text-zinc-450 mt-0.5 leading-snug">
                {hasSolvedToday 
                  ? "Daily solution verified on LeetCode/GFG. Locked stake is secure."
                  : isStakeAtRisk
                  ? "Less than 30 minutes remaining! Submit a solution now to prevent stake loss."
                  : hasVerifiedPlatform
                  ? "Solve 1 daily problem on linked profiles, then hit sync to secure."
                  : "Link your profiles in the left console to enable daily verification."
                }
              </p>

              {/* Inner Action Section */}
              <div className="w-full mt-2 pt-2 border-t border-zinc-150 dark:border-white/[0.04] flex items-center justify-between gap-3">
                {/* Streak Timer Status */}
                {!hasSolvedToday && hasVerifiedPlatform && timeLeft ? (
                  <div className="flex items-center gap-1 font-mono text-zinc-800 dark:text-zinc-150 shrink-0 select-none">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 mr-1.5 tracking-wider">Time:</span>
                    <div className={`px-2 py-1 rounded bg-zinc-100 dark:bg-[#0A0B10]/80 border border-zinc-200 dark:border-white/[0.04] text-[11px] font-bold shadow-inner ${isStakeAtRisk ? "text-red-500 border-red-200 dark:border-red-500/20" : "text-zinc-700 dark:text-zinc-200"}`}>
                      {String(timeLeft.h).padStart(2, "0")}h
                    </div>
                    <span className="text-zinc-400 dark:text-zinc-700 text-xs font-bold">:</span>
                    <div className={`px-2 py-1 rounded bg-zinc-100 dark:bg-[#0A0B10]/80 border border-zinc-200 dark:border-white/[0.04] text-[11px] font-bold shadow-inner ${isStakeAtRisk ? "text-red-500 border-red-200 dark:border-red-500/20" : "text-zinc-700 dark:text-zinc-200"}`}>
                      {String(timeLeft.m).padStart(2, "0")}m
                    </div>
                  </div>
                ) : hasSolvedToday ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-455 select-none bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-250 dark:border-emerald-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stake Secured</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-550 select-none">Setup Pending</span>
                )}

                {/* Sync Solves Button */}
                {handleSync && (
                  <div className="shrink-0 flex-1 flex justify-end">
                    {hasVerifiedPlatform ? (
                      <button
                        type="button"
                        onClick={handleSync}
                        disabled={syncLoading || hasSolvedToday}
                        className={`h-8 px-3.5 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                          hasSolvedToday
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 cursor-default"
                            : syncLoading
                            ? "bg-zinc-100 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.04] text-zinc-500 dark:text-zinc-555 cursor-not-allowed"
                            : "bg-violet-50 hover:bg-violet-100 text-violet-750 border-violet-200 dark:bg-white dark:text-zinc-950 dark:border-white dark:hover:bg-zinc-200 active:scale-95 shadow-sm hover:scale-[1.01]"
                        }`}
                      >
                        {hasSolvedToday ? (
                          <>Synced</>
                        ) : (
                          <>
                            <RefreshCw className={`w-3 h-3 ${syncLoading ? "animate-spin text-zinc-550" : "text-violet-700 dark:text-zinc-950"}`} />
                            {syncLoading ? "Verifying..." : "Sync Solves"}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/settings?tab=platforms")}
                        className="h-8 px-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        Link Profile
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Error Outputs inside banner */}
              {apiError && (
                <div className="w-full mt-2 pt-2 border-t border-zinc-150 dark:border-white/[0.03] text-left">
                  <p className="text-[9.5px] text-red-400 font-medium leading-normal flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{apiError}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Secured & Lost Side-by-Side Cards (Green & Red Theme) */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {/* Secured Box */}
              <div className="bg-zinc-50 dark:bg-black/25 border border-zinc-200 dark:border-white/[0.04] rounded-xl py-3 px-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                    Secured
                  </span>
                </div>
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                  +₹{completedDays * dailyCommitment}
                </span>
                <span className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {completedDays} day{completedDays !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Lost Box */}
              <div className="bg-zinc-50 dark:bg-black/25 border border-zinc-200 dark:border-white/[0.04] rounded-xl py-3 px-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-450" />
                  <span className="text-[9.5px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider block">
                    Lost
                  </span>
                </div>
                <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-455 mt-2">
                  -₹{missedDays * dailyCommitment}
                </span>
                <span className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {missedDays} day{missedDays !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Bottom Section: Grace Coins & Active Plan Details Card */}
            <div className="flex flex-col gap-2.5">
              {/* Grace Coins Row */}
              <div className="flex items-center justify-between text-xs px-0.5 py-1.5 border-t border-zinc-150 dark:border-white/[0.04]">
                <div>
                  <span className="text-[9.5px] text-zinc-500 dark:text-zinc-455 font-bold uppercase tracking-wider block">
                    Grace Coins
                  </span>
                  <span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 block mt-0.5 font-normal">
                    {plan?.toLowerCase() === "pro" ? "+1 on 15-day streak" : "1 coin included"}
                  </span>
                </div>
                <div className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {onboardingComplete ? Math.max(graceCoins, 0) : 0} Active
                </div>
              </div>

              {/* Active Plan Details Card */}
              <div className="bg-zinc-50 dark:bg-black/25 border border-zinc-200 dark:border-white/[0.04] rounded-xl py-2.5 px-3.5 hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-1.5 pb-1.5 border-b border-zinc-150 dark:border-white/[0.04] mb-2.5">
                  <HelpCircle className="w-3.5 h-3.5 text-violet-650 dark:text-violet-400" />
                  <span className="text-[9.5px] text-zinc-555 dark:text-zinc-400 font-bold uppercase tracking-wider block">
                    Active Plan Details
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500 font-semibold text-[9.5px] uppercase tracking-wider">Daily Payout</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">₹{dailyCommitment} / day</span>
                  </div>
                  <div className="h-px bg-zinc-200/50 dark:bg-white/[0.03]" />
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-455 dark:text-zinc-500 font-semibold text-[9.5px] uppercase tracking-wider">Total Cycle Stakes</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">₹{monthlyBudget} / cycle</span>
                  </div>
                  <div className="h-px bg-zinc-200/50 dark:bg-white/[0.03]" />
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-455 dark:text-zinc-500 font-semibold text-[9.5px] uppercase tracking-wider">Active Range</span>
                    <span className="font-bold text-zinc-705 dark:text-zinc-300">
                      30 Days ({onboardingComplete ? getPlanRangeString() : "Not Active"})
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* WithdrawModal rendered globally at Dashboard level */}
    </div>
  );
}