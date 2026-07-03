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
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 bg-gradient-to-br from-yellow-500/20 to-orange-500/20" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between h-full flex-1 min-h-[522px] shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
              Consistency Wallet
            </h3>
          </div>

          <span
            className={`text-[10px] px-2 py-1 rounded-full font-semibold border uppercase tracking-wider ${
              plan?.toLowerCase() === "pro"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-zinc-400 bg-white/[0.04] border border-white/[0.04]"
            }`}
          >
            {plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 relative z-10 justify-between h-full">
          
          {/* Wallet Balance Display */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-teal-500/[0.03] border border-emerald-500/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" /> Withdrawable Balance
                </div>
                <span className="text-2xl font-black font-mono text-white">
                  ₹{onboardingComplete ? Math.round(balance) : "0"}
                </span>
              </div>
              {onboardingComplete && balance > 0 && (
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Withdraw
                </button>
              )}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1.5">
              Funds secured from completed coding commitments.
            </div>
          </div>

          {/* Active Deposit Display */}
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 mb-4">
            <div className="text-xs text-zinc-500 mb-1">
              Active Deposit Pool (Locked)
            </div>
            <span className="text-xl font-bold font-mono text-zinc-300">
              ₹{onboardingComplete ? Math.round(activeDeposit) : "0"}
            </span>
            <div className="text-xs text-zinc-555 mt-0.5">
              ₹{dailyCommitment}/day commitment • 30-day plan
            </div>
          </div>

          {/* Secured / Lost stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-center">
              <div className="text-xs text-zinc-400 mb-1 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Secured
              </div>
              <div className="text-xl font-bold text-emerald-400">
                ₹{completedDays * dailyCommitment}
              </div>
              <div className="text-xs text-zinc-550">
                {completedDays} days
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
              <div className="text-xs text-zinc-400 mb-1 flex items-center justify-center gap-1">
                <TrendingDown className="w-3 h-3 text-red-400" /> Lost
              </div>
              <div className="text-xl font-bold text-red-400">
                ₹{missedDays * dailyCommitment}
              </div>
              <div className="text-xs text-zinc-550">
                {missedDays} days
              </div>
            </div>
          </div>

          {/* Plan Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-zinc-400">
                Plan Progress
              </span>
              <span className="text-zinc-400">
                {completedDays + missedDays}/30 days
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{
                  width: `${((completedDays + missedDays) / 30) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Dynamic Footer stats based on Active Plan */}
          {planStatus === "active" ? (
            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 mt-auto">
              <div className="text-xs text-zinc-450 mb-1 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> Month-end Payout Preview
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                ₹{completedDays * dailyCommitment}
              </div>
              <div className="text-xs text-zinc-550 mt-1">
                {30 - completedDays - missedDays > 0
                  ? `${30 - completedDays - missedDays} days left — keep submitting!`
                  : "Plan complete! 🎉"}
              </div>
            </div>
          ) : (
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mt-auto flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-red-400 font-bold">Plan Expired</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Please renew to resume earning.</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border text-red-400 border-red-500/20 bg-red-500/5">
                  Expired
                </span>
              </div>
            </div>
          )}

          {/* Grace Coins Section */}
          <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-start justify-between">
            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> Grace Coins
              </div>
              <div className="text-[10px] text-zinc-550 mt-1">
                {plan?.toLowerCase() === "pro" 
                  ? "1 base coin • +1 bonus at 15-day streak" 
                  : "1 base coin • Upgrade to Pro for streak bonuses"}
              </div>
            </div>
            <span className="text-xl font-semibold font-mono text-zinc-100 transition-colors">
              {onboardingComplete ? graceCoins : "0"}
            </span>
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