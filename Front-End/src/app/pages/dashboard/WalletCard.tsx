import React, { useState } from "react";
import { Wallet, Lock, Coins, Shield, TrendingDown, RefreshCw, Check, AlertTriangle, ArrowUpRight, HelpCircle, CheckCircle2 } from "lucide-react";
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
  const navigate = useNavigate();

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
      <div className="absolute inset-0 rounded-2xl blur-2xl opacity-35 bg-gradient-to-br from-yellow-500/15 via-orange-500/10 to-transparent pointer-events-none" />

      <div className="relative bg-gradient-to-b from-[#141522]/95 to-[#0F1018]/95 border border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between h-[522px] min-h-[522px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden hover:border-white/[0.18] transition-all duration-300">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* ─── HEADER ─── */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.04] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shadow-inner">
              <Wallet className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              Consistency Wallet
            </span>
          </div>

          <span
            className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider shadow-sm ${
              plan?.toLowerCase() === "pro"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-zinc-550 bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>
            {/* ─── 2-COLUMN MAIN CONTENT GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-4 relative z-10 overflow-hidden">
          
          {/* ════ LEFT COLUMN: STAKES & CASH WALLET ════ */}
          <div className="flex flex-col justify-between h-full">
            
            {/* 1. Withdrawable Balance Card */}
            <div className="bg-black/30 border border-white/[0.03] rounded-xl p-4 flex items-center justify-between hover:border-white/[0.06] transition-all duration-200 shadow-md">
              <div>
                <span className="text-[9px] text-emerald-455 font-bold uppercase tracking-widest block">
                  Withdrawable Balance
                </span>
                <span className="text-3xl font-bold text-white tracking-tight mt-1.5 block">
                  <span className="text-zinc-500 text-2xl font-light mr-0.5">₹</span>
                  {onboardingComplete ? Math.round(balance) : "0"}
                </span>
                <span className="text-[11px] text-zinc-450 block mt-1 leading-normal">
                  Funds secured from completed commitments.
                </span>
              </div>
              {onboardingComplete && balance > 0 ? (
                <button
                  onClick={() => {
                    const event = new CustomEvent("open-withdraw-modal", { detail: { walletType: "consistency" } });
                    window.dispatchEvent(event);
                  }}
                  className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-all active:scale-95 shadow-md shadow-white/5 cursor-pointer"
                >
                  Withdraw
                </button>
              ) : (
                <span className="text-[9px] text-zinc-550 font-bold bg-white/[0.01] border border-white/[0.03] px-2.5 py-1.5 rounded-md select-none">
                  Empty Wallet
                </span>
              )}
            </div>

            {/* 2. Active Deposit Pool (Locked) Card */}
            <div className="bg-black/30 border border-white/[0.03] rounded-xl p-4 mt-2.5 flex-1 flex flex-col justify-center hover:border-white/[0.06] transition-all duration-200 shadow-md">
              <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block">
                Active Deposit Pool (Locked)
              </span>
              <span className="text-2xl font-bold text-white tracking-tight mt-1.5 block">
                <span className="text-zinc-500 text-xl font-light mr-0.5">₹</span>
                {onboardingComplete ? Math.round(activeDeposit) : "0"}
              </span>
              <span className="text-[11px] text-zinc-450 block mt-1">
                ₹{dailyCommitment}/day commitment • 30-day plan
              </span>
            </div>

            {/* 3. Month-end Payout Preview Card (Gold theme) */}
            <div className="bg-amber-500/[0.01] border border-amber-500/10 rounded-xl p-4 mt-2.5 flex-1 flex flex-col justify-center hover:border-amber-500/20 transition-all duration-200 shadow-md">
              <div className="flex items-center gap-1.5 text-amber-400/90">
                <Coins className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest block">
                  Month-end Payout Preview
                </span>
              </div>
              <span className="text-2xl font-bold text-amber-400 tracking-tight mt-1.5 block">
                <span className="text-amber-600/60 text-xl font-light mr-0.5">₹</span>
                {completedDays * dailyCommitment}
              </span>
              <span className="text-[11px] text-zinc-450 block mt-1">
                {Math.max(30 - (completedDays + missedDays), 0)} days left — keep submitting!
              </span>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: VERIFICATION HUB & STREAKS ════ */}
          <div className="flex flex-col justify-between h-full">
            
            {/* Daily Safety Alert Banner */}
            <div className={`border rounded-xl p-3 text-left flex flex-col items-start justify-center transition-all duration-300 ${
              hasSolvedToday
                ? "bg-emerald-500/[0.01] border-emerald-500/10 text-emerald-400"
                : isStakeAtRisk
                ? "bg-red-500/[0.02] border-red-500/15 text-red-400 animate-pulse"
                : hasVerifiedPlatform
                ? "bg-yellow-500/[0.01] border-yellow-500/10 text-yellow-405"
                : "bg-white/[0.005] border-white/[0.03] text-zinc-500"
            }`}>
              <div className="flex items-center gap-2">
                {hasSolvedToday ? (
                  <>
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-emerald-400">Streak Protected for Today!</span>
                  </>
                ) : isStakeAtRisk ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-red-505 animate-bounce" />
                    <span className="text-xs font-bold tracking-wider text-red-400">Action Required: Stake At Risk!</span>
                  </>
                ) : hasVerifiedPlatform ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                    <span className="text-xs font-bold tracking-wider text-yellow-450">Awaiting Daily Coding Sync</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4.5 h-4.5 text-zinc-500" />
                    <span className="text-xs font-bold tracking-wider text-zinc-400">No Profile Connected</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-zinc-450 mt-1 leading-relaxed">
                {hasSolvedToday 
                  ? "Daily solution verified on LeetCode/GFG. Locked stake is secure."
                  : isStakeAtRisk
                  ? "Less than 2 hours remaining! Submit a solution now to prevent stake loss."
                  : hasVerifiedPlatform
                  ? "Solve 1 daily problem on linked profiles, then hit sync to secure."
                  : "Link your profiles in the left console to enable daily verification."
                }
              </p>

              {/* Inner Action Section */}
              <div className="w-full mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between gap-3">
                {/* Streak Timer Status */}
                {!hasSolvedToday && hasVerifiedPlatform && timeLeft ? (
                  <div className="flex items-center gap-1 font-mono text-zinc-150 shrink-0 select-none">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 mr-1.5 tracking-wider">Time:</span>
                    <div className={`px-2 py-1 rounded bg-[#0A0B10]/80 border border-white/[0.04] text-[11.5px] font-bold shadow-inner ${isStakeAtRisk ? "text-red-400 border-red-500/20" : "text-zinc-200"}`}>
                      {String(timeLeft.h).padStart(2, "0")}h
                    </div>
                    <span className="text-zinc-700 text-xs font-bold">:</span>
                    <div className={`px-2 py-1 rounded bg-[#0A0B10]/80 border border-white/[0.04] text-[11.5px] font-bold shadow-inner ${isStakeAtRisk ? "text-red-400" : "text-zinc-200"}`}>
                      {String(timeLeft.m).padStart(2, "0")}m
                    </div>
                  </div>
                ) : hasSolvedToday ? (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-450 select-none bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stake Secured</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-550 select-none">Setup Pending</span>
                )}

                {/* Sync Solves Button */}
                {handleSync && (
                  <div className="shrink-0 flex-1 flex justify-end">
                    {hasVerifiedPlatform ? (
                      <button
                        type="button"
                        onClick={handleSync}
                        disabled={syncLoading || hasSolvedToday}
                        className={`h-8.5 px-3 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                          hasSolvedToday
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default"
                            : syncLoading
                            ? "bg-white/[0.02] border-white/[0.04] text-zinc-550 cursor-not-allowed"
                            : "bg-white text-black hover:bg-zinc-200 border-white active:scale-95 shadow-md shadow-white/5 hover:scale-[1.01]"
                        }`}
                      >
                        {hasSolvedToday ? (
                          <>Synced</>
                        ) : (
                          <>
                            <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin text-zinc-500" : "text-emerald-500"}`} />
                            {syncLoading ? "Verifying..." : "Sync Solves"}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/settings?tab=platforms")}
                        className="h-8.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        Link Profile
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Console Logs / Error Outputs inside banner */}
              {(apiError || (syncLogs && syncLogs.length > 0)) && (
                <div className="w-full mt-2.5 pt-2.5 border-t border-white/[0.03] text-left">
                  {apiError ? (
                    <p className="text-[9.5px] text-red-400 font-medium leading-normal flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{apiError}</span>
                    </p>
                  ) : (
                    <div className="bg-black/35 rounded-lg p-2 font-mono text-[7.5px] text-zinc-450 leading-normal max-h-[36px] overflow-hidden">
                      {syncLogs.slice(-1).map((log, idx) => {
                        let textClass = "text-zinc-500";
                        if (log.includes("✅") || log.includes("Secured")) textClass = "text-emerald-400 font-bold";
                        if (log.includes("❌")) textClass = "text-red-400 font-bold";
                        return (
                          <div key={idx} className={`${textClass} truncate`}>
                            <span className="text-zinc-700 mr-1">&gt;</span>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Secured & Lost Side-by-Side Cards (Green & Red Theme) */}
            <div className="grid grid-cols-2 gap-3 mt-2.5">
              {/* Secured Box */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-500/35 transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9.5px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Secured
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-2">
                  +₹{completedDays * dailyCommitment}
                </span>
                <span className="text-[9.5px] text-zinc-400 mt-0.5">
                  {completedDays} day{completedDays !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Lost Box */}
              <div className="bg-rose-955/20 border border-rose-500/20 rounded-xl p-3 flex flex-col justify-between hover:border-rose-500/35 transition-all duration-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[9.5px] text-rose-400 font-bold uppercase tracking-wider block">
                    Lost
                  </span>
                </div>
                <span className="text-xl font-bold font-mono text-rose-450 mt-2">
                  -₹{missedDays * dailyCommitment}
                </span>
                <span className="text-[9.5px] text-zinc-400 mt-0.5">
                  {missedDays} day{missedDays !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Streak Shields & Progress bar */}
            <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-white/[0.04]">
              {/* Backup Shields (Lives) Row */}
              <div className="flex items-center justify-between text-xs px-0.5">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                  Backup Shields
                </span>
                <div className="flex items-center gap-2">
                  {renderShields()}
                  <span className="font-bold font-mono text-zinc-400 text-[10px]">
                    {onboardingComplete ? graceCoins : "0"}/3 active
                  </span>
                </div>
              </div>

              {/* 30-Day Plan Target progress slider */}
              <div className="mt-1.5">
                <div className="flex justify-between text-[9px] text-zinc-400 mb-1 font-bold uppercase tracking-wider">
                  <span>Streak Target Progress</span>
                  <span>Day {completedDays + missedDays} / 30</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-550"
                    style={{
                      width: `${Math.min(((completedDays + missedDays) / 30) * 100, 100)}%`,
                    }}
                  />
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