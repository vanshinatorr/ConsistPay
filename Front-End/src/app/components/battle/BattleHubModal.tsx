import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, Lock, Trophy, Users, ShieldAlert, Sparkles, 
  Plus, ArrowRight, Zap, Target, TrendingUp, ShieldCheck, Flame
} from "lucide-react";

interface BattleHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: string;
}

type TabType = "actions" | "active" | "stats";

export function BattleHubModal({ isOpen, onClose, plan = "free" }: BattleHubModalProps) {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("actions");
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [historyChallenges, setHistoryChallenges] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState("");
  
  const isPro = plan.toLowerCase() === "pro";
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!isOpen || !isPro) return;

    const fetchBattles = async () => {
      setLoadingStats(true);
      setError("");
      try {
        const [activeRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/challenges/active`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/challenges/history`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (activeRes.ok && historyRes.ok) {
          const activeData = await activeRes.json();
          const historyData = await historyRes.json();
          setActiveChallenges(activeData);
          setHistoryChallenges(historyData);
        } else {
          setError("Failed to load battle statistics.");
        }
      } catch (err) {
        setError("Network error. Could not fetch battles.");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchBattles();
  }, [isOpen, isPro]);

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

  // Calculate dynamic stats
  const totalWins = historyChallenges.filter(c => c.outcome === "WON").length;
  const winRate = historyChallenges.length > 0 ? Math.round((totalWins / historyChallenges.length) * 100) : 0;
  const totalStakesEarned = historyChallenges.reduce((sum, c) => sum + (c.payoutChange || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#060608]/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0D0D10]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {isPro ? "Battle Hub" : "Friend Challenges"}
            </h2>
            {!isPro && (
              <span className="text-[10px] bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> PRO ONLY
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto relative z-10 space-y-6 flex-1 custom-scrollbar">
          
          {/* ======================================================== */}
          {/* CASE 1: FREE / NON-PRO USER VIEW                         */}
          {/* ======================================================== */}
          {!isPro && (
            <div className="space-y-6">
              
              {/* Hero Banner */}
              <div className="text-center py-4">
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">
                  Consistency becomes easier when <br />
                  <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                    someone is counting on you.
                  </span>
                </h3>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  ConsistPay Battles leverage social accountability and commitment contract psychology to prevent you from slacking.
                </p>
              </div>

              {/* Psychology Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex gap-3">
                  <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Commitment Contracts</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Lock in stakes against a friend. Behavioral psychology shows putting skin in the game increases task completion by 3x.
                    </p>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">AI Screenshot Verification</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      No honor system. Upload code screenshots; our Gemini AI validates proof automatically as the single source of truth.
                    </p>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Pure Consistency Wars</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      No contest ratings or problem difficulty points. The winner is decided solely by who shows up and submits proof daily.
                    </p>
                  </div>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex gap-3">
                  <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Grace Coin Safeguards</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Life happens. Auto-save missed days using your Grace Coins so you stay in the battle even when emergencies hit.
                    </p>
                  </div>
                </div>

              </div>

              {/* Locked Preview */}
              <div className="border border-white/5 bg-white/2 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#0D0D10]/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="text-center px-4 py-2 bg-zinc-950/80 border border-white/10 rounded-lg flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs font-semibold text-zinc-300">Unlock Battle Dashboard with Pro</span>
                  </div>
                </div>
                <div className="opacity-20 pointer-events-none filter blur-[1px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">Active Battles (2)</span>
                    <span className="text-zinc-500">History</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex justify-between">
                    <div>
                      <div className="font-bold text-xs">vs Alex Kumar</div>
                      <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1.5"><div className="w-1/2 h-full bg-violet-500 rounded-full"></div></div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-orange-400">Day 5/15</div>
                      <div className="text-[10px] text-zinc-500">Pool: ₹1000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlock Pro CTA */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleUnlockPro}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  Unlock Friend Challenges with Pro
                </button>
                <p className="text-zinc-500 text-xs mt-2.5">
                  Get full access to battles, analytics, and custom stakes.
                </p>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* CASE 2: PRO USER VIEW                                    */}
          {/* ======================================================== */}
          {isPro && (
            <div className="space-y-6">
              
              {/* Tab Selector */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                {[
                  { id: "actions", label: "Create & Join", icon: Plus },
                  { id: "active", label: "Active Battles", icon: Flame },
                  { id: "stats", label: "Battle Stats", icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all
                        ${isActive
                          ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                          : "text-zinc-400 hover:text-white"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="min-h-[220px]">
                
                {/* --- SUB-TAB 1: CREATE & JOIN --- */}
                {activeTab === "actions" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Create Card */}
                    <div className="relative group rounded-2xl bg-white/3 border border-white/5 hover:border-violet-500/30 p-5 flex flex-col justify-between transition-all duration-300 hover:bg-white/5">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                          <Plus className="w-5 h-5 text-violet-400" />
                        </div>
                        <h4 className="font-bold text-white text-base">Create Challenge</h4>
                        <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                          Start a custom consistency battle with a friend. Set your own duration, stake amount, and invite them instantly.
                        </p>
                      </div>
                      <button
                        onClick={handleCreate}
                        className="mt-6 w-full py-2.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white text-xs transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5"
                      >
                        Create Challenge <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Join Card */}
                    <div className="relative group rounded-2xl bg-white/3 border border-white/5 hover:border-emerald-500/30 p-5 flex flex-col justify-between transition-all duration-300 hover:bg-white/5">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                          <Users className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="font-bold text-white text-base">Join Challenge</h4>
                        <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                          Got an invite code from a friend? Enter it below to review their challenge terms and lock in your commitment.
                        </p>
                      </div>

                      <form onSubmit={handleJoin} className="mt-4 space-y-2">
                        <input
                          type="text"
                          required
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          placeholder="Enter Invite Code (e.g. CP-X7K)"
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                        >
                          Join Challenge <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {/* --- SUB-TAB 2: ACTIVE BATTLES --- */}
                {activeTab === "active" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {loadingStats && (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-zinc-500 text-xs">Loading active battles...</p>
                      </div>
                    )}

                    {!loadingStats && error && (
                      <p className="text-red-400 text-xs text-center">{error}</p>
                    )}

                    {!loadingStats && !error && activeChallenges.length === 0 && (
                      <div className="text-center py-8 bg-white/2 border border-white/5 rounded-xl">
                        <p className="text-zinc-500 text-xs">No active consistency battles.</p>
                        <button
                          onClick={() => setActiveTab("actions")}
                          className="mt-3 text-xs text-violet-400 hover:underline"
                        >
                          Start one now →
                        </button>
                      </div>
                    )}

                    {!loadingStats && !error && activeChallenges.map((ch) => {
                      const opponent = ch.userRole === "creator" ? ch.opponent : ch.creator;
                      const userScore = ch.userRole === "creator" ? ch.creator.score : ch.opponent.score;
                      const oppScore = ch.userRole === "creator" ? ch.opponent.score : ch.creator.score;
                      const progressPercentage = Math.round((ch.currentDay / ch.duration) * 100);
                      const oppAvatar = opponent.name ? opponent.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "??";

                      return (
                        <div key={ch.id} className="relative bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                              {oppAvatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">vs {opponent.name}</span>
                                <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">Active</span>
                              </div>
                              <div className="text-zinc-400 text-xs mt-1">
                                Your Score: {userScore} / {ch.currentDay} days • Opponent: {oppScore} / {ch.currentDay} days
                              </div>
                              <div className="w-32 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-xs text-zinc-400">Day {ch.currentDay} of {ch.duration}</div>
                            <div className="text-xs font-bold text-yellow-400 mt-1">Stakes: ₹{ch.pool} Pool</div>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                )}

                {/* --- SUB-TAB 3: BATTLE STATS --- */}
                {activeTab === "stats" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* Stats Blocks */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/3 border border-white/5 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-emerald-400">{winRate}%</div>
                        <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Win Rate</div>
                      </div>
                      <div className="bg-white/3 border border-white/5 rounded-xl p-3 text-center">
                        <div className={`text-xl font-bold ${totalStakesEarned >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {totalStakesEarned >= 0 ? "+" : ""}₹{totalStakesEarned}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Stakes Earned</div>
                      </div>
                      <div className="bg-white/3 border border-white/5 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-violet-400">{historyChallenges.length + activeChallenges.length}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">Total Battles</div>
                      </div>
                    </div>

                    {/* Battle History List */}
                    <div className="space-y-2">
                      <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">History</p>
                      
                      {loadingStats && (
                        <div className="text-center py-4">
                          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                      )}

                      {!loadingStats && error && (
                        <p className="text-red-400 text-xs text-center">{error}</p>
                      )}

                      {!loadingStats && !error && historyChallenges.length === 0 && (
                        <p className="text-zinc-500 text-xs text-center py-4 bg-white/2 rounded-xl">No completed battles in history.</p>
                      )}

                      {!loadingStats && !error && historyChallenges.map((ch) => (
                        <div key={ch.id} className="bg-white/2 border border-white/5 rounded-lg p-3 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${ch.outcome === "WON" ? "text-emerald-400" : ch.outcome === "LOST" ? "text-red-400" : "text-zinc-400"}`}>
                              {ch.outcome}
                            </span>
                            <span className="text-zinc-300">vs {ch.opponentName} ({ch.duration} Days)</span>
                          </div>
                          <span className={`font-bold ${ch.payoutChange > 0 ? "text-emerald-400" : ch.payoutChange < 0 ? "text-red-400" : "text-zinc-400"}`}>
                            {ch.payoutChange > 0 ? "+" : ""}₹{ch.payoutChange}
                          </span>
                        </div>
                      ))}

                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Footer (Common Info) */}
        <div className="p-4 bg-white/2 border-t border-white/5 text-center shrink-0 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 relative z-10">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>Daily deadline for all active battles is 11:59 PM IST. Grace Coins apply.</span>
        </div>

      </div>
    </div>
  );
}
