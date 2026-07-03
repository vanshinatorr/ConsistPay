import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Swords, Lock, Info, Plus, Coins, Sparkles } from "lucide-react";
import TopupModal from "../../components/battle/TopupModal";
import VersusInfoModal from "../../components/battle/VersusInfoModal";
import { WithdrawModal } from "../../components/WithdrawModal";

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
      <div className="absolute -inset-px bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-[249px] min-h-[249px] shadow-xl overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {!isPro ? (
          /* LOCKED STATE FOR FREE PLAN */
          <div className="flex flex-col items-center justify-between text-center h-full py-1.5 flex-1 select-none">
            {/* Header */}
            <div className="flex items-center justify-between w-full relative z-10">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Versus Mode
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/[0.04] px-2 py-0.5 rounded">
                PRO ONLY
              </span>
            </div>

            {/* Icon & Details */}
            <div className="relative my-2 flex items-center gap-4 text-left w-full relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-12 h-12 bg-[#0F0F13] border border-white/[0.04] rounded-2xl flex items-center justify-center shadow-md">
                  <Swords className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-indigo-600 border border-indigo-400/20 rounded-full flex items-center justify-center shadow-md">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Head-to-head coding duels</h4>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[180px] leading-relaxed">
                  Challenge friends, lock stakes, and prove consistency in head-to-head matches.
                </p>
              </div>
            </div>

            {/* CTA block */}
            <div className="w-full flex gap-3 relative z-10 mt-auto">
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex-1 py-2 rounded-xl bg-white/5 border border-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" /> Info
              </button>
              <Link
                to="/pricing"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-xs transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] flex items-center justify-center gap-1 hover:scale-[1.01]"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-350" /> Upgrade
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
                  Versus Mode
                </span>
                <span className="text-xs text-zinc-400 mt-0.5">Available for Stakes</span>
              </div>
              <button 
                onClick={() => setShowInfoModal(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider border border-white/[0.04] relative z-10"
              >
                <Info className="w-3 h-3" /> Info
              </button>
            </div>

            {/* Balance Display */}
            <div className="my-2 relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Swords className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight leading-none">
                  ₹{onboardingComplete ? Math.round(battleBalance) : "0"}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  Challenge friends, lock stakes, and secure winnings.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 mt-auto relative z-10">
              <Link 
                to="/create-challenge"
                className="flex-1 py-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 hover:scale-[1.01]"
              >
                <Plus className="w-3.5 h-3.5" /> Challenge
              </Link>
              <button 
                onClick={() => setShowTopupModal(true)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/[0.04] transition-all rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Coins className="w-3.5 h-3.5 text-violet-400" /> Add Funds
              </button>
              {battleBalance > 0 && (
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border border-emerald-500/20 transition-all rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Coins className="w-3.5 h-3.5 text-emerald-400" /> Claim
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

      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          availableBalance={battleBalance}
          walletType="battle"
          onSuccess={onRefreshRequest}
        />
      )}
    </div>
  );
}

export default VersusCard;
