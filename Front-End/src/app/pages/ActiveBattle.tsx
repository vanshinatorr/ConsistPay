import { Code2, ArrowLeft, Trophy, Zap, Clock, ShieldAlert, Sparkles, CheckCircle, XCircle, Lock, Swords, Sword, AlertCircle, Filter } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ActiveBattle() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "1v1 Battle Arena | ConsistPay";
  }, []);

  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  const toggleDayExpand = (dayNumber: number) => {
    setExpandedDays(prev => ({ ...prev, [dayNumber]: !prev[dayNumber] }));
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccess(true);
    }
  }, []);

  const fetchChallenge = async () => {
    try {
      const res = await fetch(`${API_URL}/api/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to load challenge.");
        return;
      }
      setChallenge(data);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchChallenge();
    const pollInterval = setInterval(() => {
      if (id) fetchChallenge();
    }, 10000);
    return () => clearInterval(pollInterval);
  }, [id]);

  const handleDismissSuccess = () => {
    setShowSuccess(false);
    const newUrl = window.location.pathname;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0D0D0F] flex items-center justify-center text-zinc-800 dark:text-white">
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Loading Battle Arena...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen text-zinc-900 dark:text-white bg-zinc-50 dark:bg-[#0D0D0F]">
        <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-white/[0.04] bg-white/80 dark:bg-[#0D0D0F]/80 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.04] rounded-3xl p-8 text-center space-y-6 shadow-xl">
            <div className="flex justify-center">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Challenge Not Found</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{error || "This challenge doesn't exist or you don't have access."}</p>
            <div className="pt-4">
              <Link to="/dashboard" className="block w-full py-3.5 rounded-xl font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    status,
    duration = 30,
    pool,
    startDate,
    endDate,
    creator,
    opponent,
    userRole,
    currentDay = 1,
    grid = [],
    feed = []
  } = challenge;

  const isCreator = userRole === "creator";
  const myData = isCreator ? creator : (opponent || { name: "Waiting...", score: 0, streak: 0, avatar: null });
  const oppData = isCreator ? (opponent || { name: "Waiting...", score: 0, streak: 0, avatar: null }) : creator;

  const myAvatar = myData.name ? myData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "ME";
  const oppAvatar = oppData.name ? oppData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "OP";

  const progressPercentage = Math.min(100, Math.round((currentDay / duration) * 100));

  // Lead status message calculation
  let leadText = "";
  let leadColor = "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (myData.score === oppData.score) {
    leadText = "Tied Score";
    leadColor = "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10";
  } else if (myData.score > oppData.score) {
    const diff = myData.score - oppData.score;
    leadText = `You Lead (+${diff})`;
    leadColor = "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  } else {
    const diff = oppData.score - myData.score;
    leadText = `${oppData.name} Leads (+${diff})`;
    leadColor = "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20";
  }

  // Filter grid items (show active & past days by default to prevent endless scrolling)
  const displayGrid = grid.filter((item: any) => {
    if (showAllDays) return true;
    return item.dayNumber <= Math.min(currentDay + 1, duration);
  });

  const getPlatformBadge = (platform?: string) => {
    const p = (platform || "").toLowerCase();
    if (p === 'leetcode' || p === 'lc') return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 rounded border border-amber-500/20 shrink-0">LC</span>;
    if (p === 'geeksforgeeks' || p === 'gfg') return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 rounded border border-emerald-500/20 shrink-0">GFG</span>;
    if (p === 'code360' || p === 'c360') return <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-blue-500 bg-blue-500/10 rounded border border-blue-500/20 shrink-0">C360</span>;
    return null;
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white bg-zinc-50 dark:bg-[#0D0D0F] pb-16">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-white/[0.04] bg-white/80 dark:bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-550 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none hidden dark:block"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white hidden sm:block">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border uppercase tracking-wider
                ${status === 'active' || status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 
                  status === 'completed' || status === 'COMPLETED' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' : 
                  'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/[0.04] text-zinc-500'}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 relative z-10">

        {/* ─── PROFESSIONAL BATTLE ARENA MATCHUP BOARD ─── */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-[#0B0C10] p-6 sm:p-8 shadow-sm">
          
          {/* Top Bar inside Board */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                1v1 Duel Arena — Day {currentDay} of {duration}
              </span>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${leadColor}`}>
              {leadText}
            </span>
          </div>

          {/* Main 1v1 Clash Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Player 1 (You) */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-sm shrink-0">
                {myData.avatar?.startsWith("http") ? (
                  <img src={myData.avatar} alt={myData.name} className="w-full h-full object-cover rounded-full" />
                ) : myAvatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white truncate">{myData.name || "You"}</h3>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">{myData.score}</span>
                  <span className="text-xs text-zinc-500">/ {duration} Solved</span>
                </div>
              </div>
            </div>

            {/* Center Prize Pool */}
            <div className="flex flex-col items-center justify-center py-4 md:py-0 border-y md:border-y-0 md:border-x border-zinc-100 dark:border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <Trophy className="w-3.5 h-3.5" /> Total Stakes
              </span>
              <div className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                ₹{pool}
              </div>
              <span className="text-[11px] text-zinc-400 font-medium mt-1">Winner Takes All</span>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex items-center gap-4 flex-row-reverse text-right">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-xl text-white dark:text-black shadow-sm shrink-0">
                {oppData.avatar?.startsWith("http") ? (
                  <img src={oppData.avatar} alt={oppData.name} className="w-full h-full object-cover rounded-full" />
                ) : oppAvatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-end gap-2">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white truncate">{oppData.name}</h3>
                </div>
                <div className="mt-1 flex items-baseline justify-end gap-1.5">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white">{oppData.score}</span>
                  <span className="text-xs text-zinc-500">/ {duration} Solved</span>
                </div>
              </div>
            </div>

          </div>

          {/* Integrated Progress Bar */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              <span>Timeline Progress</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">{progressPercentage}% Completed ({duration - currentDay} days remaining)</span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

        </div>

        {/* ─── 1V1 DUEL TIMELINE TRACK ─── */}
        <div className="bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-white/5">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">1v1 Consistency Duel Track</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Day-by-day comparison of verified solves</p>
            </div>

            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-250 dark:border-white/[0.04] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span>{showAllDays ? "Show Active Only" : "Show All 30 Days"}</span>
            </button>
          </div>

          {/* Clean 3-Column Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 pb-3 mb-2 text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 dark:border-white/5 px-3">
            <div className="col-span-5 flex items-center gap-2">
              <span>{myData.name || "You"}</span>
            </div>
            <div className="col-span-2 text-center">
              <span>Timeline</span>
            </div>
            <div className="col-span-5 flex items-center justify-end gap-2 text-right">
              <span>{oppData.name}</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-white/5 pt-1">
            {displayGrid.map((dayItem: any) => {
              const myStatus = isCreator ? dayItem.creatorStatus : dayItem.opponentStatus;
              const myProblem = isCreator ? dayItem.creatorProblem : dayItem.opponentProblem;
              const oppStatus = isCreator ? dayItem.opponentStatus : dayItem.creatorStatus;
              const oppProblem = isCreator ? dayItem.opponentProblem : dayItem.creatorProblem;
              const isCurrent = dayItem.dayNumber === currentDay;

              const mySolves: any[] = isCreator ? (dayItem.creatorSolves || []) : (dayItem.opponentSolves || []);
              const oppSolves: any[] = isCreator ? (dayItem.opponentSolves || []) : (dayItem.creatorSolves || []);
              
              const myMoreCount = mySolves.length > 1 ? mySolves.length - 1 : 0;
              const oppMoreCount = oppSolves.length > 1 ? oppSolves.length - 1 : 0;
              const hasMultipleSolves = myMoreCount > 0 || oppMoreCount > 0;
              const isExpanded = !!expandedDays[dayItem.dayNumber];

              return (
                <div
                  key={dayItem.dayNumber}
                  onClick={() => hasMultipleSolves && toggleDayExpand(dayItem.dayNumber)}
                  className={`py-2.5 px-3 rounded-xl transition-all grid grid-cols-1 md:grid-cols-12 gap-3 items-center ${
                    isCurrent
                      ? "bg-emerald-500/[0.04] dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 my-1 shadow-xs"
                      : "hover:bg-zinc-100/60 dark:hover:bg-white/[0.02]"
                  } ${hasMultipleSolves ? "cursor-pointer" : ""}`}
                >
                  {/* Left: You */}
                  <div className="md:col-span-5 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {myStatus === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : myStatus === "missed" ? (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : myStatus === "pending" ? (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}

                      <div className="min-w-0 flex items-center gap-2">
                        {myStatus === "completed" ? (
                          <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate" title={myProblem}>
                            {myProblem || "Verified Solve"}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400">{myStatus === "missed" ? "Missed Day" : myStatus === "pending" ? "Waiting sync..." : "Locked"}</span>
                        )}
                        {myStatus === "completed" && getPlatformBadge(myProblem?.platform || dayItem.creatorPlatform || dayItem.opponentPlatform)}
                        
                        {myMoreCount > 0 && !isExpanded && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 shrink-0">
                            +{myMoreCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sub-thread for additional solves (if expanded or multiple) */}
                    {isExpanded && mySolves.length > 1 && (
                      <div className="pl-6.5 mt-1.5 space-y-1 animate-in fade-in duration-150">
                        {mySolves.slice(1).map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                            <span className="text-zinc-400 font-mono text-[10px] shrink-0">↳</span>
                            <span className="truncate">{s.problemName}</span>
                            {getPlatformBadge(s.platform)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Center: Day Pill */}
                  <div className="md:col-span-2 flex items-center justify-center self-start md:self-center py-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border transition-colors ${
                      isCurrent
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400"
                    }`}>
                      Day {dayItem.dayNumber}
                    </span>
                  </div>

                  {/* Right: Opponent */}
                  <div className="md:col-span-5 flex flex-col justify-center min-w-0 text-left md:text-right">
                    <div className="flex items-center justify-start md:justify-end gap-2.5 min-w-0">
                      <div className="min-w-0 flex items-center gap-2">
                        {oppMoreCount > 0 && !isExpanded && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 shrink-0">
                            +{oppMoreCount}
                          </span>
                        )}
                        {oppStatus === "completed" && getPlatformBadge(oppProblem?.platform || dayItem.opponentPlatform || dayItem.creatorPlatform)}
                        {oppStatus === "completed" ? (
                          <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate" title={oppProblem}>
                            {oppProblem || "Verified Solve"}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400">{oppStatus === "missed" ? "Missed Day" : oppStatus === "pending" ? "Waiting sync..." : "Locked"}</span>
                        )}
                      </div>

                      {oppStatus === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : oppStatus === "missed" ? (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : oppStatus === "pending" ? (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}
                    </div>

                    {/* Sub-thread for opponent additional solves */}
                    {isExpanded && oppSolves.length > 1 && (
                      <div className="pr-6.5 mt-1.5 space-y-1 animate-in fade-in duration-150">
                        {oppSolves.slice(1).map((s: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-start md:justify-end gap-2 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                            {getPlatformBadge(s.platform)}
                            <span className="truncate">{s.problemName}</span>
                            <span className="text-zinc-400 font-mono text-[10px] shrink-0">↲</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ─── SUCCESS OVERLAY MODAL ─── */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0F1017] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-45 border border-white/20 relative z-10">
                <Swords className="w-8 h-8 text-white -rotate-45" />
              </div>
            </div>

            <h2 className="text-3xl font-black mb-1 text-zinc-900 dark:text-white tracking-tight">
              CHALLENGE IS LIVE!
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
              Your consistency duel with <strong className="text-zinc-900 dark:text-white">{oppData.name}</strong> has officially started!
            </p>

            <button
              onClick={handleDismissSuccess}
              className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <Sword className="w-4 h-4" />
              <span>Enter the Arena</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
