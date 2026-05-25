import React from "react";

interface WalletCardProps {
  plan?: string;
  monthlyBudget: number;
  completedDays: number;
  missedDays: number;
  dailyCommitment: number;
  graceCoins: number;
}

export function WalletCard({
  plan,
  monthlyBudget,
  completedDays,
  missedDays,
  dailyCommitment,
  graceCoins,
}: WalletCardProps) {
  return (
    <div>
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Wallet</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
              plan === "pro"
                ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                : "text-zinc-400 bg-white/5 border-white/10"
            }`}>
              {plan === "pro" ? "⚡ Pro" : "Free"}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="text-xs text-zinc-500 mb-1">Total Deposited</div>
            <div className="text-2xl font-bold text-white">₹{monthlyBudget}</div>
            <div className="text-xs text-zinc-500 mt-0.5">held securely this month</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
              <div className="text-xs text-zinc-400 mb-1">🔒 Secured</div>
              <div className="text-xl font-bold text-emerald-400">₹{completedDays * dailyCommitment}</div>
              <div className="text-xs text-zinc-500">{completedDays} days</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <div className="text-xs text-zinc-400 mb-1">💸 Lost</div>
              <div className="text-xl font-bold text-red-400">₹{missedDays * dailyCommitment}</div>
              <div className="text-xs text-zinc-500">{missedDays} days</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-zinc-400">Monthly Progress</span>
              <span className="text-zinc-400">{completedDays}/30 days</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${(completedDays / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="text-xs text-zinc-400 mb-1">💰 Month-end Payout</div>
            <div className="text-2xl font-bold text-yellow-400">₹{completedDays * dailyCommitment}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {30 - completedDays - missedDays > 0
                ? `${30 - completedDays - missedDays} days left — keep submitting!`
                : "Month complete! 🎉"}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-zinc-400">🛡️ Grace Coins</span>
            <span className="text-sm font-semibold text-emerald-400">{graceCoins} available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
