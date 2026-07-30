import { Code2, ArrowLeft, Trophy, Zap, Clock, User, ShieldAlert, Sparkles, CheckCircle, XCircle, Lock, Target, Swords, Sword, AlertCircle, Filter, Calendar, Activity, ChevronRight } from "lucide-react";
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
  
  // UI Controls: Filter for active vs all 30 days, selected day filter
  const [showAllDays, setShowAllDays] = useState(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

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
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-white">
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
          <p className="text-zinc-400 text-sm font-medium">Loading Battle Arena...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen text-white bg-[#090A0F]">
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090A0F]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="max-w-md w-full bg-[#0F1017] border border-white/[0.08] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Challenge Not Found</h2>
            <p className="text-zinc-400 text-sm">{error || "This challenge doesn't exist or you don't have access."}</p>
            <div className="pt-4">
              <Link to="/dashboard" className="block w-full py-4 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white">
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
  let leadStyle = "bg-zinc-500/10 border-zinc-500/20 text-zinc-300";
  let leadIcon = <AlertCircle className="w-4 h-4" />;

  if (status === "active" || status === "ACTIVE") {
    if (myData.score === oppData.score) {
      leadMessage = "Deadlock! Both coders have equal score. Solve today to take the lead!";
      leadStyle = "bg-violet-500/10 border-violet-500/30 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)]";
      leadIcon = <Swords className="w-4 h-4 text-violet-400" />;
    } else if (myData.score > oppData.score) {
      const diff = myData.score - oppData.score;
      leadMessage = `You are leading by ${diff} point${diff > 1 ? "s" : ""}! Keep up the daily streak.`;
      leadStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
      leadIcon = <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />;
    } else {
      const diff = oppData.score - myData.score;
      leadMessage = `${oppData.name} is leading by ${diff} point${diff > 1 ? "s" : ""}. Sync today's solve to close the gap!`;
      leadStyle = "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]";
      leadIcon = <Sparkles className="w-4 h-4 text-rose-400" />;
    }
  } else if (status === "completed" || status === "COMPLETED") {
    if (myData.score === oppData.score) {
      leadMessage = "Battle Ended: It's a Tie! Stakes refunded to both wallets.";
      leadStyle = "bg-blue-500/10 border-blue-500/30 text-blue-300";
      leadIcon = <Trophy className="w-4 h-4 text-blue-400" />;
    } else if (myData.score > oppData.score) {
      leadMessage = "Victory! You defeated your opponent and claimed the entire prize pool!";
      leadStyle = "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]";
      leadIcon = <Trophy className="w-4 h-4 text-amber-400" />;
    } else {
      leadMessage = `Battle Ended. ${oppData.name} claimed the victory. Rebuild your streak for the next duel!`;
      leadStyle = "bg-zinc-800 border-zinc-700 text-zinc-400";
      leadIcon = <ShieldAlert className="w-4 h-4" />;
    }
  }

  // Filter grid items (show active/past days by default, or all 30 days if toggled, or specific selected day)
  const displayGrid = grid.filter((item: any) => {
    if (selectedDayNumber !== null) {
      return item.dayNumber === selectedDayNumber;
    }
    if (showAllDays) return true;
    // By default, show active & past days (up to currentDay + 1)
    return item.dayNumber <= Math.min(currentDay + 1, duration);
  });

  const getPlatformBadge = (platform?: string) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("leetcode")) return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">LeetCode</span>;
    if (p.includes("geeks") || p.includes("gfg")) return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">GeeksforGeeks</span>;
    if (p.includes("code360")) return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400">Code360</span>;
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/10 border border-violet-500/20 text-violet-400">DSA Solve</span>;
  };

  return (
    <div className="min-h-screen text-white bg-[#090A0F] pb-16 selection:bg-violet-500/30 selection:text-white">
      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090A0F]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <ArrowLeft className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="text-sm font-semibold">Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none hidden dark:block"
              />
              <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
                Consist<span className="text-emerald-400">Pay</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border uppercase tracking-wider
                ${status === 'active' || status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 
                  status === 'completed' || status === 'COMPLETED' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 
                  'bg-white/5 border-white/10 text-zinc-400'}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 relative z-10">

        {/* Lead Status Alert Banner */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${leadStyle}`}>
          <div className="p-2 rounded-xl bg-white/10 shrink-0">
            {leadIcon}
          </div>
          <p className="text-xs sm:text-sm font-bold tracking-tight">{leadMessage}</p>
        </div>

        {/* ─── 1V1 MATCHUP ARENA HERO CARD ─── */}
        <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#12131C] to-[#0D0E15] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
            
            {/* Player 1: You */}
            <div className="bg-white/[0.02] border border-violet-500/20 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-violet-500/25 shrink-0">
                  {myData.avatar?.startsWith("http") ? (
                    <img src={myData.avatar} alt={myData.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : myAvatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-white truncate">{myData.name || "You"}</h3>
                  <span className="text-[11px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20 inline-block">
                    Contender (You)
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Score</span>
                <div className="text-3xl font-black text-white tracking-tight">
                  {myData.score} <span className="text-sm font-medium text-zinc-500">/ {duration}</span>
                </div>
              </div>
            </div>

            {/* Prize Pool & VS Badge Center */}
            <div className="flex flex-col items-center justify-center py-2 md:py-0">
              <div className="text-center mb-3">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-0.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Prize Pool
                </span>
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
                  ₹{pool}
                </div>
              </div>

              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-zinc-400 text-xs shadow-inner">
                VS
              </div>
            </div>

            {/* Player 2: Opponent */}
            <div className="bg-white/[0.02] border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
              <div className="flex items-center gap-3.5 mb-3 flex-row-reverse text-right">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-lg text-black shadow-lg shadow-emerald-500/25 shrink-0">
                  {oppData.avatar?.startsWith("http") ? (
                    <img src={oppData.avatar} alt={oppData.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : oppAvatar}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-white truncate">{oppData.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 inline-block">
                    Opponent
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between flex-row-reverse text-right pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Score</span>
                <div className="text-3xl font-black text-white tracking-tight">
                  {oppData.score} <span className="text-sm font-medium text-zinc-500">/ {duration}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Progress Timeline Bar */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> Day {currentDay} of {duration}
              </span>
              <span className="text-violet-400 font-mono">{progressPercentage}% Elapsed</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-2 font-mono">
              <span>Started: {startDate ? new Date(startDate).toLocaleDateString("en-IN") : "Day 1"}</span>
              <span>Ends: {endDate ? new Date(endDate).toLocaleDateString("en-IN") : `Day ${duration}`}</span>
            </div>
          </div>
        </div>

        {/* ─── DUAL COLUMN SAAS ARENA LAYOUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN (2 Cols): 1v1 DUEL TRACK & MATRIX ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Interactive 30-Day Matrix & Controls */}
            <div className="bg-[#0F1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Swords className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">1v1 Consistency Duel Track</h3>
                    <p className="text-[11px] text-zinc-400">Click any day chip to inspect daily problem details</p>
                  </div>
                </div>

                {/* Filter Toggle Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {selectedDayNumber !== null && (
                    <button
                      onClick={() => setSelectedDayNumber(null)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Clear D-{selectedDayNumber} Filter
                    </button>
                  )}

                  <button
                    onClick={() => setShowAllDays(!showAllDays)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{showAllDays ? "Show Active Only" : "Show All 30 Days"}</span>
                  </button>
                </div>
              </div>

              {/* Interactive 30-Day Matrix Heatmap Strip */}
              <div className="pt-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                  <span>30-Day Overview Grid</span>
                  <span>Day {currentDay} Active</span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
                  {grid.map((dayItem: any) => {
                    const myStatus = isCreator ? dayItem.creatorStatus : dayItem.opponentStatus;
                    const isSelected = selectedDayNumber === dayItem.dayNumber;
                    const isCurrent = dayItem.dayNumber === currentDay;

                    let bgClass = "bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10";
                    if (myStatus === "completed") {
                      bgClass = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25";
                    } else if (myStatus === "missed") {
                      bgClass = "bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25";
                    } else if (myStatus === "pending") {
                      bgClass = "bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse";
                    }

                    if (isSelected) {
                      bgClass += " ring-2 ring-violet-400 border-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.4)]";
                    }

                    return (
                      <button
                        key={dayItem.dayNumber}
                        onClick={() => setSelectedDayNumber(isSelected ? null : dayItem.dayNumber)}
                        className={`py-2 px-1 rounded-xl border text-center font-mono text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${bgClass}`}
                        title={`Day ${dayItem.dayNumber}: Click to filter details`}
                      >
                        <span className="text-[9px] text-zinc-400 font-sans">D{dayItem.dayNumber}</span>
                        <span>{myStatus === "completed" ? "✓" : myStatus === "missed" ? "✗" : isCurrent ? "⚡" : "•"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Duel Cards Timeline List */}
            <div className="space-y-3">
              {displayGrid.length > 0 ? (
                displayGrid.map((dayItem: any) => {
                  const myStatus = isCreator ? dayItem.creatorStatus : dayItem.opponentStatus;
                  const myProblem = isCreator ? dayItem.creatorProblem : dayItem.opponentProblem;
                  const oppStatus = isCreator ? dayItem.opponentStatus : dayItem.creatorStatus;
                  const oppProblem = isCreator ? dayItem.opponentProblem : dayItem.creatorProblem;
                  const isCurrent = dayItem.dayNumber === currentDay;

                  return (
                    <div
                      key={dayItem.dayNumber}
                      className={`p-4 sm:p-5 rounded-2xl border bg-[#0F1017] transition-all duration-300 shadow-md ${
                        isCurrent
                          ? "border-violet-500/40 bg-gradient-to-r from-violet-500/5 via-[#0F1017] to-transparent shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                          : "border-white/[0.07] hover:border-white/15"
                      }`}
                    >
                      {/* Top Card Bar: Day Badge */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                            isCurrent
                              ? "bg-violet-500/20 border-violet-500/40 text-violet-300 animate-pulse"
                              : "bg-white/5 border-white/10 text-zinc-300"
                          }`}>
                            Day {dayItem.dayNumber} of {duration}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                              <Zap className="w-3 h-3 text-violet-400" /> Active Today
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-zinc-400 font-mono">
                          {myStatus === "completed" && oppStatus === "completed" ? "Both Solved" : myStatus === "completed" ? "You Lead" : oppStatus === "completed" ? `${oppData.name} Lead` : "Pending"}
                        </span>
                      </div>

                      {/* Side-by-Side Participant Solves */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Left: You */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                          <div className="shrink-0 pt-0.5">
                            {myStatus === "completed" ? (
                              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              </div>
                            ) : myStatus === "missed" ? (
                              <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                                <XCircle className="w-4 h-4 text-rose-500" />
                              </div>
                            ) : myStatus === "pending" ? (
                              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
                                <Clock className="w-4 h-4 text-amber-400" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 text-zinc-600" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-zinc-300">You</span>
                              {myStatus === "completed" && getPlatformBadge(myProblem?.platform)}
                            </div>
                            {myStatus === "completed" ? (
                              <p className="text-xs font-semibold text-white break-words leading-snug">
                                {myProblem || "Verified DSA Problem Solved"}
                              </p>
                            ) : myStatus === "missed" ? (
                              <p className="text-xs font-bold text-rose-400">Missed Day</p>
                            ) : myStatus === "pending" ? (
                              <p className="text-xs font-medium text-amber-400">Waiting for daily solve sync...</p>
                            ) : (
                              <p className="text-xs font-medium text-zinc-600">Locked</p>
                            )}
                          </div>
                        </div>

                        {/* Right: Opponent */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                          <div className="shrink-0 pt-0.5">
                            {oppStatus === "completed" ? (
                              <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              </div>
                            ) : oppStatus === "missed" ? (
                              <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                                <XCircle className="w-4 h-4 text-rose-500" />
                              </div>
                            ) : oppStatus === "pending" ? (
                              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
                                <Clock className="w-4 h-4 text-amber-400" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 text-zinc-600" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-zinc-300 truncate">{oppData.name}</span>
                              {oppStatus === "completed" && getPlatformBadge(oppProblem?.platform)}
                            </div>
                            {oppStatus === "completed" ? (
                              <p className="text-xs font-semibold text-white break-words leading-snug">
                                {oppProblem || "Verified DSA Problem Solved"}
                              </p>
                            ) : oppStatus === "missed" ? (
                              <p className="text-xs font-bold text-rose-400">Missed Day</p>
                            ) : oppStatus === "pending" ? (
                              <p className="text-xs font-medium text-amber-400">Waiting for daily solve sync...</p>
                            ) : (
                              <p className="text-xs font-medium text-zinc-600">Locked</p>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-[#0F1017] border border-white/5 rounded-3xl">
                  <p className="text-zinc-400 text-sm">No days match the selected filter.</p>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (1 Col): LIVE SOLVES FEED & RULES ── */}
          <div className="space-y-6">

            {/* Live Solves Activity Stream */}
            <div className="bg-[#0F1017] border border-white/[0.08] rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-white">Live Solves Activity Feed</h3>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Realtime Stream</span>
              </div>

              {feed.length > 0 ? (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {feed.map((item: any) => {
                    const isItemMe = (item.isCreator && isCreator) || (!item.isCreator && !isCreator);
                    return (
                      <div key={item.id} className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            {isItemMe ? (
                              <span className="text-violet-400">You</span>
                            ) : (
                              <span className="text-emerald-400">{item.solverName}</span>
                            )}
                          </span>
                          {getPlatformBadge(item.platform)}
                        </div>

                        <p className="text-xs font-semibold text-zinc-200 leading-snug">
                          Solved <span className="text-violet-300 font-bold">"{item.problemName}"</span>
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/[0.03]">
                          <span>Day {item.dayNumber} of {duration}</span>
                          <span className="font-mono">{new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                  <p className="text-zinc-500 text-xs">No activity logged yet. Solved problems will stream live here.</p>
                </div>
              )}
            </div>

            {/* How to Win & Deadlines Info Cards */}
            <div className="space-y-4">
              <div className="bg-[#0F1017] border border-emerald-500/20 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> How to Win
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Solve problems on LeetCode/GFG daily and hit <strong className="text-white">Sync Solves</strong> on the dashboard before midnight. 
                  Each day with at least 1 verified solve adds +1 to your score. The coder with the highest score at the end of {duration} days claims the whole <strong className="text-amber-300">₹{pool} Prize Pool</strong>!
                </p>
              </div>

              <div className="bg-[#0F1017] border border-rose-500/20 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Strict Deadlines
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Missing a day gives your opponent the lead. A missed day can only be saved if you have enough Grace Coins. If both tie at the end, the pool is split.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* ─── SUCCESS OVERLAY MODAL ─── */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-500">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0F1017] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 text-center shadow-2xl">
            
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-45 border border-white/20 relative z-10">
                <Swords className="w-8 h-8 text-white -rotate-45" />
              </div>
            </div>

            <h2 className="text-3xl font-black mb-1 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              CHALLENGE IS LIVE!
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your consistency duel with <strong className="text-white">{oppData.name}</strong> has officially started!
            </p>

            <button
              onClick={handleDismissSuccess}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
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
