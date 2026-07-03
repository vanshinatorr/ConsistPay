import React, { useState } from "react";
import { Wallet, Lock, Coins, Shield, TrendingDown } from "lucide-react";
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
}: WalletCardProps) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <div className="relative h-full flex flex-col">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 bg-gradient-to-br from-yellow-500/15 to-orange-500/15" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between h-[522px] min-h-[522px] shadow-lg overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.04] relative z-10">
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
                : "text-zinc-550 bg-white/[0.02] border-white/[0.06]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        {/* 2-Column Wide Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mt-3.5 relative z-10">
          
          {/* Left Column: Balances & Grace */}
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
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-extrabold rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Withdraw
                </button>
              )}
            </div>

            {/* Active Deposit Display */}
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Locked Stakes</div>
                <span className="text-base font-bold font-mono text-zinc-300 mt-0.5 block">
                  ₹{onboardingComplete ? Math.round(activeDeposit) : "0"}
                </span>
              </div>
              <div className="text-[9px] text-zinc-555 text-right leading-tight">
                ₹{dailyCommitment}/day commitment<br />30-day active pool
              </div>
            </div>

            {/* Grace Coins Section */}
            <div className="flex items-center justify-between text-[10px] border-t border-white/[0.04] pt-2">
              <span className="text-zinc-500 flex items-center gap-1">
                <Shield className="w-3 h-3 text-zinc-505" /> Grace Protection Coins
              </span>
              <span className="font-bold font-mono text-zinc-300">
                {onboardingComplete ? graceCoins : "0"} / 3 available
              </span>
            </div>
          </div>

          {/* Right Column: Performance Stats & Payouts */}
          <div className="flex flex-col justify-between h-full">
            {/* Secured / Lost stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg p-2 flex flex-col justify-center">
                <div className="text-[9px] text-zinc-500 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-455" /> Secured
                </div>
                <div className="text-sm font-bold text-emerald-455 mt-0.5">
                  ₹{completedDays * dailyCommitment} <span className="text-[9px] text-zinc-550 font-normal font-sans">({completedDays}d)</span>
                </div>
              </div>

              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-lg p-2 flex flex-col justify-center">
                <div className="text-[9px] text-zinc-500 flex items-center gap-1">
                  <TrendingDown className="w-2.5 h-2.5 text-red-400" /> Lost
                </div>
                <div className="text-sm font-bold text-red-400 mt-0.5">
                  ₹{missedDays * dailyCommitment} <span className="text-[9px] text-zinc-555 font-normal font-sans">({missedDays}d)</span>
                </div>
              </div>
            </div>

            {/* Plan Progress */}
            <div>
              <div className="flex justify-between text-[9px] text-zinc-500 mb-1">
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

            {/* Dynamic Footer stats based on Active Plan */}
            {planStatus === "active" ? (
              <div className="bg-yellow-500/[0.02] border border-yellow-500/10 rounded-xl p-2 flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Month-end Payout Est.</div>
                  <span className="text-sm font-bold text-yellow-450 font-mono mt-0.5 block">
                    ₹{completedDays * dailyCommitment}
                  </span>
                </div>
                <div className="text-[9px] text-zinc-555 text-right leading-tight">
                  {30 - completedDays - missedDays > 0
                    ? `${30 - completedDays - missedDays} days remaining`
                    : "Plan complete! 🎉"}
                </div>
              </div>
            ) : (
              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-xl p-2 flex items-center justify-between">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Plan Expired</span>
                <span className="text-[9px] text-zinc-555">Renew pool to resume streaks</span>
              </div>
            )}
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