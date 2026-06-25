// import React from "react";

// interface WalletCardProps {
//   plan?: string;
//   monthlyBudget: number;
//   completedDays: number;
//   missedDays: number;
//   dailyCommitment: number;
//   graceCoins: number;
// }

// export function WalletCard({
//   plan,
//   monthlyBudget,
//   completedDays,
//   missedDays,
//   dailyCommitment,
//   graceCoins,
// }: WalletCardProps) {
//   return (
//     <div>
//       <div className="relative h-full">
//         <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
//         <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold">Wallet</h2>
//             <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
//               plan === "pro"
//                 ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
//                 : "text-zinc-400 bg-white/5 border-white/10"
//             }`}>
//               {plan === "pro" ? "⚡ Pro" : "Free"}
//             </span>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
//             <div className="text-xs text-zinc-500 mb-1">Total Deposited</div>
//             <div className="text-2xl font-bold text-white">₹{monthlyBudget}</div>
//             <div className="text-xs text-zinc-500 mt-0.5">held securely this month</div>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
//               <div className="text-xs text-zinc-400 mb-1">🔒 Secured</div>
//               <div className="text-xl font-bold text-emerald-400">₹{completedDays * dailyCommitment}</div>
//               <div className="text-xs text-zinc-500">{completedDays} days</div>
//             </div>
//             <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
//               <div className="text-xs text-zinc-400 mb-1">💸 Lost</div>
//               <div className="text-xl font-bold text-red-400">₹{missedDays * dailyCommitment}</div>
//               <div className="text-xs text-zinc-500">{missedDays} days</div>
//             </div>
//           </div>

//           <div className="mb-4">
//             <div className="flex justify-between text-xs mb-2">
//               <span className="text-zinc-400">Monthly Progress</span>
//               <span className="text-zinc-400">{completedDays}/30 days</span>
//             </div>
//             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
//                 style={{ width: `${(completedDays / 30) * 100}%` }}
//               />
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
//             <div className="text-xs text-zinc-400 mb-1">💰 Month-end Payout</div>
//             <div className="text-2xl font-bold text-yellow-400">₹{completedDays * dailyCommitment}</div>
//             <div className="text-xs text-zinc-500 mt-1">
//               {30 - completedDays - missedDays > 0
//                 ? `${30 - completedDays - missedDays} days left — keep submitting!`
//                 : "Month complete! 🎉"}
//             </div>
//           </div>

//           <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
//             <span className="text-sm text-zinc-400">🛡️ Grace Coins</span>
//             <span className="text-sm font-semibold text-emerald-400">{graceCoins} available</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Swords, Lock, Info, Plus, Coins, Sparkles, TrendingDown, Shield } from "lucide-react";
import TopupModal from "../../components/battle/TopupModal";
import VersusInfoModal from "../../components/battle/VersusInfoModal";

