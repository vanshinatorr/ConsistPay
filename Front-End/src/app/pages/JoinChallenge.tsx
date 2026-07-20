import { Code2, ArrowLeft, Shield, Zap, CheckCircle, Users, Target, User, Sword } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type Screen = "preview" | "joined";

export function JoinChallenge() {
  const { code } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Join Battle Challenge | ConsistPay";
  }, []);
  const [screen, setScreen] = useState<Screen>("preview");
  const [challengeData, setChallengeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");
  const [joinedData, setJoinedData] = useState<any>(null);
  const [retryCode, setRetryCode] = useState("");
  const [retryLoading, setRetryLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (!code) {
        setError("Invite code is missing.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/challenges/invite/${code}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to fetch invite details.");
          return;
        }
        setChallengeData(data);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [code, API_URL, token]);

  const handleRetry = async () => {
    if (!retryCode.trim()) return;
    setRetryLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_URL}/api/challenges/invite/${retryCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid invite code.");
        import("sonner").then((mod) => mod.toast.error(data.message || "Invalid invite code."));
        return;
      }
      setChallengeData(data);
      // Navigate to the new code URL so it updates correctly without full reload
      navigate(`/join-challenge/${retryCode}`, { replace: true });
    } catch (err) {
      setError("Network error. Please try again.");
      import("sonner").then((mod) => mod.toast.error("Network error. Please try again."));
    } finally {
      setRetryLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!code) return;
    setError("");
    setJoinLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/challenges/join/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to join challenge.");
        return;
      }

      setJoinedData(data);
      setScreen("joined");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white">
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm font-medium">Fetching battle details...</p>
        </div>
      </div>
    );
  }

  if (error && screen === "preview") {
    return (
      <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
        <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0D0D0F]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="max-w-md w-full bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Invalid Invite Code</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">{error}</p>
            </div>
            
            <div className="pt-4 space-y-3">
              <input
                type="text"
                placeholder="Enter new invite code"
                value={retryCode}
                onChange={(e) => setRetryCode(e.target.value.toUpperCase())}
                className="w-full bg-[#0D0D0F] border border-white/[0.04] rounded-xl px-4 py-3 text-center font-mono tracking-widest outline-none focus:border-violet-500/50 transition-colors uppercase"
              />
              <button
                onClick={handleRetry}
                disabled={!retryCode.trim() || retryLoading}
                className="w-full py-4 rounded-xl font-bold text-center bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-all text-white flex justify-center items-center gap-2"
              >
                {retryLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Try Again"}
              </button>
            </div>
            <Link
              to="/dashboard"
              className="block w-full py-3 rounded-xl font-bold text-center bg-white/5 border border-white/[0.04] hover:bg-white/10 transition-all text-zinc-300 mt-2 text-sm"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const creatorAvatar = challengeData?.createdBy
    ? challengeData.createdBy.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const total = challengeData ? challengeData.stake + challengeData.entryFee : 0;

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Cancel Join</span>
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none hidden dark:block"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
            </div>
            <div className="w-24 flex justify-end">
              <span className="text-xs bg-white/5 border border-white/[0.04] px-2 py-1 rounded-md text-zinc-400">Join Challenge</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── SCREEN 1: PREVIEW ── */}
        {screen === "preview" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-600 dark:text-emerald-305 mb-3 font-semibold">
                <Target className="w-4 h-4" />
                Challenge Request
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-zinc-900 dark:text-white">
                You've been challenged!
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mx-auto">
                {challengeData.createdBy} wants to lock in a consistency contract with you. Review the terms below.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* VS Card */}
              <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                <div>
                  {/* Visual VS Setup */}
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center border-2 border-zinc-300 dark:border-zinc-700">
                        <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <span className="text-xs font-bold text-zinc-650 dark:text-zinc-400">YOU (₹{challengeData.stake})</span>
                    </div>
                    <div className="text-xs font-black text-emerald-500 italic flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">VS</div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-violet-400/30 text-white font-bold text-lg">
                        {creatorAvatar}
                      </div>
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-300 uppercase truncate max-w-[100px] text-center">{challengeData.createdBy.split(" ")[0]} (₹{challengeData.stake})</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Duration", value: `${challengeData.duration} days`, highlight: false },
                      { label: "Your Stake", value: `₹${challengeData.stake}`, highlight: false },
                      { label: "Entry Fee", value: `₹${challengeData.entryFee}`, highlight: false },
                      { label: "Total Prize Pool", value: `₹${challengeData.stake * 2}`, highlight: true },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-0">
                        <span className="text-zinc-550 dark:text-zinc-450 text-sm">{label}</span>
                        <span className={`font-bold ${highlight ? "text-yellow-500 dark:text-yellow-400 text-lg" : "text-zinc-800 dark:text-white"}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rules Card */}
              <div className="bg-[#0F0F13] border border-white/[0.04] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-center">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Contract Rules
                </h3>
                <ul className="space-y-3 text-sm text-zinc-650 dark:text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Submit daily proof before <strong className="text-zinc-800 dark:text-zinc-200">11:59 PM</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Solving problems counts as <strong className="text-emerald-600 dark:text-emerald-300">1 point</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Challenge begins when you accept contract</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Winner takes the <strong className="text-yellow-600 dark:text-yellow-400 font-bold">₹{challengeData.stake * 2}</strong> pool</span>
                  </li>
                </ul>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-455 text-xs rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-1/3 py-3 rounded-xl font-semibold text-center bg-white/5 border border-white/[0.04] hover:bg-white/10 transition-all text-sm flex items-center justify-center text-zinc-700 dark:text-zinc-300"
              >
                Decline
              </Link>
              <button
                disabled={joinLoading}
                onClick={handleAccept}
                className="w-full sm:w-2/3 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 text-sm flex justify-center items-center gap-2 disabled:opacity-50 text-white cursor-pointer"
              >
                {joinLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Accept & Pay ₹{total}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── SCREEN 2: JOINED SUCCESSFULLY ── */}
        {screen === "joined" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center min-h-[60vh]">
            
            {/* Animated Radar/Pulse */}
            <div className="relative flex items-center justify-center mb-10 mt-10">
              <div className="absolute w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute w-48 h-48 border border-emerald-500/10 rounded-full"></div>
              <div className="absolute w-64 h-64 border border-emerald-500/5 rounded-full"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center z-10 shadow-lg shadow-emerald-500/40 relative">
                <Sword className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-extrabold mb-3 text-center tracking-tight">
              Challenge Accepted!
            </h1>
            <p className="text-zinc-400 text-sm text-center mb-8 max-w-sm">
              You are now locked in a {challengeData.duration}-day consistency war with {challengeData.createdBy}. The challenge has officially begun.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => navigate(`/battle/${joinedData?.challengeId}?success=true`)}
                className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white transition-all hover:scale-[1.02] shadow-xl text-center flex items-center justify-center gap-2"
              >
                <Sword className="w-5 h-5 animate-pulse" />
                Enter Challenge Arena
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/[0.04] text-white transition-all text-center"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}