import React, { useState } from "react";
import { Wallet, Lock, Coins, Shield, TrendingDown, RefreshCw } from "lucide-react";
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

  return (
    <div className="relative h-full flex flex-col">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 bg-gradient-to-br from-yellow-500/15 to-orange-500/15" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between h-[522px] min-h-[522px] shadow-lg overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">
              Consistency Wallet
            </h3>
          </div>

          <span
            className={`text-[9px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
              plan?.toLowerCase() === "pro"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-zinc-555 bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-4 relative z-10">
          
          {/* Left Column: Balances & Payouts */}
          <div className="flex flex-col justify-between h-full">
            {/* Wallet Balance Display */}
            <div className="bg-gradient-to-br from-emerald-500/[0.02] to-teal-500/[0.02] border border-emerald-500/10 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-455 font-bold flex items-center gap-1">
                  <Coins className="w-3 h-3" /> Withdrawable
                </div>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  ₹{onboardingComplete ? Math.round(balance) : "0"}
                </span>
              </div>
              {onboardingComplete && balance > 0 && (
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-extrabold rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Withdraw
                </button>
              )}
            </div>

            {/* Active Deposit Display */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3">
              <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Locked Stakes</div>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold font-mono text-zinc-300">
                  ₹{onboardingComplete ? Math.round(activeDeposit) : "0"}
                </span>
                <span className="text-[9px] text-zinc-500">
                  ₹{dailyCommitment}/day pool
                </span>
              </div>
            </div>

            {/* Month End Payout Est */}
            {planStatus === "active" ? (
              <div className="bg-yellow-500/[0.02] border border-yellow-500/10 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Month-end Payout Est.</div>
                  <span className="text-base font-bold text-yellow-450 font-mono mt-1 block">
                    ₹{completedDays * dailyCommitment}
                  </span>
                </div>
                <span className="text-[9px] text-zinc-555">
                  {30 - completedDays - missedDays > 0
                    ? `${30 - completedDays - missedDays} days left`
                    : "Complete! 🎉"}
                </span>
              </div>
            ) : (
              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-xl p-3 flex items-center justify-between">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Plan Expired</span>
                <span className="text-[9px] text-zinc-555">Renew stakes pool</span>
              </div>
            )}

            {/* Grace Coins Section */}
            <div className="flex items-center justify-between text-[10px] border-t border-white/[0.04] pt-3">
              <span className="text-zinc-550 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-zinc-505" /> Grace Protection Coins
              </span>
              <span className="font-bold font-mono text-zinc-300">
                {onboardingComplete ? graceCoins : "0"} / 3 available
              </span>
            </div>
          </div>

          {/* Right Column: Performance Stats & Verification Hub */}
          <div className="flex flex-col justify-between h-full">
            {/* Secured / Lost stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl p-2.5 flex flex-col justify-center">
                <div className="text-[9px] text-zinc-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <Lock className="w-2.5 h-2.5 text-emerald-455" /> Secured
                </div>
                <div className="text-base font-bold text-emerald-455 mt-1">
                  ₹{completedDays * dailyCommitment} <span className="text-[9px] text-zinc-550 font-normal font-sans">({completedDays}d)</span>
                </div>
              </div>

              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-xl p-2.5 flex flex-col justify-center">
                <div className="text-[9px] text-zinc-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <TrendingDown className="w-2.5 h-2.5 text-red-400" /> Lost
                </div>
                <div className="text-base font-bold text-red-400 mt-1">
                  ₹{missedDays * dailyCommitment} <span className="text-[9px] text-zinc-555 font-normal font-sans">({missedDays}d)</span>
                </div>
              </div>
            </div>

            {/* Plan Progress */}
            <div className="my-1">
              <div className="flex justify-between text-[9px] text-zinc-500 mb-1.5 font-bold uppercase tracking-wider">
                <span>Progress: {completedDays + missedDays} / 30 Days</span>
                <span>{Math.round(((completedDays + missedDays) / 30) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-550"
                  style={{
                    width: `${((completedDays + missedDays) / 30) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Streak Protection Sync Box */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col gap-2.5 mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-300 tracking-wide">Today's Streak Goal</span>
                <span className={`text-[8px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border select-none ${
                  hasSolvedToday
                    ? "text-emerald-450 bg-emerald-500/5 border-emerald-500/15"
                    : isStakeAtRisk
                    ? "text-red-450 bg-red-500/5 border-red-500/15"
                    : hasVerifiedPlatform
                    ? "text-yellow-450 bg-yellow-500/5 border-yellow-500/15"
                    : "text-zinc-500 bg-white/[0.01] border-white/[0.04]"
                }`}>
                  {hasSolvedToday ? "Protected" : isStakeAtRisk ? "At Risk" : hasVerifiedPlatform ? "Awaiting Sync" : "No Profile"}
                </span>
              </div>

              {/* Timer and Sync button side-by-side */}
              <div className="flex items-center justify-between gap-2.5">
                {/* Timer */}
                {timeLeft ? (
                  <div className="flex items-center gap-1 font-mono text-zinc-200">
                    <span className="text-[8px] text-zinc-555 uppercase tracking-wider font-sans font-bold mr-0.5">Ends in</span>
                    <div className={`px-1.5 py-0.5 rounded bg-[#0A0B10] border border-white/[0.04] text-[10px] font-bold ${isStakeAtRisk ? "text-red-400 border-red-500/20 animate-pulse" : ""}`}>
                      {String(timeLeft.h).padStart(2, "0")}h
                    </div>
                    <span className="text-zinc-700 text-[9px] font-bold">:</span>
                    <div className={`px-1.5 py-0.5 rounded bg-[#0A0B10] border border-white/[0.04] text-[10px] font-bold ${isStakeAtRisk ? "text-red-400 animate-pulse" : ""}`}>
                      {String(timeLeft.m).padStart(2, "0")}m
                    </div>
                  </div>
                ) : (
                  <span className="text-[9px] text-zinc-555">--:--</span>
                )}

                {/* Sync Action Button */}
                {handleSync && (
                  <div className="shrink-0">
                    {hasVerifiedPlatform ? (
                      <button
                        type="button"
                        onClick={handleSync}
                        disabled={syncLoading}
                        className={`h-8 px-3 rounded-lg font-bold text-[10px] transition-all duration-300 flex items-center gap-1 cursor-pointer border ${
                          syncLoading
                            ? "bg-white/[0.02] border-white/[0.04] text-zinc-650"
                            : "bg-white text-black hover:bg-zinc-200 border-white active:scale-98"
                        }`}
                      >
                        <RefreshCw className={`w-3 h-3 ${syncLoading ? "animate-spin text-zinc-500" : "text-emerald-500"}`} />
                        {syncLoading ? "Sync..." : "Sync Solves"}
                      </button>
                    ) : (
                      <div className="h-8 px-2.5 bg-white/[0.02] border border-white/[0.04] text-zinc-500 rounded-lg font-bold text-[9px] flex items-center justify-center select-none cursor-not-allowed">
                        Link Profile
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Compact Console Sync Logs */}
              {syncLogs && syncLogs.length > 0 && (
                <div className="border-t border-white/[0.04] pt-2 mt-0.5 font-mono text-[8px] text-zinc-555 leading-normal max-h-[45px] overflow-y-auto custom-scrollbar scroll-smooth">
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
                <p className="text-[9px] text-red-400 font-medium leading-tight font-sans">
                  ⚠️ {apiError}
                </p>
              )}

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