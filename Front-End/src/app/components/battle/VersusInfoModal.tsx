import React from "react";
import { X, Swords, Target, Users, Zap, TrendingUp, IndianRupee, ShieldAlert, CheckCircle2 } from "lucide-react";

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
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-white">
              Put Your Money Where Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Consistency Is.</span>
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
              Versus mode is the ultimate accountability hack. Challenge your friends to a consistency duel, lock in stakes, and let the fear of losing money keep you both on track.
            </p>
          </div>

          {/* How it Works */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" /> How It Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold mb-3">1</div>
                <h5 className="text-white font-semibold text-sm">Set the Stakes</h5>
                <p className="text-xs text-zinc-500 leading-relaxed">Decide a custom amount (e.g., ₹500) and invite a friend.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold mb-3">2</div>
                <h5 className="text-white font-semibold text-sm">Lock in Funds</h5>
                <p className="text-xs text-zinc-500 leading-relaxed">Both players deposit the stake into the secure battle pool.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold mb-3">3</div>
                <h5 className="text-white font-semibold text-sm">Highest Streak Wins</h5>
                <p className="text-xs text-zinc-500 leading-relaxed">At the end of the challenge, the person with the higher streak wins the pool.</p>
              </div>
            </div>
          </div>

          {/* Example Scenario */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-900/20 to-purple-900/10 border border-violet-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Swords className="w-24 h-24 text-violet-400" />
            </div>
            <h4 className="text-sm font-bold text-violet-300 uppercase tracking-wider mb-4">Example Scenario</h4>
            
            <div className="flex items-center justify-between max-w-sm mx-auto mb-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-2 border-2 border-emerald-500/30">
                  <span className="text-emerald-400 font-bold">You</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">₹500 locked</span>
              </div>
              
              <div className="flex flex-col items-center justify-center px-4">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Total Pool</span>
                <span className="text-2xl font-black text-white">₹1,000</span>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-2 border-2 border-rose-500/30">
                  <span className="text-rose-400 font-bold">Rohan</span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">₹500 locked</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 bg-black/20 p-3 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300"><span className="font-semibold text-white">If it's a tie:</span> You both maintained equal streaks. The pool is split and you get your ₹500 back.</p>
              </div>
              <div className="flex items-start gap-2 bg-black/20 p-3 rounded-lg">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300"><span className="font-semibold text-white">If you have a higher streak:</span> You beat Rohan's consistency and win the entire ₹1,000 pool!</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Why It Works
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="p-2 bg-rose-500/10 rounded-lg shrink-0">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h6 className="text-sm font-bold text-white mb-1">Loss Aversion</h6>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">Humans hate losing money 2x more than they enjoy winning it. This psychological trigger forces consistency.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h6 className="text-sm font-bold text-white mb-1">Social Pressure</h6>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">Letting yourself down is easy. Letting your friend win your money? Impossible.</p>
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
