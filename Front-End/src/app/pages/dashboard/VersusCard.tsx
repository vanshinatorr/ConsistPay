import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swords, Lock, Info, Plus, Coins, Zap } from "lucide-react";
import TopupModal from "../../components/battle/TopupModal";
import VersusInfoModal from "../../components/battle/VersusInfoModal";
// WithdrawModal rendered globally at Dashboard level

interface VersusCardProps {
  plan?: string;
  battleBalance: number;
  onboardingComplete?: boolean;
  onRefreshRequest?: () => void;
}

export function VersusCard({
  plan,
  battleBalance = 0,
  onboardingComplete = true,
  onRefreshRequest,
}: VersusCardProps) {
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleTopupSuccess = (newBalance: number) => {
    if (onRefreshRequest) {
      onRefreshRequest();
    } else {
      window.location.reload();
    }
  };

  const isPro = plan?.toLowerCase() === "pro";

  return (
    <div className="relative group h-full">
      {/* Background Glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

      <div className="relative bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.03] rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-white/[0.08] transition-all duration-300 flex flex-col justify-between h-[249px] min-h-[249px] shadow-lg overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {!isPro ? (
          /* LOCKED STATE FOR FREE PLAN */
          <div className="flex flex-col items-center justify-between text-center h-full py-1.5 flex-1 select-none">
            {/* Header */}
            <div className="flex items-center justify-between w-full relative z-10">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-550 uppercase tracking-widest">
                Battle Mode
              </span>
              <span className="text-[9px] font-bold text-violet-650 dark:text-violet-400 uppercase tracking-widest bg-violet-500/5 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-2 py-0.5 rounded">
                PRO ONLY
              </span>
            </div>

            {/* Icon & Details */}
            <div className="relative my-2 flex items-center gap-4 text-left w-full relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-12 h-12 bg-zinc-100 dark:bg-[#0F0F13] border border-zinc-200 dark:border-white/[0.04] rounded-2xl flex items-center justify-center shadow-md">
                  <Swords className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-indigo-600 border border-indigo-400/20 rounded-full flex items-center justify-center shadow-md">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800 dark:text-white leading-tight">Head-to-head coding duels</h4>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[180px] leading-relaxed">
                  Challenge friends, lock stakes, and prove consistency in head-to-head matches.
                </p>
              </div>
            </div>

            {/* CTA block */}
            <div className="w-full flex gap-3 relative z-10 mt-auto">
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex-1 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" /> Info
              </button>
              <Link
                to="/pricing"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white-force font-bold text-xs transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] flex items-center justify-center gap-1 hover:scale-[1.01]"
              >
                Upgrade
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE PLAYERS FLOW */
          <div className="flex flex-col justify-between h-full flex-1">
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Battle Mode
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Available for Stakes</span>
              </div>
              <button 
                onClick={() => setShowInfoModal(true)}
                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider border border-zinc-200 dark:border-white/[0.04] relative z-10 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" /> Info
              </button>
            </div>

            {/* Balance Display */}
            <div className="my-2 relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Swords className="w-5 h-5 text-indigo-550 dark:text-indigo-455" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-zinc-800 dark:text-white tracking-tight leading-none">
                  ₹{onboardingComplete ? Math.round(battleBalance) : "0"}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  Challenge friends, lock stakes, and secure winnings.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto relative z-10 w-full">
              <Link 
                to="/create-challenge"
                className="flex-1 h-9 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-all rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" /> Challenge
              </Link>
              <button 
                onClick={() => setShowTopupModal(true)}
                className="flex-1 h-9 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.04] transition-all rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Coins className="w-3.5 h-3.5 text-zinc-450 dark:text-zinc-400 shrink-0" /> Add Funds
              </button>
              {battleBalance > 0 && (
                <button 
                  onClick={() => {
                    const event = new CustomEvent("open-withdraw-modal", { detail: { walletType: "battle" } });
                    window.dispatchEvent(event);
                  }}
                  className="flex-1 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 transition-all rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-95"
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-600 dark:text-zinc-900 shrink-0" /> Claim
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showTopupModal && (
        <TopupModal 
          onClose={() => setShowTopupModal(false)} 
          onSuccess={handleTopupSuccess} 
        />
      )}

      {showInfoModal && (
        <VersusInfoModal 
          onClose={() => setShowInfoModal(false)} 
        />
      )}

      {/* WithdrawModal rendered globally at Dashboard level */}
    </div>
  );
}

export default VersusCard;
