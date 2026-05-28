import React from "react";
import { X, Swords, Target, Users, Zap, TrendingUp, IndianRupee, ShieldAlert, CheckCircle2, Trophy } from "lucide-react";

interface VersusInfoModalProps {
  onClose: () => void;
}

export default function VersusInfoModal({ onClose }: VersusInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-[#0D0D0F] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0D0D0F]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
              <Swords className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Versus Mode</h2>
              <p className="text-xs text-zinc-400">Head-to-Head Accountability</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-5">
            <h3 className="text-2xl font-black text-white">
              Put Your Money Where Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Consistency Is.</span>
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-sm text-zinc-300">
                <Swords className="w-4 h-4 text-violet-400" /> Challenge friends
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-sm text-zinc-300">
                <IndianRupee className="w-4 h-4 text-emerald-400" /> Lock in stakes
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-sm text-zinc-300">
                <Trophy className="w-4 h-4 text-yellow-400" /> Earn money
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" /> How It Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold mb-2">1</div>
                <h5 className="text-white font-bold text-sm">Set the Stakes</h5>
                <p className="text-sm text-zinc-400 leading-relaxed">Decide a custom amount (e.g., ₹500) and invite a friend.</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-2">2</div>
                <h5 className="text-white font-bold text-sm">Lock in Funds</h5>
                <p className="text-sm text-zinc-400 leading-relaxed">Both players deposit the stake into the secure pool.</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold mb-2">3</div>
                <h5 className="text-white font-bold text-sm">Highest Streak Wins</h5>
                <p className="text-sm text-zinc-400 leading-relaxed">The person with the higher streak at the end wins.</p>
              </div>
            </div>
          </div>

          {/* Example Scenario */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden mt-6 shadow-inner">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <Swords className="w-32 h-32 text-white" />
            </div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span> Example Scenario
            </h4>
            
            <div className="flex items-center justify-between max-w-md mx-auto mb-8 relative z-10">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#131316] flex items-center justify-center mx-auto mb-3 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span className="text-emerald-400 font-bold text-sm">You</span>
                </div>
                <span className="text-sm text-zinc-400 font-medium tracking-wide">₹500 locked</span>
              </div>
              
              <div className="flex flex-col items-center justify-center px-4">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Total Pool</span>
                <span className="text-3xl font-black text-white tracking-tight">₹1,000</span>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#131316] flex items-center justify-center mx-auto mb-3 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                  <span className="text-rose-400 font-bold text-sm">Vansh</span>
                </div>
                <span className="text-sm text-zinc-400 font-medium tracking-wide">₹500 locked</span>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-start gap-3 bg-white/[0.03] border border-white/5 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-300 leading-relaxed"><span className="font-semibold text-white">If it's a tie:</span> You both maintained equal streaks. The pool is split and you get your ₹500 back.</p>
              </div>
              <div className="flex items-start gap-3 bg-violet-500/10 border border-violet-500/20 p-4 rounded-xl shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-zinc-200 leading-relaxed"><span className="font-semibold text-white">If you have a higher streak:</span> You beat Vansh's consistency and win the entire ₹1,000 pool!</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4 pt-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Why It Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="p-2.5 bg-rose-500/10 rounded-lg shrink-0 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h6 className="text-sm font-bold text-white mb-1.5">Loss Aversion</h6>
                  <p className="text-sm text-zinc-400 leading-relaxed">Humans hate losing money 2x more than they enjoy winning it. This forces consistency.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="p-2.5 bg-blue-500/10 rounded-lg shrink-0 border border-blue-500/20">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h6 className="text-sm font-bold text-white mb-1.5">Social Pressure</h6>
                  <p className="text-sm text-zinc-400 leading-relaxed">Letting yourself down is easy. Letting your friend win your money? Impossible.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 bg-[#0D0D0F]">
          <button
            onClick={onClose}
            className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl py-3.5 font-bold transition-all"
          >
            Got it, Let's Battle
          </button>
        </div>
        
      </div>
    </div>
  );
}
