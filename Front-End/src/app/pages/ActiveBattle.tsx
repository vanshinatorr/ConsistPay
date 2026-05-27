import { Code2, ArrowLeft, Trophy, Zap, Clock, User, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function ActiveBattle() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`${API_URL}/api/challenges/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load battle.");
          import("sonner").then((mod) => mod.toast.error(data.message || "Failed to load battle."));
          return;
        }
        setChallenge(data);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white">
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm font-medium">Loading battle arena...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen text-white bg-[#0D0D0F]">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
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
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Battle Not Found</h2>
            <p className="text-zinc-400 text-sm">{error || "This battle doesn't exist or you don't have access."}</p>
            <div className="pt-4">
              <Link to="/dashboard" className="block w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/15 transition-all text-white">
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
    currentDay
  } = challenge;

  const myData = userRole === "creator" ? creator : opponent;
  const oppData = userRole === "creator" ? opponent : creator;

  const myAvatar = myData.name ? myData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "ME";
  const oppAvatar = oppData.name ? oppData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "OP";

  const progressPercentage = Math.min(100, Math.round((currentDay / duration) * 100));

  return (
    <div className="min-h-screen text-white bg-[#0D0D0F]">
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent hidden sm:block">
                ConsistPay
              </span>
            </div>
            <div className="w-24 flex justify-end">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border 
                ${status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                  status === 'COMPLETED' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 
                  'bg-white/5 border-white/10 text-zinc-400'}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Battle Arena Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* My Stats */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-violet-500/20">
                {myAvatar}
              </div>
              <div>
                <h3 className="font-bold text-lg">You</h3>
                <p className="text-zinc-400 text-sm">Contender</p>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Score</p>
                <div className="text-4xl font-black">{myData.score} <span className="text-sm font-medium text-zinc-500">/ {currentDay}</span></div>
              </div>
            </div>
          </div>

          {/* VS & Pool */}
          <div className="flex flex-col items-center justify-center py-6 md:py-0">
            <div className="text-center mb-4">
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" /> Prize Pool
              </p>
              <div className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                ₹{pool}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center italic font-black text-zinc-500">
              VS
            </div>
          </div>

          {/* Opponent Stats */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
            <div className="flex items-center justify-end gap-4 mb-4 text-right">
              <div>
                <h3 className="font-bold text-lg">{oppData.name}</h3>
                <p className="text-zinc-400 text-sm">Challenger</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                {oppAvatar}
              </div>
            </div>
            <div className="flex justify-between items-end flex-row-reverse text-right">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Score</p>
                <div className="text-4xl font-black">{oppData.score} <span className="text-sm font-medium text-zinc-500">/ {currentDay}</span></div>
              </div>
            </div>
          </div>

        </div>

        {/* Timeline / Progress Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" /> Battle Timeline
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

        {/* Rules & Warnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> How to Win
            </h4>
            <p className="text-sm text-emerald-200/70 leading-relaxed">
              Submit your LeetCode or Code360 progress daily on the dashboard. The single source of truth is your daily screenshot verified by Gemini AI. The person with the most verified days by the end of the duration takes the entire pool.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Strict Deadlines
            </h4>
            <p className="text-sm text-red-200/70 leading-relaxed">
              Missing a day means your opponent gets an edge. A missed day can only be saved if you have enough Grace Coins. If both tie, the pool is split. No refunds on entry fees.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
