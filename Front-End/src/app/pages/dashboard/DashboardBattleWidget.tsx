import React, { useState, useEffect } from 'react';
import { Swords, ArrowRight, Zap, Target, Plus, Clock, Copy, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardBattleWidgetProps {
  onRefreshRequest?: () => void;
}

export function DashboardBattleWidget({ onRefreshRequest }: DashboardBattleWidgetProps) {
  const navigate = useNavigate();
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [pendingChallenge, setPendingChallenge] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchChallenges = async () => {
    try {
      // 1. Fetch pending challenge
      const pendingRes = await fetch(`${API_URL}/api/challenges/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingChallenge(pendingData);
      } else {
        setPendingChallenge(null);
      }

      // 2. Fetch active challenges
      const activeRes = await fetch(`${API_URL}/api/challenges/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activeRes.ok) {
        const activeData = await activeRes.json();
        setActiveChallenges(activeData);
      }
    } catch (err) {
      console.error("Failed to fetch challenges on dashboard widget:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    // Poll active challenges every 15 seconds to check if opponent accepted
    const pollActive = setInterval(fetchChallenges, 15000);
    return () => clearInterval(pollActive);
  }, []);

  // Timer countdown for pending challenge
  useEffect(() => {
    if (!pendingChallenge) return;
    
    const createdTime = new Date(pendingChallenge.createdAt).getTime();
    const elapsed = Math.floor((Date.now() - createdTime) / 1000);
    const remaining = Math.max(0, 300 - elapsed);
    setTimeLeft(remaining);

    if (remaining <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          fetchChallenges(); // Fetch again to remove expired challenge
          if (onRefreshRequest) onRefreshRequest(); // Refresh wallet
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingChallenge]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelPending = async () => {
    if (!window.confirm("Are you sure you want to cancel this challenge? Your stakes and entry fee will be fully refunded to your wallet.")) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/challenges/cancel-pending`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPendingChallenge(null);
        fetchChallenges();
        if (onRefreshRequest) onRefreshRequest();
      } else {
        alert("Failed to cancel challenge. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading && activeChallenges.length === 0 && !pendingChallenge) {
    return (
      <div className="w-full bg-white/5 border border-white/[0.04] rounded-2xl p-6 text-center animate-pulse mb-6">
        <span className="text-sm text-zinc-400">Loading challenges...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      
      {/* ─── PENDING CHALLENGE BANNER ─── */}
      {pendingChallenge && timeLeft > 0 && (
        <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-[#0F0F13]/90 to-[#0F0F13]/90 p-5 md:p-6 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-44 h-44 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border border-white/[0.04]">
              <Zap className="w-5 h-5 text-black" />
            </div>
            
            <div className="space-y-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h3 className="text-base font-extrabold text-amber-400 tracking-tight">
                  Pending Challenge Invitation
                </h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/20 tracking-wider uppercase animate-pulse">
                  Waiting for Opponent
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Stakes: <span className="text-zinc-200 font-semibold">₹{pendingChallenge.stake}</span> (Refundable) | Duration: <span className="text-zinc-200 font-semibold">{pendingChallenge.duration} Days</span>
              </p>
              
              {/* Copy Invite Code Box */}
              <div className="flex items-center gap-2 mt-2 bg-white/5 border border-white/[0.04] rounded-lg px-3 py-1.5 w-fit mx-auto md:mx-0">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Code:</span>
                <span className="text-xs font-mono font-bold text-white tracking-wider">{pendingChallenge.inviteCode}</span>
                <button 
                  onClick={() => handleCopy(pendingChallenge.inviteCode)}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Copy Invite Code"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
            {/* Timer countdown */}
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20 text-xs font-bold font-mono">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Expires in {formatTime(timeLeft)}</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => navigate('/create-challenge')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/[0.04] transition-all text-xs flex items-center justify-center gap-1.5"
              >
                View Screen
              </button>
              <button
                onClick={handleCancelPending}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl font-bold border border-rose-500/20 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ACTIVE CHALLENGES LIST ─── */}
      {activeChallenges.length > 0 ? (
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-zinc-400" />
              Active Challenges
            </h2>
            <button 
              onClick={() => navigate('/create-challenge')} 
              className="text-[12px] font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-white/[0.04]"
            >
              <Plus className="w-3.5 h-3.5" /> New Challenge
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {activeChallenges.map((challengeItem) => {
              const isCreator = challengeItem.userRole === "creator";
              const myData = isCreator ? challengeItem.creator : challengeItem.opponent;
              const oppData = isCreator ? challengeItem.opponent : challengeItem.creator;
              
              const myProgressPercent = Math.min(100, Math.round((myData.score / challengeItem.duration) * 100));
              const oppProgressPercent = Math.min(100, Math.round((oppData.score / challengeItem.duration) * 100));

              return (
                <div 
                  key={challengeItem.id}
                  onClick={() => navigate(`/battle/${challengeItem.id}`)}
                  className="relative rounded-2xl border border-white/[0.04] bg-[#0F0F13] overflow-hidden group cursor-pointer hover:border-white/10 transition-all duration-300 flex flex-col"
                >
                  {/* Top section: Context */}
                  <div className="p-4 md:p-5 border-b border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.01]">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shrink-0">
                           <Target className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className="flex h-1.5 w-1.5 relative">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                             </span>
                             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                           </div>
                           <h3 className="text-sm font-semibold text-white">{challengeItem.duration}-Day Consistency Challenge</h3>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4">
                       <div className="flex flex-col sm:items-end">
                         <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-0.5">Total Pool</span>
                         <span className="text-sm font-bold text-emerald-400">₹{challengeItem.pool}</span>
                       </div>
                       <div className="hidden sm:flex w-8 h-8 rounded-full bg-white/5 border border-white/[0.04] items-center justify-center group-hover:bg-white/10 transition-colors">
                          <ArrowRight className="w-4 h-4 text-zinc-400" />
                       </div>
                     </div>
                  </div>

                  {/* Bottom section: Participants & Progress */}
                  <div className="p-4 md:p-5 flex flex-col gap-5">
                     
                     {/* Participant 1 (You) */}
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-white/[0.04] overflow-hidden shrink-0 bg-[#0F0F13] flex items-center justify-center font-bold text-[10px] text-zinc-300 uppercase">
                           {myData.name ? myData.name.substring(0, 2) : "ME"}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-white flex items-center gap-2">
                                {myData.name || "You"} <span className="text-xs text-zinc-500 font-normal">(You)</span>
                              </span>
                              <span className="text-xs font-semibold text-zinc-400">{myData.score} / {challengeItem.currentDay} Days</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${myProgressPercent}%` }} />
                           </div>
                        </div>
                     </div>

                     {/* Participant 2 (Opponent) */}
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-white/[0.04] overflow-hidden shrink-0 bg-[#0F0F13] flex items-center justify-center font-bold text-[10px] text-zinc-300 uppercase">
                           {oppData.name ? oppData.name.substring(0, 2) : "OP"}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-white">{oppData.name || "Opponent"}</span>
                              <span className="text-xs font-semibold text-zinc-400">{oppData.score} / {challengeItem.currentDay} Days</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${oppProgressPercent}%` }} />
                           </div>
                        </div>
                     </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        !pendingChallenge && (
          <div className="relative rounded-2xl border border-white/[0.04] bg-gradient-to-r from-violet-950/10 via-[#0F0F13]/90 to-[#0F0F13]/90 p-6 md:p-8 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group shadow-2xl">
            {/* Decorative background grid and glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-52 h-52 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/30 to-fuchsia-500/30" />

            <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20 border border-white/[0.04]">
                <Swords className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    Challenge a Friend
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 tracking-widest uppercase">New</span>
                </div>
                <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                  Commit to daily consistency side-by-side. The winner takes the entire stakes pool.
                </p>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center justify-end gap-4 mt-4 md:mt-0">
              <button 
                onClick={() => navigate('/create-challenge')}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl text-sm"
              >
                Create Challenge
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      )}

    </div>
  );
}
