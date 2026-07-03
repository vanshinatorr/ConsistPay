import React, { useState } from "react";
import { Wallet, Lock, Coins, Shield, TrendingDown, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { WithdrawModal } from "../../components/WithdrawModal";

interface WalletCardProps {
  plan?: string;
  monthlyBudget: number;
  completedDays: number;
  // streak is now tracked by completedDays in backend
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
      <div className="flex items-center gap-1">
        {[...Array(totalShields)].map((_, i) => {
          const isActive = i < activeCount;
          return (
            <Shield
              key={i}
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                isActive
                  ? "text-amber-500 fill-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]"
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

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.04] relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shadow-inner">
              <Wallet className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">
              Consistency Wallet
            </h3>
          </div>

          <span
            className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider shadow-sm ${
              plan?.toLowerCase() === "pro"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-zinc-550 bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Account" : "Free Account"}
          </span>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-4.5 relative z-10">
          
          {/* Left Column: Balances & Payouts */}
          <div className="flex flex-col justify-between h-full space-y-4">
            
            {/* Wallet Balance Display */}
            <div className="bg-[#121216] border border-white/[0.03] rounded-xl p-3.5 flex items-center justify-between hover:border-white/[0.08] transition-all group">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-450" /> Withdrawable
                </div>
                <span className="text-2xl font-black font-mono text-white mt-1 block">
                  <span className="text-zinc-650 text-xl font-normal mr-0.5">₹</span>
                  {onboardingComplete ? Math.round(balance) : "0"}
                </span>
              </div>
              {onboardingComplete && balance > 0 && (
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-450 hover:to-teal-450 text-black text-[10px] font-black rounded-lg transition-all shadow-lg shadow-emerald-500/10 active:scale-95 cursor-pointer"
                >
                  Withdraw
                </button>
              )}
            </div>

            {/* Active Deposit Display */}
            <div className="bg-[#121216] border border-white/[0.03] rounded-xl p-3.5 hover:border-white/[0.08] transition-all">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-yellow-500" /> Locked Stakes
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xl font-black font-mono text-zinc-300">
                  <span className="text-zinc-650 text-base font-normal mr-0.5">₹</span>
                  {onboardingComplete ? Math.round(activeDeposit) : "0"}
                </span>
                <span className="text-[10px] text-zinc-500 bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded font-medium">
                  ₹{dailyCommitment}/day pool
                </span>
              </div>
            </div>

            {/* Month End Payout Est */}
            {planStatus === "active" ? (
              <div className="bg-[#121216] border border-white/[0.03] rounded-xl p-3.5 flex items-center justify-between hover:border-white/[0.08] transition-all">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Month-end Payout Est.</div>
                  <span className="text-lg font-black text-yellow-500 font-mono mt-1.5 block">
                    <span className="text-zinc-650 text-sm font-normal mr-0.5">₹</span>
                    {completedDays * dailyCommitment}
                  </span>
                </div>
                <div className="text-[9px] text-zinc-500 bg-yellow-500/[0.03] border border-yellow-500/10 px-2 py-1 rounded font-bold">
                  {30 - completedDays - missedDays > 0
                    ? `${30 - completedDays - missedDays} days remaining`
                    : "Plan complete! 🎉"}
                </div>
              </div>
            ) : (
              <div className="bg-[#121216] border border-red-500/10 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Plan Expired</span>
                <span className="text-[9px] text-zinc-500 font-medium">Renew stakes pool to start</span>
              </div>
            )}

            {/* Grace Coins Section */}
            <div className="flex items-center justify-between text-[11px] border-t border-white/[0.04] pt-3.5">
              <span className="text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                Streak Shields
              </span>
              <div className="flex items-center gap-2">
                {renderShields()}
                <span className="font-bold font-mono text-zinc-400 text-xs">
                  {onboardingComplete ? graceCoins : "0"}/3
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Performance Stats & Verification Hub */}
          <div className="flex flex-col justify-between h-full space-y-4">
            
            {/* Secured / Lost stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#121216] border border-white/[0.03] border-l-2 border-l-emerald-500 rounded-xl p-3 flex flex-col justify-center hover:border-white/[0.08] transition-all">
                <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                  Secured
                </div>
                <div className="text-lg font-black text-emerald-450 font-mono mt-1">
                  ₹{completedDays * dailyCommitment}
                  <span className="text-[10px] text-zinc-550 font-normal font-sans ml-1">({completedDays}d)</span>
                </div>
              </div>

              <div className="bg-[#121216] border border-white/[0.03] border-l-2 border-l-red-500 rounded-xl p-3 flex flex-col justify-center hover:border-white/[0.08] transition-all">
                <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                  Lost
                </div>
                <div className="text-lg font-black text-red-400 font-mono mt-1">
                  ₹{missedDays * dailyCommitment}
                  <span className="text-[10px] text-zinc-550 font-normal font-sans ml-1">({missedDays}d)</span>
                </div>
              </div>
            </div>

            {/* Plan Progress */}
            <div className="bg-[#121216]/50 border border-white/[0.02] rounded-xl p-3 flex flex-col justify-center">
              <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-bold uppercase tracking-wider">
                <span>30-Day Plan Streak</span>
                <span>{completedDays + missedDays} / 30 Days</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-550"
                  style={{
                    width: `${((completedDays + missedDays) / 30) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Streak Protection Sync Box */}
            <div className={`border rounded-xl p-3.5 flex flex-col gap-3 mt-auto transition-all duration-300 ${
              hasSolvedToday 
                ? "bg-emerald-500/[0.01] border-emerald-500/10" 
                : isStakeAtRisk 
                ? "bg-red-500/[0.01] border-red-500/20 animate-pulse" 
                : "bg-[#121216] border-white/[0.03]"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 tracking-wide">Streak Safety</span>
                <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded border select-none ${
                  hasSolvedToday
                    ? "text-emerald-450 bg-emerald-500/10 border-emerald-500/20"
                    : isStakeAtRisk
                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                    : hasVerifiedPlatform
                    ? "text-yellow-450 bg-yellow-500/5 border-yellow-500/10"
                    : "text-zinc-500 bg-white/[0.01] border-white/[0.04]"
                }`}>
                  {hasSolvedToday ? "Protected" : isStakeAtRisk ? "At Risk" : hasVerifiedPlatform ? "Awaiting Sync" : "No Profile"}
                </span>
              </div>

              {/* Timer and Sync button side-by-side */}
              <div className="flex items-center justify-between gap-3 pt-0.5">
                {/* Timer */}
                {timeLeft ? (
                  <div className="flex items-center gap-1 font-mono text-zinc-100 shrink-0">
                    <span className="text-[9px] text-zinc-555 uppercase tracking-wider font-sans font-bold mr-1">Time Left</span>
                    <div className={`px-2 py-1 rounded bg-[#0A0B10] border border-white/[0.04] text-xs font-bold ${isStakeAtRisk ? "text-red-400 border-red-500/20" : ""}`}>
                      {String(timeLeft.h).padStart(2, "0")}h
                    </div>
                    <span className="text-zinc-700 text-xs font-bold">:</span>
                    <div className={`px-2 py-1 rounded bg-[#0A0B10] border border-white/[0.04] text-xs font-bold ${isStakeAtRisk ? "text-red-400" : ""}`}>
                      {String(timeLeft.m).padStart(2, "0")}m
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-555">--:--</span>
                )}

                {/* Sync Action Button */}
                {handleSync && (
                  <div className="shrink-0 flex-1 flex justify-end">
                    {hasVerifiedPlatform ? (
                      <button
                        type="button"
                        onClick={handleSync}
                        disabled={syncLoading || hasSolvedToday}
                        className={`h-9 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                          hasSolvedToday
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450 cursor-default"
                            : syncLoading
                            ? "bg-white/[0.02] border-white/[0.04] text-zinc-650"
                            : "bg-white text-black hover:bg-zinc-200 border-white active:scale-95 shadow-md shadow-white/5 hover:scale-[1.01]"
                        }`}
                      >
                        {hasSolvedToday ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Synced
                          </>
                        ) : (
                          <>
                            <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin text-zinc-500" : "text-emerald-500"}`} />
                            {syncLoading ? "Syncing..." : "Sync Solves"}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="h-9 px-3 bg-white/[0.02] border border-white/[0.04] text-zinc-500 rounded-xl font-bold text-[10px] flex items-center justify-center select-none cursor-not-allowed">
                        Link Profile
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Compact Console Sync Logs */}
              {syncLogs && syncLogs.length > 0 && (
                <div className="border-t border-white/[0.04] pt-2 mt-0.5 font-mono text-[9px] text-zinc-555 leading-relaxed max-h-[40px] overflow-y-auto custom-scrollbar scroll-smooth">
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