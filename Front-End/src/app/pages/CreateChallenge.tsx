import { Code2, ArrowLeft, Copy, Share2, CheckCircle, Target, Users, Coins, Zap, Shield, Sparkles, User, Sword, Wallet, Clock, Swords, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TopupModal from "../components/battle/TopupModal";

type Screen = "hub" | "duration" | "stake" | "confirm" | "waiting" | "cancelled";

export function CreateChallenge() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("hub");
  const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30 | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [battleBalance, setBattleBalance] = useState<number | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [userPlan, setUserPlan] = useState<string>("free");

  const ENTRY_FEE = 19;
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    // Fetch profile info
    fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setBattleBalance(data.battleBalance || 0);
          setUserAvatar(data.avatar || null);
          setUserName(data.name || "");
          setUserPlan(data.plan || "free");
        }
      })
      .catch(console.error);

    // Fetch any active pending challenge invitation
    fetch(`${API_URL}/api/challenges/pending`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data && data.inviteCode && data.status === "pending") {
          setGeneratedInviteCode(data.inviteCode);
          setSelectedDuration(data.duration);
          setStakeAmount(String(data.stake));
          setChallengeId(data._id);
          
          // Calculate remaining seconds
          const createdTime = new Date(data.createdAt).getTime();
          const elapsed = Math.floor((Date.now() - createdTime) / 1000);
          const remaining = Math.max(0, 300 - elapsed);
          
          if (remaining > 0) {
            setTimeLeft(remaining);
            setScreen("waiting");
          }
        }
      })
      .catch(console.error);
  }, []);

  const stake = parseInt(stakeAmount) || 0;
  const total = stake + ENTRY_FEE;

  const durations = [
    { days: 7, label: "7 Days", desc: "Quick sprint", color: "from-emerald-500 to-teal-500" },
    { days: 15, label: "15 Days", desc: "Half month", color: "from-violet-500 to-purple-600" },
    { days: 30, label: "30 Days", desc: "Full month", color: "from-orange-500 to-pink-500" },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedInviteCode || "CP-X7K2M");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateChallenge = async () => {
    if (!selectedDuration || !stake) return;
    setError("");

    if (battleBalance !== null && battleBalance < total) {
      setError(`Insufficient balance. You need ₹${total - battleBalance} more to lock this commitment.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/challenges/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          duration: selectedDuration,
          stake: stake
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create challenge.");
        setLoading(false);
        return;
      }

      setGeneratedInviteCode(data.inviteCode);
      setChallengeId(data.challengeId);
      setTimeLeft(300); // Reset timer just in case
      setScreen("waiting");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBattle = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/challenges/cancel-pending`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setBattleBalance(data.battleBalance || 0);
        setScreen("cancelled");
      } else {
        setError(data.message || "Failed to cancel battle.");
      }
    } catch (err) {
      setError("Network error cancelling battle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (screen === "waiting" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  // Poll challenge status while waiting
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (screen === "waiting" && challengeId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/challenges/${challengeId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === "active") {
              // Redirect to battle details screen with success overlay!
              navigate(`/battle/${challengeId}?success=true`);
            }
          }
        } catch (err) {
          console.error("Error polling challenge status:", err);
        }
      }, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(pollInterval);
  }, [screen, challengeId, navigate, API_URL, token]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "YOU";
  
  const isAvatarUrl = userAvatar?.startsWith("http");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0F0F13] text-zinc-800 dark:text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] dark:opacity-100 opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] dark:opacity-100 opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-white/[0.04] bg-white/80 dark:bg-[#0F0F13]/80 backdrop-blur-xl">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-all duration-500 ${screen === 'hub' ? 'max-w-6xl' : 'max-w-3xl'}`}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                if (screen === "duration") {
                  setScreen("hub");
                } else {
                  navigate("/dashboard");
                }
              }}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back {screen === 'duration' ? 'to Hub' : 'to Dashboard'}</span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none"
              />
              <span className="text-lg font-bold text-zinc-800 dark:text-white">
                Consist<span className="text-emerald-500 dark:text-emerald-400">Pay</span>
              </span>
            </div>
            <div className="w-24 flex justify-end">
              {screen !== 'hub' && screen !== 'waiting' && screen !== 'cancelled' && (
                <span className="text-xs bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-2 py-1 rounded-md text-zinc-500 dark:text-zinc-400">Step {screen === 'duration' ? 1 : screen === 'stake' ? 2 : screen === 'confirm' ? 3 : 4}/4</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className={`relative mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 transition-all duration-500 ${screen === 'hub' ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <div className="bg-white dark:bg-[#0A0A0C]/90 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
          
          {/* Progress Bar Header */}
          {screen !== 'hub' && screen !== 'waiting' && screen !== 'cancelled' && (
            <div className="bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/5 px-8 py-6">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Create Challenge</h2>
                 <span className="text-sm text-zinc-500 font-medium">Step {screen === 'duration' ? 1 : screen === 'stake' ? 2 : screen === 'confirm' ? 3 : 4} of 4</span>
               </div>
               <div className="w-full bg-zinc-150 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500" style={{ width: `${((screen === 'duration' ? 1 : screen === 'stake' ? 2 : screen === 'confirm' ? 3 : 4) / 4) * 100}%` }} />
               </div>
            </div>
          )}

          <div className="p-8 sm:p-12 min-h-[500px] flex flex-col justify-center">

            {/* ───────────── SCREEN 0: BATTLE HUB / ENTRY ───────────── */}
            {screen === "hub" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col lg:flex-row gap-10">
                {/* Left Side: Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-zinc-800 dark:text-white">
                      Compete. Stay Consistent.<br/>
                      <span className="bg-gradient-to-r from-violet-605 to-emerald-500 dark:from-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Win Together.
                      </span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                      Challenge friends in coding consistency duels. Stay accountable together, protect streaks, and compete for rewards.
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: CheckCircle, text: "AI verified submissions", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/5 dark:bg-emerald-500/10", border: "border-emerald-500/10 dark:border-emerald-500/20" },
                      { icon: Target, text: "Shared daily deadlines", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/5 dark:bg-blue-500/10", border: "border-blue-500/10 dark:border-blue-500/20" },
                      { icon: Trophy, text: "Winner takes all", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/5 dark:bg-yellow-500/10", border: "border-yellow-500/10 dark:border-yellow-500/20" },
                      { icon: Zap, text: "Real-time tracking", color: "text-violet-605 dark:text-violet-400", bg: "bg-violet-500/5 dark:bg-violet-500/10", border: "border-violet-500/10 dark:border-violet-500/20" }
                    ].map((f, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${f.bg} ${f.border} border flex items-center justify-center shrink-0`}>
                          <f.icon className={`w-4 h-4 ${f.color}`} />
                        </div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Example Scenario Grid Preview */}
                  <div className="relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.01] p-5 overflow-hidden shadow-inner hidden sm:block">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500 opacity-60" />
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <div className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse"></span> Live Challenge Duel
                        </div>
                        <div className="text-sm font-semibold text-zinc-800 dark:text-white">30 Day Challenge War</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-550 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Total Pool</div>
                        <div className="text-base font-black text-emerald-500 dark:text-emerald-400">₹1,000</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <div className="flex-1 bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 rounded-xl p-3 flex flex-col items-center">
                        <span className="text-xs font-bold text-zinc-850 dark:text-white mb-1">Vansh (You)</span>
                        <span className="text-[11px] text-violet-600 dark:text-violet-300">14 Days Completed</span>
                      </div>
                      <span className="text-xs font-black text-zinc-400 dark:text-zinc-600 italic">VS</span>
                      <div className="flex-1 bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/5 rounded-xl p-3 flex flex-col items-center">
                        <span className="text-xs font-bold text-zinc-850 dark:text-white mb-1">Suhu</span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-300">12 Days Completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Cards */}
                <div className="w-full lg:w-[42%] flex flex-col gap-6 justify-center">
                  
                  {/* Create Challenge Card */}
                  <div 
                    onClick={() => setScreen("duration")}
                    className="group bg-zinc-50 dark:bg-white/5 border border-zinc-250 dark:border-white/10 hover:border-violet-500/30 hover:bg-zinc-100 dark:hover:bg-white/[0.07] rounded-3xl p-6 transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm hover:shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center">
                          <Swords className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-white/10 flex items-center justify-center group-hover:bg-violet-500 group-hover:border-violet-400 transition-all">
                          <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors rotate-180" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-1">Create Challenge</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Set stakes and duration. Generate a secret code to invite a friend instantly.
                      </p>
                    </div>
                  </div>

                  {/* Join Challenge Card */}
                  <div className="group bg-zinc-50 dark:bg-white/5 border border-zinc-250 dark:border-white/10 hover:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-white/[0.07] rounded-3xl p-6 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-800 dark:text-white mb-1">Join Challenge</h3>
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 mb-4">
                        Have an invite code? Enter it below to preview details and join the battle.
                      </p>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const codeInput = (e.currentTarget.elements.namedItem("joinCode") as HTMLInputElement).value;
                          if (codeInput.trim()) {
                            navigate(`/join-challenge/${codeInput.trim().toUpperCase()}`);
                          }
                        }} 
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          name="joinCode"
                          required
                          placeholder="e.g. CP-X7K2M"
                          className="flex-1 px-4 py-2.5 bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors uppercase font-mono tracking-wider"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-xs animate-pulse hover:animate-none cursor-pointer"
                        >
                          Join
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ───────────── SCREEN 1: DURATION ───────────── */}
            {screen === "duration" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 text-violet-650 dark:text-violet-400 font-bold tracking-wide uppercase text-xs mb-3">
                    <Target className="w-4 h-4" /> Rules of Engagement
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-zinc-800 dark:text-white">
                    How long is the challenge?
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-md mx-auto sm:mx-0">
                    Select your consistency contract. Both players must submit daily proof or risk losing their stake.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {durations.map(({ days, label, desc, color }) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDuration(days as 7 | 15 | 30)}
                      className={`relative group p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden cursor-pointer
                        ${selectedDuration === days
                          ? "border-violet-500 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.05)] dark:shadow-[0_0_30px_rgba(139,92,246,0.15)] scale-[1.02]"
                          : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/[0.04]"
                        }`}
                    >
                      {selectedDuration === days && (
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />
                      )}
                      <div className="flex items-center justify-between mb-4 relative z-10">
                         <div className={`text-3xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                          {label}
                        </div>
                        {selectedDuration === days && <CheckCircle className="w-5 h-5 text-violet-500 dark:text-violet-400" />}
                      </div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium relative z-10">{desc}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button
                    disabled={!selectedDuration}
                    onClick={() => setScreen("stake")}
                    className={`px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center gap-3 w-full sm:w-auto justify-center
                      ${selectedDuration
                        ? "border border-zinc-300 dark:border-white/20 text-zinc-800 dark:text-white bg-white dark:bg-white/5 hover:bg-zinc-800 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 hover:border-zinc-800 dark:hover:border-white cursor-pointer"
                        : "bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                      }`}
                  >
                    Next Step <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* ───────────── SCREEN 2: STAKE ───────────── */}
            {screen === "stake" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase text-xs mb-3">
                    <Coins className="w-4 h-4" /> Skin in the Game
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-zinc-800 dark:text-white">
                    Set the Stakes
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-md mx-auto sm:mx-0">
                    Higher stakes equal higher commitment. The winner takes the entire combined pool.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-3xl p-6 sm:p-8 mb-8">
                  {/* Quick Select */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setStakeAmount(String(amt))}
                        className={`py-3.5 rounded-xl text-lg font-bold border transition-all duration-300 cursor-pointer
                          ${stakeAmount === String(amt)
                            ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-sm scale-105"
                            : "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
                          }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <span className="text-2xl font-bold text-emerald-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min={100}
                      max={1000}
                      placeholder="Custom amount"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-2xl text-3xl font-bold text-zinc-800 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-center sm:text-left"
                    />
                  </div>
                  {stake > 0 && (stake < 100 || stake > 1000) && (
                    <p className="text-sm text-rose-500 dark:text-rose-400 mt-3 flex items-center justify-center sm:justify-start gap-2">
                      <Target className="w-4 h-4"/> Amount must be between ₹100 and ₹1000
                    </p>
                  )}

                  {/* Dynamic Prize Pool Preview */}
                  {stake >= 100 && stake <= 1000 && (
                    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/20 flex justify-between items-center animate-in fade-in zoom-in-95">
                       <span className="text-emerald-700 dark:text-emerald-200/80 font-semibold text-lg">Winner Takes:</span>
                       <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{stake * 2}</span>
                     </div>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-12 gap-4">
                  <button
                    onClick={() => setScreen("duration")}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    disabled={!stake || stake < 100 || stake > 1000}
                    onClick={() => setScreen("confirm")}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-3
                      ${stake && stake >= 100 && stake <= 1000
                        ? "border border-zinc-300 dark:border-white/20 text-zinc-800 dark:text-white bg-white dark:bg-white/5 hover:bg-zinc-800 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 hover:border-zinc-800 dark:hover:border-white cursor-pointer"
                        : "bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                      }`}
                  >
                    Review Details <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* ───────────── SCREEN 3: CONFIRM ───────────── */}
            {screen === "confirm" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 text-violet-650 dark:text-violet-400 font-bold tracking-wide uppercase text-xs mb-3">
                    <CheckCircle className="w-4 h-4" /> Final Step
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-zinc-800 dark:text-white">Review & Lock</h1>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Confirm your commitment to start the challenge.</p>
                </div>

                <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden mb-6 shadow-2xl max-w-md mx-auto">
                  {/* VS Head */}
                  <div className="p-6 bg-gradient-to-b from-violet-500/5 to-transparent flex items-center justify-center gap-6 sm:gap-16">
                     <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-[#0D0D10] border border-violet-200 dark:border-violet-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/10 rotate-3 overflow-hidden">
                          {isAvatarUrl ? (
                            <img src={userAvatar!} alt="You" className="w-full h-full object-cover scale-110" />
                          ) : (
                            <span className="text-xl font-bold text-violet-500 dark:text-violet-400">{initials}</span>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-bold text-violet-605 dark:text-violet-300 tracking-wider">YOU</span>
                          <span className="block text-[10px] font-medium text-zinc-500 uppercase">₹{stake} Stake</span>
                        </div>
                     </div>
                      
                     <div className="relative flex items-center justify-center shrink-0">
                       <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
                       <div className="text-sm font-black text-zinc-850 dark:text-white italic flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative z-10">
                         VS
                       </div>
                     </div>

                     <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-250 dark:border-zinc-700 rounded-2xl flex items-center justify-center -rotate-3">
                          <span className="text-2xl font-black text-zinc-405 dark:text-zinc-700">?</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">FRIEND</span>
                          <span className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-600 uppercase">₹{stake} Stake</span>
                        </div>
                     </div>
                  </div>

                  {/* Details - Receipt style */}
                  <div className="px-6 py-5 bg-zinc-50/50 dark:bg-black/20">
                    <div className="space-y-4 mb-5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Duration</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedDuration} Days</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Your Stake</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">₹{stake}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">Platform Entry Fee</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">₹{ENTRY_FEE}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                      <div>
                        <span className="block text-emerald-100 font-bold text-base">Total Prize Pool</span>
                        <span className="block text-[10px] text-emerald-400/80 uppercase tracking-widest mt-0.5">Winner Takes All</span>
                      </div>
                      <span className="font-black text-3xl text-emerald-400">
                        ₹{stake * 2}
                      </span>
                    </div>
                  </div>
                </div>

                {userPlan.toLowerCase() !== "pro" ? (
                  /* Premium Feature Lock Card */
                  <div className="max-w-md mx-auto mb-6 relative overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#1C162E]/70 dark:to-[#0A0712]/70 border border-zinc-200 dark:border-violet-500/20 rounded-3xl p-6 sm:p-8 text-center shadow-sm dark:shadow-2xl animate-in fade-in zoom-in-95">
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-14 h-14 bg-zinc-100 dark:bg-violet-500/10 border border-zinc-200 dark:border-violet-500/20 rounded-2xl flex items-center justify-center mb-5">
                        <Swords className="w-7 h-7 text-zinc-600 dark:text-violet-400" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                        Premium Duel Locked
                      </h3>
                      
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                        Consistency Battles are exclusive to <span className="text-violet-600 dark:text-violet-400 font-semibold">ConsistPay Pro</span> members. Upgrade now to challenge friends, protect streaks, and win stakes.
                      </p>

                      <div className="w-full flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setScreen("stake")}
                          className="flex-1 px-5 py-3.5 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" /> Change Stakes
                        </button>
                        <button
                          onClick={() => navigate("/pricing")}
                          className="flex-1 px-6 py-3.5 rounded-xl font-medium border border-zinc-300 dark:border-violet-500/40 text-zinc-700 dark:text-violet-300 bg-white dark:bg-violet-500/10 hover:bg-zinc-800 dark:hover:bg-gradient-to-r dark:from-violet-600 dark:to-fuchsia-600 hover:text-white hover:border-zinc-800 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" /> Upgrade to Pro
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Wallet Balance Info - Always shown */}
                    {battleBalance !== null && (
                      <div className="max-w-md mx-auto mb-6 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Wallet className="w-4.5 h-4.5" />
                            <span>Available Wallet Balance</span>
                          </div>
                          <span className="font-bold text-zinc-200">₹{battleBalance}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm pt-2.5 border-t border-white/5">
                          <span className="text-zinc-500">Required Funds</span>
                          <span className="font-semibold text-zinc-300">₹{total}</span>
                        </div>

                        {battleBalance < total ? (
                          <div className="flex justify-between items-center text-sm text-amber-400 font-medium bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
                            <span>Shortfall (Amount to add)</span>
                            <span className="font-bold">₹{total - battleBalance}</span>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-sm text-emerald-400 font-medium bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
                            <span>Status</span>
                            <span className="font-bold">Sufficient Balance</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                      <div className="max-w-md mx-auto mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col gap-3 text-rose-400 text-xs font-medium">
                        <div className="flex items-start gap-3">
                          <Shield className="w-4 h-4 shrink-0 mt-0.5" /> 
                          <span className="leading-relaxed">{error}</span>
                        </div>
                        {error.includes("pending") && (
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => {
                                window.location.reload();
                              }}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold border border-white/10 transition-all text-[11px]"
                            >
                              View Invite Code
                            </button>
                            <button
                              onClick={handleCancelBattle}
                              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg font-bold border border-rose-500/30 transition-all text-[11px]"
                            >
                              Cancel Existing & Refund
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={() => setScreen("stake")}
                        className="w-full sm:w-auto px-6 py-4 rounded-xl font-medium text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>

                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {battleBalance !== null && battleBalance < total && (
                          <button
                            onClick={() => {
                              setError("");
                              setShowTopupModal(true);
                            }}
                            className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl"
                          >
                            <Coins className="w-5 h-5" />
                            Add ₹{total - battleBalance}
                          </button>
                        )}

                        <button
                          disabled={loading}
                          onClick={handleCreateChallenge}
                          className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Sword className="w-5 h-5" />
                              Lock ₹{total} & Create
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ───────────── SCREEN 4: WAITING / INVITE ───────────── */}
            {screen === "waiting" && (
              <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-6">
                
                <h1 className="text-3xl font-extrabold mb-2 text-center text-white tracking-tight">
                  Lobby: Awaiting Opponent
                </h1>
                <p className="text-zinc-400 text-sm text-center mb-8 max-w-sm">
                  The {selectedDuration}-day consistency challenge begins the moment your opponent enters the code and joins.
                </p>

                {/* Matchup Duel Box */}
                <div className="w-full max-w-md bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden mb-6 shadow-2xl">
                  {/* VS Header with Avatars */}
                  <div className="p-6 bg-gradient-to-b from-violet-500/[0.03] to-transparent flex items-center justify-center gap-12">
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-250 dark:bg-[#0D0D10] border border-violet-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 rotate-3 overflow-hidden">
                          {isAvatarUrl ? (
                            <img src={userAvatar!} alt="You" className="w-full h-full object-cover scale-110" />
                          ) : (
                            <span className="text-xl font-bold text-violet-650 dark:text-violet-400">{initials}</span>
                          )}
                        </div>
                        <div className="text-center mt-2.5">
                          <span className="block text-xs font-bold text-violet-600 dark:text-violet-300 tracking-wider">YOU</span>
                          <span className="inline-block text-[9px] bg-violet-100 dark:bg-violet-500/20 border border-violet-250 dark:border-violet-500/30 text-violet-750 dark:text-violet-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1">₹{stake} STAKE</span>
                        </div>
                     </div>
                      
                     <div className="relative flex items-center justify-center shrink-0">
                       <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full" />
                       <div className="text-[11px] font-black text-zinc-800 dark:text-white italic flex items-center justify-center w-9 h-9 rounded-full bg-zinc-200 dark:bg-white/5 border border-zinc-300 dark:border-white/10 relative z-10 animate-pulse">
                         VS
                       </div>
                     </div>

                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-950 border-2 border-dashed border-zinc-400 dark:border-zinc-700/60 rounded-2xl flex items-center justify-center -rotate-3 relative overflow-hidden group animate-pulse">
                          {/* Pulsing scanner scanner beam inside opponent slot */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent animate-pulse" />
                          <span className="text-2xl font-black text-zinc-550 dark:text-zinc-700 relative z-10 animate-bounce">?</span>
                        </div>
                        <div className="text-center mt-2.5">
                          <span className="block text-xs font-bold text-zinc-650 dark:text-zinc-400 tracking-wider">OPPONENT</span>
                          <span className="inline-block text-[9px] bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/30 text-zinc-600 dark:text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1">WAITING...</span>
                        </div>
                     </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="px-6 py-4 bg-zinc-100/50 dark:bg-black/35 border-t border-zinc-250 dark:border-white/5 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> Pool: ₹{stake * 2}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-violet-400" /> Duration: {selectedDuration} Days</span>
                  </div>
                </div>

                {/* Secret Invite Code Card */}
                <div className="w-full max-w-md bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 text-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <p className="text-[10px] text-zinc-500 font-bold tracking-[0.25em] uppercase mb-4">Secret Invite Code</p>
                  
                  <div className="text-3xl sm:text-4xl font-black tracking-[0.15em] text-white mb-6 font-mono select-all">
                    {generatedInviteCode}
                  </div>

                  <div className="flex gap-3 justify-center relative z-10">
                    <button
                      onClick={handleCopy}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all duration-300
                        ${copied
                          ? "bg-emerald-500/20 border border-emerald-500/20 text-emerald-400"
                          : "bg-white/5 border border-white/[0.04] hover:bg-white/10 text-white"
                        }`}
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm bg-white text-black hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02] shadow-xl">
                      <Share2 className="w-4 h-4" />
                      Share Link
                    </button>
                  </div>
                </div>

                {/* Timer Badge */}
                <div className="mt-6 mb-2">
                  {timeLeft > 0 ? (
                    <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 px-4 py-2 rounded-xl font-bold border border-rose-500/20 text-xs animate-pulse">
                      <Clock className="w-4 h-4" /> 
                      <span>Code expires in <span className="font-mono font-black tracking-wider">{formatTime(timeLeft)}</span></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-400 bg-white/5 px-4 py-2 rounded-xl font-bold border border-white/[0.04] text-xs">
                      <Shield className="w-4 h-4" /> 
                      <span>Code Expired. Refunded to wallet.</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCancelBattle}
                  className="mt-8 text-zinc-500 hover:text-rose-400 transition-colors text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5"/> Cancel Challenge & Refund
                </button>
              </div>
            )}

            {/* ───────────── SCREEN 5: CANCELLED / REFUNDED ───────────── */}
            {screen === "cancelled" && (
              <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-10">
                <div className="relative flex items-center justify-center mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="absolute w-24 h-24 bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s' }}></div>
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center z-10 shadow-xl shadow-emerald-500/20 border border-white/[0.04]">
                    <Shield className="w-9 h-9 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl font-extrabold mb-2 text-center text-white">
                  Stakes Safely Returned
                </h1>
                
                <p className="text-zinc-400 text-sm text-center mb-8 max-w-sm">
                  The pending challenge invitation has been expired. All funds have been returned to your wallet.
                </p>

                <div className="w-full max-w-md bg-[#0F0F13]/90 border border-white/[0.04] rounded-2xl p-6 text-center mb-8">
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5 font-semibold">Amount Refunded</div>
                  <div className="text-3xl font-black text-emerald-400 mb-4">₹{total}</div>
                  
                  <div className="flex justify-between items-center text-xs pt-4 border-t border-white/[0.04] text-zinc-400">
                    <span>New Wallet Balance</span>
                    <span className="font-bold text-white">₹{battleBalance}</span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="w-full max-w-md py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all text-center hover:scale-[1.02] shadow-xl text-sm"
                >
                  Return to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>

        {showTopupModal && (
          <TopupModal 
            onClose={() => setShowTopupModal(false)}
            onSuccess={(newBalance) => {
              setBattleBalance(newBalance);
              setError(""); // Clear error so the "Lock & Create" button comes back if sufficient
              setShowTopupModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
}