import { Code2, ArrowLeft, Trophy, Zap, Clock, User, ShieldAlert, Sparkles, CheckCircle, XCircle, Lock, Target, Swords, Sword, AlertCircle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ActiveBattle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    // Check if redirect came with ?success=true
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
    // Poll for updates every 10 seconds to keep scores, grid, and feed live
    const pollInterval = setInterval(() => {
      if (id) fetchChallenge();
    }, 10000);
    return () => clearInterval(pollInterval);
  }, [id]);

  const handleDismissSuccess = () => {
    setShowSuccess(false);
    // Remove query param from URL without page reload
    const newUrl = window.location.pathname;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white">
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm font-medium">Loading challenge arena...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen text-white bg-[#0D0D0F]">
        <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0D0D0F]/80 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="max-w-md w-full bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Challenge Not Found</h2>
            <p className="text-zinc-400 text-sm">{error || "This challenge doesn't exist or you don't have access."}</p>
            <div className="pt-4">
              <Link to="/dashboard" className="block w-full py-4 rounded-xl font-bold bg-white/5 border border-white/[0.04] hover:bg-white/10 transition-all text-white">
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
    duration,
    pool,
    startDate,
    endDate,
    creator,
    opponent,
    userRole,
    currentDay,
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
  let leadIcon = <AlertCircle className="w-5 h-5" />;

  if (status === "active") {
    if (myData.score === oppData.score) {
      leadMessage = "It's a Tie! Keep coding to break the deadlock.";
      leadStyle = "bg-violet-500/10 border-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]";
      leadIcon = <Swords className="w-5 h-5 text-violet-400" />;
    } else if (myData.score > oppData.score) {
      const diff = myData.score - oppData.score;
      leadMessage = `You are leading by ${diff} point${diff > 1 ? "s" : ""}! Keep up the momentum.`;
      leadStyle = "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      leadIcon = <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />;
    } else {
      const diff = oppData.score - myData.score;
      leadMessage = `${oppData.name} is leading by ${diff} point${diff > 1 ? "s" : ""}. Push harder to catch up!`;
      leadStyle = "bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
      leadIcon = <Sparkles className="w-5 h-5 text-rose-400" />;
    }
  } else if (status === "completed") {
    if (myData.score === oppData.score) {
      leadMessage = "Challenge completed. It's a Tie! Stakes are split.";
      leadStyle = "bg-blue-500/10 border-blue-500/20 text-blue-300";
      leadIcon = <Trophy className="w-5 h-5 text-blue-400" />;
    } else if (myData.score > oppData.score) {
      leadMessage = "Congratulations! You won the challenge and claimed the prize pool!";
      leadStyle = "bg-yellow-500/10 border-yellow-500/20 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]";
      leadIcon = <Trophy className="w-5 h-5 text-yellow-400" />;
    } else {
      leadMessage = `Challenge completed. ${oppData.name} claimed the victory. Better luck next time!`;
      leadStyle = "bg-zinc-800 border-zinc-700 text-zinc-400";
      leadIcon = <ShieldAlert className="w-5 h-5" />;
    }
  }

  // Render Status Icon for duel track
  const renderStatusIcon = (statusValue: "completed" | "missed" | "pending" | "future") => {
    switch (statusValue) {
      case "completed":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
          </div>
        );
      case "missed":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-rose-500 fill-rose-500/10" />
          </div>
        );
      case "pending":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
        );
      case "future":
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.04] flex items-center justify-center text-zinc-650">
            <Lock className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  const getStatusText = (statusValue: "completed" | "missed" | "pending" | "future", problemName?: string) => {
    switch (statusValue) {
      case "completed":
        return problemName ? (
          <span className="text-xs text-zinc-300 font-medium truncate max-w-[70px] sm:max-w-[180px] block" title={problemName}>
            Solved: "{problemName}"
          </span>
        ) : (
          <span className="text-xs text-emerald-400 font-medium">Solved</span>
        );
      case "missed":
        return <span className="text-xs text-rose-500 font-bold tracking-wide uppercase">Missed Day</span>;
      case "pending":
        return <span className="text-xs text-amber-400 font-medium animate-pulse">Waiting for proof...</span>;
      case "future":
      default:
        return <span className="text-xs text-zinc-600 font-medium">Locked</span>;
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#0D0D0F]">
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none"
              />
              <span className="text-lg font-bold text-white hidden sm:block">
                Consist<span className="text-emerald-400">Pay</span>
              </span>
            </div>
            <div className="w-24 flex justify-end">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border uppercase
                ${status === 'active' || status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                  status === 'completed' || status === 'COMPLETED' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 
                  'bg-white/5 border-white/[0.04] text-zinc-400'}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Lead/Tie status comparative bar */}
        {leadMessage && (
          <div className={`flex items-center gap-3 px-5 py-4 border rounded-2xl ${leadStyle} animate-in fade-in slide-in-from-top-2 duration-500`}>
            {leadIcon}
            <span className="text-sm font-extrabold tracking-tight">{leadMessage}</span>
          </div>
        )}
        
        {/* Battle Arena Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* My Stats */}
          <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-violet-500/20">
                {myAvatar}
              </div>
              <div>
                <h3 className="font-bold text-lg">{myData.name || "You"}</h3>
                <p className="text-zinc-400 text-sm">Contender (You)</p>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Score (Days)</p>
                <div className="text-4xl font-black">{myData.score} <span className="text-sm font-medium text-zinc-500">/ {currentDay}</span></div>
              </div>
            </div>
          </div>

          {/* VS & Pool */}
          <div className="flex flex-col items-center justify-center py-6 md:py-0">
            <div className="text-center mb-4">
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                <Trophy className="w-3 h-3" /> Prize Pool
              </p>
              <div className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                ₹{pool}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/[0.04] flex items-center justify-center italic font-black text-zinc-500 shadow-md">
              VS
            </div>
          </div>

          {/* Opponent Stats */}
          <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
            <div className="flex items-center gap-4 flex-row-reverse text-right mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20 text-black">
                {oppAvatar}
              </div>
              <div>
                <h3 className="font-bold text-lg">{oppData.name}</h3>
                <p className="text-zinc-400 text-sm">Opponent</p>
              </div>
            </div>
            <div className="flex justify-between items-end flex-row-reverse text-right">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Score (Days)</p>
                <div className="text-4xl font-black">{oppData.score} <span className="text-sm font-medium text-zinc-500">/ {currentDay}</span></div>
              </div>
            </div>
          </div>

        </div>

        {/* Timeline / Progress Section */}
        <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold flex items-center gap-2 text-zinc-200">
              <Clock className="w-5 h-5 text-zinc-400" /> Challenge Timeline
            </h3>
            <div className="text-sm font-bold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-lg">
              Day {currentDay} of {duration}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/5 mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-zinc-500 font-medium">
            <span>Started: {new Date(startDate).toLocaleDateString()}</span>
            <span>Ends: {new Date(endDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Circular Duel Grid: Circular track mapping day outcomes */}
        {grid.length > 0 && (
          <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h3 className="text-base font-extrabold flex items-center gap-2 text-zinc-200">
                <Swords className="w-5 h-5 text-zinc-400" /> 1v1 Consistency Duel Track
              </h3>
              <span className="text-xs text-zinc-400 font-medium">Comparison Day-by-Day</span>
            </div>

            <div className="space-y-4">
              {grid.map((dayItem: any) => {
                // Read states depending on roles
                const myStatus = isCreator ? dayItem.creatorStatus : dayItem.opponentStatus;
                const myProblem = isCreator ? dayItem.creatorProblem : dayItem.opponentProblem;
                const oppStatus = isCreator ? dayItem.opponentStatus : dayItem.creatorStatus;
                const oppProblem = isCreator ? dayItem.opponentProblem : dayItem.creatorProblem;

                return (
                  <div 
                    key={dayItem.dayNumber}
                    className="flex items-center justify-between py-3 px-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    {/* Left: You */}
                    <div className="flex-1 flex items-center gap-3">
                      {renderStatusIcon(myStatus)}
                      <div className="text-left">
                        <span className="block text-xs font-bold text-zinc-400">You</span>
                        {getStatusText(myStatus, myProblem)}
                      </div>
                    </div>

                    {/* Middle: Day Circle */}
                    <div className="w-16 flex items-center justify-center shrink-0">
                      <div className={`px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wider uppercase
                        ${dayItem.dayNumber === currentDay ? 'bg-violet-500/10 border-violet-500/30 text-violet-300 animate-pulse' : 
                          dayItem.dayNumber < currentDay ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-transparent border-dashed border-white/5 text-zinc-600'}`}>
                        D-{dayItem.dayNumber}
                      </div>
                    </div>

                    {/* Right: Opponent */}
                    <div className="flex-1 flex items-center gap-3 flex-row-reverse text-right">
                      {renderStatusIcon(oppStatus)}
                      <div className="text-right">
                        <span className="block text-xs font-bold text-zinc-400">{oppData.name}</span>
                        {getStatusText(oppStatus, oppProblem)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Coding Activity Feed */}
        <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-extrabold text-zinc-200">Live Solves Activity Feed</h3>
          </div>

          {feed.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {feed.map((item: any) => {
                const isItemMe = (item.isCreator && isCreator) || (!item.isCreator && !isCreator);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-[10px] font-mono font-bold text-violet-400">
                        {item.platform === "LeetCode" ? "LC" : item.platform === "Code360" ? "C360" : item.platform === "GFG" ? "GFG" : "CP"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {isItemMe ? "You" : item.solverName} solved <span className="text-violet-400">"{item.problemName}"</span>
                        </p>
                        <p className="text-xs text-zinc-500">Day {item.dayNumber} of {duration}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
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

        {/* Rules & Warnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F0F13] border border-emerald-500/20 rounded-3xl p-6 shadow-md">
            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> How to Win
            </h4>
            <p className="text-sm text-emerald-200/70 leading-relaxed">
              Solve problems on LeetCode and sync daily on the dashboard. The single source of truth is your daily solve verified by our automated LeetCode integration. <strong className="text-emerald-300">Solving multiple questions in a single day still counts as 1 day completed</strong> (extra solves only increase your overall leaderboard score, not your score in this challenge). The person with the most verified days by the end of the duration takes the entire pool.
            </p>
          </div>
          <div className="bg-[#0F0F13] border border-red-500/20 rounded-3xl p-6 shadow-md">
            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Strict Deadlines
            </h4>
            <p className="text-sm text-red-200/70 leading-relaxed">
              Missing a day means your opponent gets an edge. A missed day can only be saved if you have enough Grace Coins. If both tie, the pool is split. No refunds on entry fees.
            </p>
          </div>
        </div>

      </main>

      {/* ─── SUCCESS OVERLAY MODAL ─── */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-500">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute inset-0 bg-radial-gradient from-violet-500/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0F0F13]/95 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.15),inset_0_0_20px_rgba(255,255,255,0.02)] animate-in zoom-in-95 duration-500">
            {/* Decorative Corner Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[60px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[60px]" />
            
            {/* Animated Swords Badging */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-24 h-24 bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute w-20 h-20 bg-emerald-500/20 rounded-full animate-pulse"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 rotate-45 border border-white/20 relative z-10 transition-transform hover:scale-105 duration-500">
                <Swords className="w-8 h-8 text-white -rotate-45" />
              </div>
            </div>

            {/* Title / Header */}
            <h2 className="text-3xl sm:text-4xl font-black mb-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent tracking-tight">
              CHALLENGE IS LIVE!
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Your consistency duel with <strong className="text-white font-semibold">{oppData.name}</strong> has officially started!
            </p>

            {/* Visual Matchup Clash */}
            <div className="flex items-center justify-center gap-4 sm:gap-12 my-5 bg-white/[0.02] border border-white/5 rounded-3xl p-4 relative overflow-hidden shadow-inner">
               {/* Left Player: You */}
               <div className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D0D10]/80 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/10 overflow-hidden rotate-2 relative">
                    {myData.avatar?.startsWith("http") ? (
                      <img src={myData.avatar} alt={myData.name} className="w-full h-full object-cover scale-110" />
                    ) : (
                      <span className="text-sm font-bold text-violet-400">{myAvatar}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="block text-[9px] font-bold text-violet-300 uppercase tracking-widest">YOU</span>
                    <span className="block text-xs font-semibold text-zinc-300 truncate max-w-[90px]" title={myData.name}>{myData.name}</span>
                  </div>
               </div>

               {/* VS Separator */}
               <div className="relative flex items-center justify-center shrink-0">
                 <div className="absolute inset-0 bg-violet-500/20 blur-md rounded-full" />
                 <div className="text-[10px] font-black text-white italic flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 relative z-10">
                   VS
                 </div>
               </div>

               {/* Right Player: Opponent */}
               <div className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D0D10]/80 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 overflow-hidden -rotate-2 relative">
                    {oppData.avatar?.startsWith("http") ? (
                      <img src={oppData.avatar} alt={oppData.name} className="w-full h-full object-cover scale-110" />
                    ) : (
                      <span className="text-sm font-bold text-emerald-400">{oppAvatar}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="block text-[9px] font-bold text-emerald-300 uppercase tracking-widest">OPPONENT</span>
                    <span className="block text-xs font-semibold text-zinc-300 truncate max-w-[90px]" title={oppData.name}>{oppData.name}</span>
                  </div>
               </div>
            </div>

            {/* Duel Stakes Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold mb-6 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>₹{myData.stake || challenge.stake} Stake Locked</span>
              <span className="text-zinc-650">•</span>
              <span className="text-yellow-400 font-bold">₹{pool} Prize Pool</span>
            </div>

            {/* Instruction Checklist Cards */}
            <div className="space-y-3 text-left mb-8">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1 mb-1">Your Checklist to Win</h3>
              
              {/* Card 1 */}
              <div className="group bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:bg-white/[0.03]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">1. Code Daily</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                    Solve coding challenges on LeetCode daily. <strong className="text-amber-400">Solving multiple questions in a day still counts as 1 point</strong> (this improves your overall leaderboard score, not your challenge points).
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-white/[0.01] border border-white/5 hover:border-violet-500/20 rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:bg-white/[0.03]">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">2. Sync Solve Status</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">Click the sync solves button on the dashboard to pull LeetCode status before midnight.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-white/[0.01] border border-white/5 hover:border-yellow-500/20 rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:bg-white/[0.03]">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">3. Stay Consistent & Claim Loot</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">Keep your streak high. Coder with the most verified days claims the whole ₹{pool} pool.</p>
                </div>
              </div>
            </div>

            {/* Glowing CTA Button */}
            <button
              onClick={handleDismissSuccess}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sword className="w-4 h-4 animate-pulse" />
              <span>Enter the Arena</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