interface WalletCardProps {
  plan?: string;
  monthlyBudget: number;
  completedDays: number;
  missedDays: number;
  dailyCommitment: number;
  graceCoins: number;
  battleBalance: number;
  balance?: number;
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
  battleBalance,
  onboardingComplete = true,
  onRefreshRequest,
}: WalletCardProps) {
  const [activeTab, setActiveTab] = useState<"consistency" | "battle">("consistency");
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleTopupSuccess = (newBalance: number) => {
    if (onRefreshRequest) {
      onRefreshRequest();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Background Glow based on Active Tab */}
      <div 
        className={`absolute inset-0 rounded-2xl blur-xl opacity-40 transition-colors duration-500 ${
          activeTab === "consistency" 
            ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20" 
            : "bg-gradient-to-br from-violet-500/20 to-purple-500/20"
        }`} 
      />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between h-full flex-1 min-h-[522px] shadow-lg">
        
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 w-full max-w-[200px]">
            <button
              onClick={() => setActiveTab("consistency")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === "consistency"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" /> Plan
            </button>
            <button
              onClick={() => setActiveTab("battle")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                activeTab === "battle"
                  ? "bg-violet-500/20 text-violet-300 shadow-sm border border-violet-500/30"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Swords className="w-3.5 h-3.5" /> Versus
            </button>
          </div>

          {/* Only show Free/Pro pill on consistency tab */}
          {activeTab === "consistency" && (
            <span
              className={`text-[10px] px-2 py-1 rounded-full font-semibold border uppercase tracking-wider ${
                plan?.toLowerCase() === "pro"
                  ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                  : "text-zinc-400 bg-white/5 border-white/10"
              }`}
            >
              {plan?.toLowerCase() === "pro" ? "Pro" : "Free"}
            </span>
          )}
        </div>

        {/* Tab Content: CONSISTENCY */}
        {activeTab === "consistency" && (
          <div className="flex flex-col flex-1 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 mb-4">
              <div className="text-xs text-zinc-500 mb-1">
                Total Deposited
              </div>
              <span className="text-xl font-bold font-mono">
                ₹{onboardingComplete ? Math.round(monthlyBudget) : "0"}
              </span>
              <div className="text-xs text-zinc-500 mt-0.5">
                ₹{dailyCommitment}/day commitment • 30-day challenge active
              </div>
            </div>

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

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-400">
                  Monthly Progress
                </span>
                <span className="text-zinc-400">
                  {completedDays}/30 days
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedDays / 30) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 mt-auto">
              <div className="text-xs text-zinc-450 mb-1 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> Month-end Payout
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                ₹{completedDays * dailyCommitment}
              </div>
              <div className="text-xs text-zinc-550 mt-1">
                {30 - completedDays - missedDays > 0
                  ? `${30 - completedDays - missedDays} days left — keep submitting!`
                  : "Month complete! 🎉"}
              </div>
            </div>

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
              <span className="text-xl font-semibold font-mono text-zinc-100 group-hover:text-amber-300 transition-colors">
                {onboardingComplete ? graceCoins : "0"}
              </span>
            </div>
          </div>
        )}

        {/* Tab Content: BATTLE */}
        {activeTab === "battle" && (
          <div className="flex flex-col flex-1 h-full animate-in fade-in zoom-in-95 duration-200">
            {plan?.toLowerCase() !== "pro" ? (
              <div className="flex flex-col items-center justify-between text-center h-full px-2 py-4 flex-1 select-none animate-in fade-in zoom-in-95 duration-300">
                
                {/* Icon Container with Pulsing Glow */}
                <div className="relative mb-4 mt-2">
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 bg-[#0F0F13] border border-white/[0.04] rounded-2xl flex items-center justify-center shadow-md shadow-indigo-500/5">
                    <Swords className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 border border-indigo-400/20 rounded-full flex items-center justify-center shadow-md">
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5 mb-4">
                  <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 via-zinc-200 to-indigo-300 bg-clip-text text-transparent">
                    Versus Mode
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                    Challenge friends, set daily coding stakes, and prove your consistency in head-to-head duels.
                  </p>
                </div>

                {/* Bullet benefits */}
                <div className="w-full max-w-[240px] bg-white/[0.01] border border-white/[0.04] rounded-xl p-3 mb-5 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                    <span className="text-indigo-400">✦</span> Head-to-Head custom duels
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                    <span className="text-indigo-400">✦</span> Winner-takes-all stakes pool
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                    <span className="text-indigo-400">✦</span> Shared accountability & tracking
                  </div>
                </div>

                {/* CTA Action Block */}
                <div className="w-full space-y-3.5 mt-auto">
                  <a 
                    href="/pricing"
                    className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 hover:scale-[1.02] text-xs"
                  >
                    <Sparkles className="w-4 h-4" /> Upgrade to Pro
                  </a>
                  
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-zinc-600" /> Learn more about Versus Mode
                  </button>
                </div>

              </div>
            ) : (
              <>
                <div className="bg-gradient-to-b from-violet-500/5 to-transparent border border-white/[0.04] rounded-2xl p-6 text-center relative overflow-hidden group shadow-xl flex-1 flex flex-col justify-center">
                  {/* Glowing background aura */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-violet-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-violet-500/20 transition-colors duration-500" />
                  
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider border border-white/5"
                    title="What is Versus Mode?"
                  >
                    <Info className="w-3.5 h-3.5" /> Info
                  </button>

                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
                    <Swords className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="text-[10px] text-violet-400 font-semibold tracking-widest mb-1 uppercase">Available for Stakes</div>
                  <div className="text-4xl font-bold text-white tracking-tight mb-2">₹{battleBalance}</div>
                  
                  <p className="text-xs text-zinc-400 max-w-[200px] mx-auto leading-relaxed">
                    Challenge friends, lock stakes, and prove your consistency.
                  </p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <Link 
                    to="/create-challenge"
                    className="w-full py-3.5 rounded-xl font-semibold bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl text-sm"
                  >
                    <Plus className="w-4 h-4" /> Create Challenge
                  </Link>

                  <button 
                    onClick={() => setShowTopupModal(true)}
                    className="w-full py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Coins className="w-4 h-4 text-violet-400" /> Add Funds
                  </button>
                  
                  <div className="text-[9px] text-zinc-500 text-center leading-relaxed px-4 pt-1">
                    Deposited funds are locked securely and paid out automatically.
                  </div>
                </div>
              </>
            )}
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
    </div>
  );
}