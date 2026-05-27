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
import { Wallet, Swords, Lock, Info } from "lucide-react";
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

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-full flex-1">
        
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
              className={`text-[10px] px-2 py-1 rounded-full font-bold border uppercase tracking-wider ${
                plan?.toLowerCase() === "pro"
                  ? "text-violet-400 bg-violet-500/10 border-violet-500/20"
                  : "text-zinc-400 bg-white/5 border-white/10"
              }`}
            >
              {plan?.toLowerCase() === "pro" ? "⚡ Pro" : "Free"}
            </span>
          )}
        </div>

        {/* Tab Content: CONSISTENCY */}
        {activeTab === "consistency" && (
          <div className="flex flex-col flex-1 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <div className="text-xs text-zinc-500 mb-1">
                Total Deposited
              </div>
              <span className="text-xl font-bold font-mono">
                ₹{onboardingComplete ? monthlyBudget.toFixed(2) : "0.00"}
              </span>
              <div className="text-xs text-zinc-500 mt-0.5">
                ₹{dailyCommitment}/day commitment • 30-day challenge active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <div className="text-xs text-zinc-400 mb-1">
                  🔒 Secured
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  ₹{completedDays * dailyCommitment}
                </div>
                <div className="text-xs text-zinc-500">
                  {completedDays} days
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                <div className="text-xs text-zinc-400 mb-1">
                  💸 Lost
                </div>
                <div className="text-xl font-bold text-red-400">
                  ₹{missedDays * dailyCommitment}
                </div>
                <div className="text-xs text-zinc-500">
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

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 mt-auto">
              <div className="text-xs text-zinc-400 mb-1">
                💰 Month-end Payout
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                ₹{completedDays * dailyCommitment}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                {30 - completedDays - missedDays > 0
                  ? `${30 - completedDays - missedDays} days left — keep submitting!`
                  : "Month complete! 🎉"}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-start justify-between">
              <div>
                <div className="text-sm text-zinc-400">🛡️ Grace Coins</div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {plan?.toLowerCase() === "pro" 
                    ? "1 base coin • +1 bonus at 15-day streak" 
                    : "1 base coin • Upgrade to Pro for streak bonuses"}
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-zinc-100 group-hover:text-amber-300 transition-colors">
                {onboardingComplete ? graceCoins : "0"}
              </span>
            </div>
          </div>
        )}

        {/* Tab Content: BATTLE */}
        {activeTab === "battle" && (
          <div className="flex flex-col flex-1 h-full animate-in fade-in zoom-in-95 duration-200">
            {plan?.toLowerCase() !== "pro" ? (
              <div className="flex flex-col items-center justify-center text-center h-full px-4">
                
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5 relative">
                  <Swords className="w-6 h-6 text-zinc-400" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#0D0D0F] rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center">
                      <Lock className="w-2 h-2 text-zinc-300" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                    Versus Mode
                  </h3>
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 hover:text-violet-200 text-[10px] font-bold uppercase tracking-wider transition-colors border border-violet-500/20"
                  >
                    <Info className="w-3 h-3" /> What is this?
                  </button>
                </div>
                
                <p className="text-sm text-zinc-400 mb-8 max-w-[220px] leading-relaxed">
                  Challenge friends, set stakes, and prove your consistency in Versus mode.
                </p>

                <a 
                  href="/pricing"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Upgrade to Pro
                </a>
              </div>
            ) : (
              <>
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5 mb-4 text-center relative">
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                    title="What is Versus Mode?"
                  >
                    <Info className="w-3.5 h-3.5" /> Info
                  </button>
                  <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <Swords className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-semibold">Available for Stakes</div>
                  <div className="text-4xl font-black text-white mb-2">₹{battleBalance}</div>
                  <p className="text-xs text-violet-300/70">
                    Use this balance to challenge friends in Head-to-Head consistency battles.
                  </p>
                </div>
                
                <div className="mt-auto pt-4 space-y-3">
                  <button 
                    onClick={() => setShowTopupModal(true)}
                    className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                  >
                    Add Funds
                  </button>
                  
                  <div className="text-[10px] text-zinc-500 text-center leading-relaxed px-2">
                    Real money integration (Razorpay/Stripe) is required to legally deposit funds for stakes.
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