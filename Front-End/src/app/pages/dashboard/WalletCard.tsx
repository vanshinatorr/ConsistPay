import React, { useState } from "react";
import { Wallet, Lock, Coins, Shield, TrendingDown, RefreshCw, Check, AlertTriangle, ArrowUpRight, HelpCircle } from "lucide-react";
import { WithdrawModal } from "../../components/WithdrawModal";

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

  const hasSolvedToday = todaySubmissionsCount > 0;
  const verifiedPlatforms = linkedPlatforms.filter((p) => p.isVerified);
  const hasVerifiedPlatform = verifiedPlatforms.length > 0;
  const isStakeAtRisk = onboardingComplete && hasVerifiedPlatform && !hasSolvedToday && (timeLeft?.h || 0) < 2;

  // Render shields representing grace coin "lives"
  const renderShields = () => {
    const totalShields = 3;
    const activeCount = onboardingComplete ? Math.min(Math.max(graceCoins, 0), 3) : 0;
    
    return (
      <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] px-2.5 py-1 rounded-xl">
        {[...Array(totalShields)].map((_, i) => {
          const isActive = i < activeCount;
          return (
            <Shield
              key={i}
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                isActive
                  ? "text-amber-400 fill-amber-400/20 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                  : "text-zinc-800 fill-transparent"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between h-[522px] min-h-[522px] shadow-2xl overflow-hidden hover:border-white/[0.08] transition-all duration-300">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* ─── HEADER ─── */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.04] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shadow-inner">
              <Wallet className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Consistency Ledger
            </span>
          </div>

          <span
            className={`text-[9px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider shadow-sm ${
              plan?.toLowerCase() === "pro"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-zinc-500 bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        {/* ─── 2-COLUMN MAIN CONTENT GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-4 relative z-10">
          
          {/* ════ LEFT COLUMN: STAKES & CASH WALLET ════ */}
          <div className="flex flex-col justify-between h-full">
            
            {/* 1. Withdrawable Cash Balance */}
            <div className="bg-[#121216] border border-white/[0.04] rounded-xl p-4 flex items-center justify-between hover:border-white/[0.08] transition-all">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                  Withdrawable Cash
                </span>
                <span className="text-3xl font-black font-mono text-white mt-1 block">
                  <span className="text-zinc-650 text-xl font-normal mr-0.5">₹</span>
                  {onboardingComplete ? Math.round(balance) : "0"}
                </span>
              </div>
              {onboardingComplete && balance > 0 ? (
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-black text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95 cursor-pointer"
                >
                  Withdraw
                </button>
              ) : (
                <div className="text-[10px] text-zinc-600 font-bold bg-white/[0.01] border border-white/[0.04] px-3 py-1.5 rounded-lg select-none">
                  Empty Wallet
                </div>
              )}
            </div>

            {/* 2. Unified Stakes & Payouts Ledger */}
            <div className="bg-[#121216] border border-white/[0.04] rounded-xl p-4 flex-1 my-3.5 flex flex-col justify-between hover:border-white/[0.08] transition-all">
              <div className="text-[10px] text-zinc-400 uppercase font-black tracking-wider pb-2.5 border-b border-white/[0.03] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-yellow-500" /> Stakes Pool Details
              </div>

              {/* Stats Rows */}
              <div className="space-y-3.5 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-bold">Total Stakes Principal:</span>
                  <span className="text-sm font-bold font-mono text-zinc-200">
                    <span className="text-zinc-600 mr-0.5">₹</span>
                    {onboardingComplete ? Math.round(activeDeposit) : "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-bold">Daily Commitment Rate:</span>
                  <span className="text-sm font-bold font-mono text-zinc-200">
                    <span className="text-zinc-600 mr-0.5">₹</span>
                    {dailyCommitment} / day
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-bold">Month-end Payout Est.:</span>
                  <span className="text-sm font-black font-mono text-yellow-500">
                    <span className="text-yellow-600/60 mr-0.5">₹</span>
                    {completedDays * dailyCommitment}
                  </span>
                </div>
              </div>

              {/* Status note */}
              <div className="mt-3.5 pt-2.5 border-t border-white/[0.03] text-[9.5px] text-zinc-500 leading-normal font-sans">
                {planStatus === "active" ? (
                  <span>Stakes active. You are earning ₹{dailyCommitment} daily for streaks.</span>
                ) : (
                  <span className="text-red-400 font-bold">Stakes expired. Renew to resume streak earning.</span>
                )}
              </div>
            </div>

            {/* 3. Streak Shields (Grace Coins Indicator) */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-500 font-bold uppercase tracking-wider">
                Backup Shields
              </span>
              <div className="flex items-center gap-2">
                {renderShields()}
                <span className="font-bold font-mono text-zinc-400 text-xs">
                  {onboardingComplete ? graceCoins : "0"}/3 active
                </span>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: VERIFICATION HUB & STREAKS ════ */}
          <div className="flex flex-col justify-between h-full">
            
            {/* 1. Daily Safety Alert Banner */}
            <div className={`border rounded-xl p-3.5 text-center flex flex-col items-center justify-center transition-all duration-300 ${
              hasSolvedToday
                ? "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-450"
                : isStakeAtRisk
                ? "bg-red-500/[0.03] border-red-500/30 text-red-400 animate-pulse"
                : hasVerifiedPlatform
                ? "bg-yellow-500/[0.02] border-yellow-500/20 text-yellow-450"
                : "bg-white/[0.01] border-white/[0.04] text-zinc-500"
            }`}>
              <div className="flex items-center gap-2">
                {hasSolvedToday ? (
                  <>
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-xs font-extrabold tracking-wide">Streak Protected for Today!</span>
                  </>
                ) : isStakeAtRisk ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-red-500 animate-bounce" />
                    <span className="text-xs font-extrabold tracking-wide">Action Required: Stake At Risk!</span>
                  </>
                ) : hasVerifiedPlatform ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                    <span className="text-xs font-extrabold tracking-wide">Awaiting Daily Coding Sync</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4.5 h-4.5 text-zinc-500" />
                    <span className="text-xs font-bold tracking-wide">No Verification Profile Linked</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                {hasSolvedToday 
                  ? "Daily solution verified on LeetCode/GFG. Locked stake is secure."
                  : isStakeAtRisk
                  ? "Less than 2 hours remaining! Submit a solution now to prevent stake loss."
                  : hasVerifiedPlatform
                  ? "Solve 1 daily problem on linked profiles, then hit sync to secure."
                  : "Link your profiles in the left console to enable daily verification."
                }
              </p>
            </div>

            {/* 2. Accountability Console (Timer & Sync Control) */}
            <div className="bg-[#121216] border border-white/[0.04] rounded-xl p-4 flex flex-col gap-3.5 my-3.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <span>Streak Timer</span>
                <span>Verification trigger</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                {/* Timer Clock */}
                {timeLeft ? (
                  <div className="flex items-center gap-1.5 font-mono text-zinc-100 shrink-0">
                    <div className={`px-2.5 py-1.5 rounded bg-[#0A0B10] border border-white/[0.06] text-sm font-bold shadow-inner ${isStakeAtRisk ? "text-red-400 border-red-500/20" : "text-zinc-200"}`}>
                      {String(timeLeft.h).padStart(2, "0")}h
                    </div>
                    <span className="text-zinc-700 text-sm font-bold">:</span>
                    <div className={`px-2.5 py-1.5 rounded bg-[#0A0B10] border border-white/[0.06] text-sm font-bold shadow-inner ${isStakeAtRisk ? "text-red-400" : "text-zinc-200"}`}>
                      {String(timeLeft.m).padStart(2, "0")}m
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-650">--:--</span>
                )}

                {/* Sync Solves Button */}
                {handleSync && (
                  <div className="shrink-0 flex-1 flex justify-end">
                    {hasVerifiedPlatform ? (
                      <button
                        type="button"
                        onClick={handleSync}
                        disabled={syncLoading || hasSolvedToday}
                        className={`h-9.5 px-4.5 rounded-xl font-black text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                          hasSolvedToday
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450 cursor-default"
                            : syncLoading
                            ? "bg-white/[0.02] border-white/[0.04] text-zinc-600 cursor-not-allowed"
                            : "bg-white text-black hover:bg-zinc-200 border-white active:scale-95 shadow-md shadow-white/5 hover:scale-[1.01]"
                        }`}
                      >
                        {hasSolvedToday ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-450" />
                            Synced & Protected
                          </>
                        ) : (
                          <>
                            <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin text-zinc-550" : "text-emerald-500"}`} />
                            {syncLoading ? "Verifying..." : "Sync Solves"}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="h-9.5 px-3.5 bg-white/[0.02] border border-white/[0.04] text-zinc-500 rounded-xl font-bold text-[10px] flex items-center justify-center select-none cursor-not-allowed">
                        Link Profile first
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Console log outputs */}
              {syncLogs && syncLogs.length > 0 && (
                <div className="border-t border-white/[0.04] pt-2 mt-0.5 font-mono text-[8px] text-zinc-550 leading-relaxed max-h-[35px] overflow-y-auto custom-scrollbar">
                  {syncLogs.slice(-2).map((log, idx) => {
                    let textClass = "text-zinc-500";
                    if (log.includes("✅") || log.includes("Secured")) textClass = "text-emerald-500 font-bold";
                    if (log.includes("❌")) textClass = "text-red-400 font-bold";
                    return (
                      <div key={idx} className={`${textClass} truncate`}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              )}

              {apiError && (
                <p className="text-[10px] text-red-400 font-medium leading-normal font-sans flex items-start gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </p>
              )}
            </div>

            {/* 3. Performance Metrics breakdown */}
            <div className="flex flex-col gap-2 mt-auto">
              {/* Progress Slider */}
              <div className="bg-[#121216] border border-white/[0.03] rounded-xl p-3.5 hover:border-white/[0.08] transition-all">
                <div className="flex justify-between text-[10px] text-zinc-550 mb-2 font-bold uppercase tracking-wider">
                  <span>30-Day Plan Target</span>
                  <span>{completedDays + missedDays} / 30 Days</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-550"
                    style={{
                      width: `${((completedDays + missedDays) / 30) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Completed vs Missed labels */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <div className="flex items-center justify-between bg-emerald-500/[0.02] border border-emerald-500/10 px-3 py-1.5 rounded-lg">
                  <span>Secured:</span>
                  <span className="text-emerald-450 font-mono font-bold">₹{completedDays * dailyCommitment} ({completedDays}d)</span>
                </div>
                <div className="flex items-center justify-between bg-red-500/[0.02] border border-red-500/10 px-3 py-1.5 rounded-lg">
                  <span>Lost:</span>
                  <span className="text-red-400 font-mono font-bold">₹{missedDays * dailyCommitment} ({missedDays}d)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          availableBalance={balance}
          walletType="consistency"
          onSuccess={onRefreshRequest}
        />
      )}
    </div>
  );
}