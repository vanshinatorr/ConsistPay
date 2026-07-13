import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Target, Plus, Clock, Copy, CheckCircle, Trash2, Trophy } from 'lucide-react';
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
        <div className="relative rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-gradient-to-r dark:from-amber-500/5 dark:via-[#0F0F13]/90 dark:to-[#0F0F13]/90 p-4 md:p-5 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-40 dark:opacity-100" />
          <div className="absolute -left-20 -top-20 w-44 h-44 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 border border-white/[0.04]">
              <Zap className="w-4.5 h-4.5 text-black" />
            </div>
            
            <div className="space-y-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h3 className="text-base font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                  Pending Challenge Invitation
                </h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 tracking-wider uppercase animate-pulse">
                  Waiting for Opponent
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Stakes: <span className="text-zinc-800 dark:text-zinc-200 font-semibold">₹{pendingChallenge.stake}</span> (Refundable) | Duration: <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{pendingChallenge.duration} Days</span>
              </p>
              
              {/* Copy Invite Code Box */}
              <div className="flex items-center gap-2 mt-2 bg-zinc-150/50 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] rounded-lg px-3 py-1.5 w-fit mx-auto md:mx-0">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Code:</span>
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-white tracking-wider">{pendingChallenge.inviteCode}</span>
                <button 
                  onClick={() => handleCopy(pendingChallenge.inviteCode)}
                  className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  title="Copy Invite Code"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
            {/* Timer countdown */}
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20 text-xs font-bold font-mono">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Expires in {formatTime(timeLeft)}</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => navigate('/create-challenge')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-white rounded-xl font-bold border border-zinc-250 dark:border-white/[0.04] transition-all text-xs flex items-center justify-center gap-1.5"
              >
                View Screen
              </button>
              <button
                onClick={handleCancelPending}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-bold border border-rose-500/20 transition-all text-xs flex items-center justify-center gap-1.5"
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
            <h2 className="text-lg font-bold text-zinc-800 dark:text-white flex items-center gap-2">
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
              className="text-[12px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-zinc-250 dark:border-white/[0.04] cursor-pointer active:scale-95 shadow-sm"
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

              if (challengeItem.status === "completed") {
                const isTie = challengeItem.creator.score === challengeItem.opponent.score;
                const iWon = !isTie && ((isCreator && challengeItem.creator.score > challengeItem.opponent.score) || (!isCreator && challengeItem.opponent.score > challengeItem.creator.score));

                return (
                  <div 
                    key={challengeItem.id}
                    className="relative rounded-2xl border border-blue-500/25 dark:border-blue-500/15 bg-gradient-to-r from-blue-500/[0.03] via-transparent to-transparent dark:from-blue-500/[0.02] dark:to-transparent overflow-hidden transition-all duration-300 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
                  >
                    {/* Background subtle mesh glow */}
                    <div className="absolute -left-16 -top-16 w-36 h-36 bg-blue-500/5 rounded-full blur-[50px] pointer-events-none" />

                    {/* Left: Outcome visual and details */}
                    <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        {isTie ? (
                          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        ) : iWon ? (
                          <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                        ) : (
                          <Target className="w-5 h-5 text-zinc-455 dark:text-zinc-400" />
                        )}
                      </div>

                      <div className="space-y-0.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 tracking-wider uppercase">
                            {isTie ? "Battle Tied" : iWon ? "Victory" : "Defeat"}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-450 font-bold">
                            {challengeItem.duration}-Day Challenge
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-zinc-800 dark:text-white tracking-tight flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span>
                            {isTie 
                              ? `You and ${oppData.name || "Opponent"} matched scores!` 
                              : iWon 
                              ? `You defeated ${oppData.name || "Opponent"}!` 
                              : `${oppData.name || "Opponent"} won the battle.`}
                          </span>
                          <span className="hidden sm:inline text-zinc-200 dark:text-white/10 font-normal">|</span>
                          <span className="text-[11px] text-zinc-550 dark:text-zinc-400 font-medium">
                            Final Score: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{myData.score}/{challengeItem.duration}</span> vs <span className="font-semibold text-zinc-700 dark:text-zinc-200">{oppData.score}/{challengeItem.duration}</span>
                          </span>
                        </h4>
                        <p className="text-[11px] font-semibold text-blue-600/90 dark:text-blue-400/80 tracking-tight leading-relaxed pt-0.5">
                          {isTie 
                            ? "Iron sharpens iron. Your collective consistency remains unbroken." 
                            : iWon 
                            ? "Greatness is built in the daily grind. You stayed committed when it mattered." 
                            : "Habits aren’t broken by a single miss; they are rebuilt by showing up next time."}
                        </p>
                      </div>
                    </div>

                    {/* Right: Pool distributed & CTA to rematch/new battle */}
                    <div className="relative z-10 w-full md:w-auto flex flex-row items-center justify-between md:justify-end gap-5 shrink-0 border-t border-zinc-150 dark:border-white/[0.04] md:border-t-0 pt-3 md:pt-0">
                      <div className="flex flex-col md:items-end text-left md:text-right">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Stakes Distributed</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {isTie ? `₹${challengeItem.stake} Refunded` : iWon ? `+₹${challengeItem.pool} Added` : "₹0 Received"}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/create-challenge');
                        }}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        Start New Battle <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={challengeItem.id}
                  onClick={() => navigate(`/battle/${challengeItem.id}`)}
                  className="relative rounded-2xl border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-[#0F0F13] overflow-hidden group cursor-pointer hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col shadow-sm"
                >
                  {/* Top section: Context */}
                  <div className="p-3.5 md:p-4 border-b border-zinc-150 dark:border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-white/[0.01]">
                     <div className="flex items-center gap-3">
                        <div className="w-8.5 h-8.5 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shrink-0">
                           <Target className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                                {challengeItem.status === "completed" ? (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">Completed</span>
                              </div>
                            ) : challengeItem.endDate && new Date(challengeItem.endDate) < new Date() ? (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="flex h-1.5 w-1.5 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Awaiting Sync</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="flex h-1.5 w-1.5 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">Active</span>
                              </div>
                            )}
                           <h3 className="text-sm font-semibold text-zinc-800 dark:text-white">{challengeItem.duration}-Day Consistency Challenge</h3>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4">
                        <div className="flex flex-col sm:items-end">
                          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-0.5">Total Pool</span>
                          <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400">₹{challengeItem.pool}</span>
                        </div>
                        <div className="hidden sm:flex w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] items-center justify-center group-hover:bg-zinc-250 dark:group-hover:bg-white/10 transition-colors">
                           <ArrowRight className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                        </div>
                     </div>
                  </div>

                  {/* Bottom section: Participants & Progress */}
                  <div className="p-3.5 md:p-4 flex flex-col gap-3.5 bg-white dark:bg-transparent">
                     
                     {/* Participant 1 (You) */}
                     <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-white/[0.04] overflow-hidden shrink-0 bg-zinc-100 dark:bg-[#0F0F13] flex items-center justify-center font-bold text-[10px] text-zinc-650 dark:text-zinc-300 uppercase">
                           {myData.name ? myData.name.substring(0, 2) : "ME"}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-zinc-800 dark:text-white flex items-center gap-2">
                                {myData.name || "You"} <span className="text-xs text-zinc-500 font-normal">(You)</span>
                              </span>
                              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{myData.score} / {challengeItem.currentDay} Days</span>
                           </div>
                           <div className="w-full h-1 bg-zinc-150 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500" style={{ width: `${myProgressPercent}%` }} />
                           </div>
                        </div>
                     </div>

                     {/* Participant 2 (Opponent) */}
                     <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full border border-zinc-200 dark:border-white/[0.04] overflow-hidden shrink-0 bg-zinc-100 dark:bg-[#0F0F13] flex items-center justify-center font-bold text-[10px] text-zinc-650 dark:text-zinc-300 uppercase">
                           {oppData.name ? oppData.name.substring(0, 2) : "OP"}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-zinc-800 dark:text-white">{oppData.name || "Opponent"}</span>
                              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{oppData.score} / {challengeItem.currentDay} Days</span>
                           </div>
                           <div className="w-full h-1 bg-zinc-150 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                              <div className="h-full bg-zinc-300 dark:bg-zinc-600 rounded-full transition-all duration-500" style={{ width: `${oppProgressPercent}%` }} />
                           </div>
                        </div>
                     </div>

                      {challengeItem.status === "completed" ? (
                        <div className="mt-1.5 px-3 py-2 bg-blue-500/5 dark:bg-blue-400/5 border border-blue-500/10 dark:border-blue-400/10 rounded-xl text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between shadow-sm">
                          <span>
                            {challengeItem.creator.score === challengeItem.opponent.score ? (
                              "Battle Ended: It's a Tie! Stakes refunded to both wallets."
                            ) : (isCreator ? challengeItem.creator.score > challengeItem.opponent.score : challengeItem.opponent.score > challengeItem.creator.score) ? (
                              "Battle Ended: You Won! Winnings credited to your wallet."
                            ) : (
                              "Battle Ended: Opponent Won. Better luck next time!"
                            )}
                          </span>
                          <span className="text-[9px] uppercase font-bold tracking-wider opacity-85 shrink-0">Resolved</span>
                        </div>
                      ) : challengeItem.endDate && new Date(challengeItem.endDate) < new Date() ? (
                        <div className="mt-1.5 px-3 py-2 bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 dark:border-amber-400/10 rounded-xl text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          The challenge period has ended. The system is waiting for both participants to complete their final synchronization. Payouts will be processed once both sync, or automatically shortly.
                        </div>
                      ) : null}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        !pendingChallenge && (
          <div className="relative rounded-2xl border border-zinc-200 dark:border-white/[0.03] bg-gradient-to-r from-violet-950/5 via-white to-white dark:from-violet-950/10 dark:via-[#0C0D15]/90 dark:to-[#0C0D15]/90 p-4 md:py-3.5 md:px-5 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 group shadow-md dark:shadow-xl">
            {/* Decorative background grid and glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-52 h-52 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/30 to-fuchsia-500/30" />

            {/* Monoline Tortoise & Hare Background Illustration — dark mode only */}
            <div className="absolute right-[20%] md:right-[24%] lg:right-[28%] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden dark:block w-[160px] h-[80px] overflow-hidden">
              <img 
                src="/logo/tortoise-hare.png" 
                alt="Tortoise and Hare Illustration" 
                className="w-full h-full object-contain opacity-30 select-none pointer-events-none" 
              />
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
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-white tracking-tight">
                    Challenge a Friend
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30 tracking-widest uppercase select-none">New</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-normal">
                  Commit to daily coding side-by-side. Winner takes the stakes.
                </p>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-auto shrink-0 flex items-center justify-end gap-4 mt-4 md:mt-0">
              <button 
                onClick={() => navigate('/create-challenge')}
                className="w-full md:w-auto px-4 py-2 rounded-lg font-medium border border-zinc-300 dark:border-white/15 text-zinc-700 dark:text-zinc-200 bg-white dark:bg-white/5 hover:bg-zinc-800 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 hover:border-zinc-800 dark:hover:border-white transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Create Challenge
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      )}

    </div>
  );
}
