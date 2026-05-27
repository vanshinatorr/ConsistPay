import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, Lock, Trophy, Users, ShieldAlert, Sparkles, 
  Plus, ArrowRight, Zap, Target, ShieldCheck, Play
} from "lucide-react";

interface BattleHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: string;
}

export function BattleHubModal({ isOpen, onClose, plan = "free" }: BattleHubModalProps) {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  
  const isPro = plan.toLowerCase() === "pro";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    onClose();
    navigate(`/join-challenge/${inviteCode.trim()}`);
  };

  const handleCreate = () => {
    onClose();
    navigate("/create-challenge");
  };

  const handleUnlockPro = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[1150px] bg-[#0A0A0C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 relative z-10 shrink-0 bg-[#0A0A0C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Battle Hub
            </h2>
            {!isPro && (
              <span className="text-[10px] bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ml-2">
                <Sparkles className="w-2.5 h-2.5" /> PRO ONLY
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body (2 Columns) */}
        <div className="flex flex-col lg:flex-row overflow-y-auto relative z-10 flex-1 custom-scrollbar">
          
          {/* ================= LEFT SIDE: EXPLANATION ================= */}
          <div className="w-full lg:w-[55%] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/5 relative">
            
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white">
                Compete. Stay Consistent.<br/>
                <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Win Together.
                </span>
              </h1>
              <p className="text-zinc-400 text-sm lg:text-base leading-relaxed max-w-md">
                Challenge friends in coding consistency battles. Stay accountable together, protect streaks, and compete for rewards.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: ShieldCheck, text: "AI verified submissions", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                { icon: Target, text: "Shared daily deadlines", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                { icon: Trophy, text: "Winner takes all", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                { icon: Zap, text: "Real-time tracking", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" }
              ].map((f, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${f.bg} ${f.border} border flex items-center justify-center shrink-0`}>
                    <f.icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Visual Engagement / Mockup */}
            <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500 opacity-50" />
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1">Live Battle</div>
                  <div className="text-sm font-semibold text-white">30 Day Consistency War</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Pool</div>
                  <div className="text-sm font-bold text-emerald-400">₹398</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* User */}
                <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold mb-2 shadow-lg shadow-violet-500/20">ME</div>
                  <span className="text-xs font-semibold">14 Days</span>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-violet-500 w-[90%]"></div></div>
                </div>
                
                <div className="text-xs font-black text-zinc-500 italic">VS</div>

                {/* Opponent */}
                <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center text-sm font-bold mb-2 shadow-lg shadow-black/50">AK</div>
                  <span className="text-xs font-semibold">12 Days</span>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden"><div className="h-full bg-emerald-500 w-[70%]"></div></div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 2,431 battles completed</span>
              <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> ₹18K+ won this month</span>
            </div>

          </div>

          {/* ================= RIGHT SIDE: ACTIONS ================= */}
          <div className="w-full lg:w-[45%] p-8 lg:p-10 bg-[#0D0D10]/50 flex flex-col justify-center">
            
            {!isPro ? (
              // Locked State for Free Users
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-violet-500/20">
                  <Lock className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Unlock Battle Hub</h3>
                <p className="text-sm text-zinc-400 mb-8 max-w-xs">
                  Pro members can create custom stake challenges, invite friends, and compete in the arena.
                </p>
                <button
                  onClick={handleUnlockPro}
                  className="w-full px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Upgrade to Pro
                </button>
              </div>
            ) : (
              // Actions for Pro Users
              <div className="space-y-6">
                
                {/* Create Card */}
                <div className="group bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-white/[0.07] rounded-3xl p-6 transition-all duration-300 cursor-pointer relative overflow-hidden" onClick={handleCreate}>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center">
                        <Play className="w-5 h-5 text-violet-400 ml-0.5" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-violet-500 group-hover:border-violet-400 transition-all">
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Create Battle</h3>
                    <p className="text-sm text-zinc-400">
                      Set duration and stakes. Generate an invite link to challenge a friend instantly.
                    </p>
                  </div>
                </div>

                {/* Join Card */}
                <div className="group bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.07] rounded-3xl p-6 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Join Battle</h3>
                    <p className="text-sm text-zinc-400 mb-6">
                      Have an invite code? Enter it below to preview the stakes and accept the challenge.
                    </p>

                    <form onSubmit={handleJoin} className="mt-auto flex gap-2">
                      <input
                        type="text"
                        required
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CP-X7K2M"
                        className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors uppercase"
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/20 shrink-0"
                      >
                        Join
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
