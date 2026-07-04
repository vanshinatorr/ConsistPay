import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Target, Plus, Clock, Copy, CheckCircle, Trash2 } from 'lucide-react';
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
        <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-[#0F0F13]/90 to-[#0F0F13]/90 p-4 md:p-5 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-44 h-44 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border border-white/[0.04]">
              <Zap className="w-4.5 h-4.5 text-black" />
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
          <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-550" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="3.5" />
                <path d="M2.5 20.5c0-3.5 3-4.5 5.5-4.5s5.5 1 5.5 4.5" />
                <circle cx="16" cy="9" r="3" />
                <path d="M11 20.5c0-3 2.5-4 5-4s5 1 5 4" />
              </svg>
              Active Challenges
            </h2>
            <button 
              onClick={() => navigate('/create-challenge')} 
              className="text-[12px] font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-white/[0.04]"
            >
              <Plus className="w-3.5 h-3.5" /> New Challenge
            </button>
          </div>

          <div className="flex flex-col gap-3">
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
                  <div className="p-3.5 md:p-4 border-b border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.01]">
                     <div className="flex items-center gap-3">
                        <div className="w-8.5 h-8.5 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shrink-0">
                           <Target className="w-4 h-4 text-violet-400" />
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
                       <div className="hidden sm:flex w-7 h-7 rounded-full bg-white/5 border border-white/[0.04] items-center justify-center group-hover:bg-white/10 transition-colors">
                          <ArrowRight className="w-4 h-4 text-zinc-400" />
                       </div>
                     </div>
                  </div>

                  {/* Bottom section: Participants & Progress */}
                  <div className="p-3.5 md:p-4 flex flex-col gap-3.5">
                     
                     {/* Participant 1 (You) */}
                     <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full border border-white/[0.04] overflow-hidden shrink-0 bg-[#0F0F13] flex items-center justify-center font-bold text-[10px] text-zinc-300 uppercase">
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
                        <div className="w-7 h-7 rounded-full border border-white/[0.04] overflow-hidden shrink-0 bg-[#0F0F13] flex items-center justify-center font-bold text-[10px] text-zinc-300 uppercase">
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
          <div className="relative rounded-2xl border border-white/[0.03] bg-gradient-to-r from-violet-950/10 via-[#0C0D15]/90 to-[#0C0D15]/90 p-4 md:py-3.5 md:px-5 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 group shadow-xl">
            {/* Decorative background grid and glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-52 h-52 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/30 to-fuchsia-500/30" />

            {/* Monoline Tortoise & Hare Background Illustration */}
            <div className="absolute right-[22%] md:right-[26%] lg:right-[30%] top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.40] group-hover:opacity-[0.75] transition-opacity duration-500 hidden sm:block">
              <svg width="150" height="72" viewBox="0 0 150 72" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="text-white">
                {/* 🐢 TORTOISE (Left) */}
                <g transform="translate(4, 20)">
                  {/* Outer Shell */}
                  <path d="M 6,24 C 6,10 18,6 34,6 C 50,6 62,10 62,24 Z" />
                  {/* Inner Shell Patterns (Monoline plates) */}
                  <path d="M 17,24 C 17,16 23,12 34,12 C 45,12 51,16 51,24" />
                  <path d="M 12,20 C 14,14 19,10 23,8" />
                  <path d="M 56,20 C 54,14 49,10 45,8" />
                  {/* Bottom rim */}
                  <path d="M 6,24 L 62,24" />
                  {/* Head & Neck */}
                  <path d="M 62,20 C 65,18 70,16 75,17.5 C 80,19 82.5,23.5 80.5,26.5 C 78.5,29.5 73.5,30 67,27.5 L 62,24" />
                  {/* Front Foot */}
                  <path d="M 52,24 C 50,28 49,32 53,34 C 57,35 60,33.5 60,29" />
                  {/* Back Foot */}
                  <path d="M 16,24 C 14,28 13,32 17,34 C 21,35 24,33.5 24,29" />
                  {/* Little center foot/feet/tail */}
                  <path d="M 34,24 C 33,28 32,32 35,34 C 38,34.5 40,33 40,29" />
                  <path d="M 6,21 C 3,21.5 2,23 3.5,24" />
                </g>

                {/* 🐇 HARE (Right) */}
                <g transform="translate(86, 8)">
                  {/* Leaping ears */}
                  <path d="M 22,12 C 16,7 10,7 8.5,10 C 7,13 13,16 20,17.5" />
                  <path d="M 18,9.5 C 13,5 7,5 5.5,8 C 4,11 10,13.5 16,15" />
                  {/* Head & Nose */}
                  <path d="M 20,17.5 C 24,19.5 28,21.5 32,24.5 C 34.5,26.5 34.5,29 32.5,30.5 C 29.5,32 25,27.5 22,25.5" />
                  {/* Body arch */}
                  <path d="M 22,25.5 C 17,25.5 12,22 8,24 C 5.5,25.5 6,29.5 7,33.5" />
                  {/* Folded Leaping Back Foot */}
                  <path d="M 8,24 C 5,25 2,30 3,34 C 4,37 7,37 9.5,32.5 C 12,27.5 12.5,25.5 13,24" />
                  {/* Extended Leaping Front Foot */}
                  <path d="M 22,25.5 C 25,29 28,36 26.5,40 C 25.5,42.5 23,41.5 22,39 C 21,36.5 18,31 17,29.5" />
                  {/* Small tail */}
                  <path d="M 3.5,26.5 C 2,27 2,29.5 3.5,30.5" />
                </g>
              </svg>
            </div>

            <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20 border border-white/[0.04]">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="3.5" />
                  <path d="M2.5 20.5c0-3.5 3-4.5 5.5-4.5s5.5 1 5.5 4.5" />
                  <circle cx="16" cy="9" r="3" />
                  <path d="M11 20.5c0-3 2.5-4 5-4s5 1 5 4" />
                </svg>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Challenge a Friend
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/30 tracking-widest uppercase select-none">New</span>
                </div>
                <p className="text-xs text-zinc-450 leading-normal">
                  Commit to daily coding side-by-side. Winner takes the stakes.
                </p>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center justify-end gap-4 mt-4 md:mt-0">
              <button 
                onClick={() => navigate('/create-challenge')}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl text-sm"
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
