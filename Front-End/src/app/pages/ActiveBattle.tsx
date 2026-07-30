import { Code2, ArrowLeft, Trophy, Zap, Clock, ShieldAlert, Sparkles, CheckCircle, XCircle, Lock, Swords, Sword, AlertCircle, Filter } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ActiveBattle() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Active Battle Arena | ConsistPay";
  }, []);

  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAllDays, setShowAllDays] = useState(false);

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

  // Determine Comparison Lead Status Message
  let leadMessage = "";
  let leadStyle = "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300";
  let leadIcon = <AlertCircle className="w-4 h-4" />;

  if (status === "active" || status === "ACTIVE") {
    if (myData.score === oppData.score) {
      leadMessage = "It's a Tie! Both coders have matched scores. Solve today to take the lead!";
      leadStyle = "bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-300";
      leadIcon = <Swords className="w-4 h-4 text-violet-500" />;
    } else if (myData.score > oppData.score) {
      const diff = myData.score - oppData.score;
      leadMessage = `You are leading by ${diff} point${diff > 1 ? "s" : ""}! Keep up the momentum.`;
      leadStyle = "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300";
      leadIcon = <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />;
    } else {
      const diff = oppData.score - myData.score;
      leadMessage = `${oppData.name} is leading by ${diff} point${diff > 1 ? "s" : ""}. Push harder to catch up!`;
      leadStyle = "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300";
      leadIcon = <Sparkles className="w-4 h-4 text-rose-500" />;
    }
  } else if (status === "completed" || status === "COMPLETED") {
    if (myData.score === oppData.score) {
      leadMessage = "Challenge Completed: It's a Tie! Stakes refunded to both wallets.";
      leadStyle = "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300";
      leadIcon = <Trophy className="w-4 h-4 text-blue-500" />;
    } else if (myData.score > oppData.score) {
      leadMessage = "Victory! You defeated your opponent and claimed the entire prize pool!";
      leadStyle = "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300";
      leadIcon = <Trophy className="w-4 h-4 text-amber-500" />;
    } else {
      leadMessage = `Challenge Completed. ${oppData.name} claimed the victory. Rebuild your streak for the next duel!`;
      leadStyle = "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400";
      leadIcon = <ShieldAlert className="w-4 h-4" />;
    }
  }

  // Filter grid items (show active & past days by default to prevent endless scrolling)
  const displayGrid = grid.filter((item: any) => {
    if (showAllDays) return true;
    return item.dayNumber <= Math.min(currentDay + 1, duration);
  });

  const getPlatformBadge = (platform?: string) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("leetcode")) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-400">LeetCode</span>;
    }
    if (p.includes("geeks") || p.includes("gfg")) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">GeeksforGeeks</span>;
    }
    if (p.includes("code360")) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-700 dark:text-orange-400">Code360</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/20 text-violet-700 dark:text-violet-400">DSA Solve</span>;
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white bg-zinc-50 dark:bg-[#0D0D0F] pb-16">
      
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] dark:opacity-100 opacity-30" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] dark:opacity-100 opacity-30" />
      </div>

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

        {/* Lead Alert Banner */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${leadStyle}`}>
          <div className="p-2 rounded-xl bg-white/20 dark:bg-white/10 shrink-0">
            {leadIcon}
          </div>
          <p className="text-xs sm:text-sm font-bold tracking-tight">{leadMessage}</p>
        </div>

        {/* ─── 1V1 MATCHUP HERO CARD ─── */}
        <div className="relative rounded-2xl border border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-[#0B0C10] p-6 sm:p-8 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Contender: You */}
            <div className="bg-zinc-50 dark:bg-[#0F0F13] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-md shrink-0">
                  {myData.avatar?.startsWith("http") ? (
                    <img src={myData.avatar} alt={myData.name} className="w-full h-full object-cover rounded-full" />
                  ) : myAvatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white truncate">{myData.name || "You"}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Contender (You)</p>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-zinc-200 dark:border-white/5">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Score</span>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">
                  {myData.score} <span className="text-sm font-medium text-zinc-500">/ {duration}</span>
                </div>
              </div>
            </div>

            {/* VS & Prize Pool Center */}
            <div className="flex flex-col items-center justify-center py-2 md:py-0">
              <div className="text-center mb-3">
                <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1 mb-0.5">
                  <Trophy className="w-3.5 h-3.5" /> Prize Pool
                </span>
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-yellow-300 dark:to-yellow-500 bg-clip-text text-transparent">
                  ₹{pool}
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center italic font-black text-zinc-500 text-xs shadow-sm">
                VS
              </div>
            </div>

            {/* Opponent */}
            <div className="bg-zinc-50 dark:bg-[#0F0F13] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div className="flex items-center gap-3.5 mb-3 flex-row-reverse text-right">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-lg text-white dark:text-black shadow-md shrink-0">
                  {oppData.avatar?.startsWith("http") ? (
                    <img src={oppData.avatar} alt={oppData.name} className="w-full h-full object-cover rounded-full" />
                  ) : oppAvatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white truncate">{oppData.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Opponent</p>
                </div>
              </div>
              <div className="flex items-baseline justify-between flex-row-reverse text-right pt-2 border-t border-zinc-200 dark:border-white/5">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Score</span>
                <div className="text-3xl font-black text-zinc-900 dark:text-white">
                  {oppData.score} <span className="text-sm font-medium text-zinc-500">/ {duration}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Timeline Bar */}
          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> Day {currentDay} of {duration}
              </span>
              <span className="text-violet-600 dark:text-violet-400 font-mono">{progressPercentage}% Elapsed</span>
            </div>
            <div className="h-2 bg-zinc-150 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 font-mono">
              <span>Started: {startDate ? new Date(startDate).toLocaleDateString("en-IN") : "Day 1"}</span>
              <span>Ends: {endDate ? new Date(endDate).toLocaleDateString("en-IN") : `Day ${duration}`}</span>
            </div>
          </div>
        </div>

        {/* ─── 1V1 DUEL TIMELINE TRACK ─── */}
        <div className="bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <Swords className="w-5 h-5 text-zinc-550 dark:text-zinc-400" />
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">1v1 Consistency Duel Track</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Day-by-day comparison of verified solves</p>
              </div>
            </div>

            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-250 dark:border-white/[0.04] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <span>{showAllDays ? "Show Active Only" : "Show All 30 Days"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {displayGrid.map((dayItem: any) => {
              const myStatus = isCreator ? dayItem.creatorStatus : dayItem.opponentStatus;
              const myProblem = isCreator ? dayItem.creatorProblem : dayItem.opponentProblem;
              const oppStatus = isCreator ? dayItem.opponentStatus : dayItem.creatorStatus;
              const oppProblem = isCreator ? dayItem.opponentProblem : dayItem.creatorProblem;
              const isCurrent = dayItem.dayNumber === currentDay;

              return (
                <div
                  key={dayItem.dayNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-violet-50/50 dark:bg-violet-500/5 border-violet-300 dark:border-violet-500/30"
                      : "bg-zinc-50/50 dark:bg-[#0F0F13] border-zinc-200 dark:border-white/[0.04]"
                  }`}
                >
                  {/* Top Bar: Day Badge */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-200/60 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                        isCurrent
                          ? "bg-violet-100 dark:bg-violet-500/20 border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-300"
                          : "bg-zinc-200/60 dark:bg-white/5 border-zinc-300/60 dark:border-white/10 text-zinc-700 dark:text-zinc-300"
                      }`}>
                        Day {dayItem.dayNumber} of {duration}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1">
                          <Zap className="w-3 h-3 text-violet-500" /> Active Today
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-zinc-400 font-mono">
                      {myStatus === "completed" && oppStatus === "completed" ? "Both Solved" : myStatus === "completed" ? "You Lead" : oppStatus === "completed" ? `${oppData.name} Lead` : "Pending"}
                    </span>
                  </div>

                  {/* Side-by-Side Solves */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    
                    {/* You */}
                    <div className="p-3 rounded-lg bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 flex items-start gap-3">
                      <div className="shrink-0 pt-0.5">
                        {myStatus === "completed" ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : myStatus === "missed" ? (
                          <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-rose-500" />
                          </div>
                        ) : myStatus === "pending" ? (
                          <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-500" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">You</span>
                          {myStatus === "completed" && getPlatformBadge(myProblem?.platform)}
                        </div>
                        {myStatus === "completed" ? (
                          <p className="text-xs font-semibold text-zinc-900 dark:text-white break-words leading-snug">
                            {myProblem || "Verified DSA Problem Solved"}
                          </p>
                        ) : myStatus === "missed" ? (
                          <p className="text-xs font-bold text-rose-500">Missed Day</p>
                        ) : myStatus === "pending" ? (
                          <p className="text-xs font-medium text-amber-500">Waiting for daily solve sync...</p>
                        ) : (
                          <p className="text-xs font-medium text-zinc-400">Locked</p>
                        )}
                      </div>
                    </div>

                    {/* Opponent */}
                    <div className="p-3 rounded-lg bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 flex items-start gap-3">
                      <div className="shrink-0 pt-0.5">
                        {oppStatus === "completed" ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : oppStatus === "missed" ? (
                          <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-rose-500" />
                          </div>
                        ) : oppStatus === "pending" ? (
                          <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-500" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{oppData.name}</span>
                          {oppStatus === "completed" && getPlatformBadge(oppProblem?.platform)}
                        </div>
                        {oppStatus === "completed" ? (
                          <p className="text-xs font-semibold text-zinc-900 dark:text-white break-words leading-snug">
                            {oppProblem || "Verified DSA Problem Solved"}
                          </p>
                        ) : oppStatus === "missed" ? (
                          <p className="text-xs font-bold text-rose-500">Missed Day</p>
                        ) : oppStatus === "pending" ? (
                          <p className="text-xs font-medium text-amber-500">Waiting for daily solve sync...</p>
                        ) : (
                          <p className="text-xs font-medium text-zinc-400">Locked</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ─── LIVE SOLVES ACTIVITY FEED ─── */}
        <div className="bg-white dark:bg-[#0B0C10] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-200 dark:border-white/5">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Live Solves Activity Feed</h3>
          </div>

          {feed.length > 0 ? (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {feed.map((item: any) => {
                const isItemMe = (item.isCreator && isCreator) || (!item.isCreator && !isCreator);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400">
                        {item.platform === "LeetCode" ? "LC" : item.platform === "Code360" ? "C360" : item.platform === "GFG" ? "GFG" : "CP"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {isItemMe ? "You" : item.solverName} solved <span className="text-violet-600 dark:text-violet-400 font-bold">"{item.problemName}"</span>
                        </p>
                        <p className="text-xs text-zinc-500">Day {item.dayNumber} of {duration}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm text-center py-6">No coding activity logged yet. Solved problems will show up here.</p>
          )}
        </div>

        {/* ─── RULES & WARNINGS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0B0C10] border border-emerald-500/20 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> How to Win
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Solve problems on LeetCode or GFG daily and sync on the dashboard. Each verified solve day adds +1 to your score. The coder with the most verified days at the end of {duration} days claims the whole <strong className="text-amber-500">₹{pool} Prize Pool</strong>!
            </p>
          </div>
          <div className="bg-white dark:bg-[#0B0C10] border border-rose-500/20 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Strict Deadlines
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Missing a day gives your opponent the lead. A missed day can only be saved if you have enough Grace Coins. If both tie, the pool is split.
            </p>
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
