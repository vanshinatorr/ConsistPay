import { Code2, ArrowLeft, Copy, Share2, CheckCircle, Target, Users, Coins, Zap, Shield, Sparkles, User, Sword } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type Screen = "duration" | "stake" | "confirm" | "waiting";

export function CreateChallenge() {
  const [screen, setScreen] = useState<Screen>("duration");
  const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30 | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ENTRY_FEE = 19;
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

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
      setScreen("waiting");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Cancel Battle</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </div>
            <div className="w-24 flex justify-end">
              <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-md text-zinc-400">Step {screen === 'duration' ? 1 : screen === 'stake' ? 2 : screen === 'confirm' ? 3 : 4}/4</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ───────────── SCREEN 1: DURATION ───────────── */}
        {screen === "duration" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-4 font-semibold">
                <Target className="w-4 h-4" />
                Step 1: Rules of Engagement
              </div>
              <h1 className="text-4xl font-extrabold mb-3">
                How long is the battle?
              </h1>
              <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                Choose the duration of your consistency contract. You both must submit proof every day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {durations.map(({ days, label, desc, color }) => (
                <button
                  key={days}
                  onClick={() => setSelectedDuration(days as 7 | 15 | 30)}
                  className={`relative group p-6 rounded-2xl border transition-all duration-300 text-center
                    ${selectedDuration === days
                      ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10 scale-[1.02]"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                >
                  <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                    {label}
                  </div>
                  <div className="text-xs text-zinc-400 font-medium">{desc}</div>
                </button>
              ))}
            </div>

            <button
              disabled={!selectedDuration}
              onClick={() => setScreen("stake")}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 mt-8 flex items-center justify-center gap-2
                ${selectedDuration
                  ? "bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-500/20 text-white"
                  : "bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed"
                }`}
            >
              Continue to Stakes <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* ───────────── SCREEN 2: STAKE ───────────── */}
        {screen === "stake" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-300 mb-4 font-semibold">
                <Coins className="w-4 h-4" />
                Step 2: Skin in the Game
              </div>
              <h1 className="text-4xl font-extrabold mb-3">
                Set the Stakes
              </h1>
              <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                Higher stakes equal higher commitment. The winner takes the entire combined pool.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
              
              {/* Quick Select */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[100, 200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setStakeAmount(String(amt))}
                    className={`py-3 rounded-xl text-lg font-bold border transition-all
                      ${stakeAmount === String(amt)
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10 scale-105"
                        : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                      }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <span className="text-xl font-bold text-zinc-500">₹</span>
                </div>
                <input
                  type="number"
                  min={100}
                  max={1000}
                  placeholder="Custom amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full pl-10 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-2xl font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all text-center"
                />
              </div>

              {stake > 0 && (stake < 100 || stake > 1000) && (
                <p className="text-xs text-red-400 mt-3 text-center">Amount must be between ₹100 and ₹1000</p>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setScreen("duration")}
                className="px-6 py-4 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                disabled={!stake || stake < 100 || stake > 1000}
                onClick={() => setScreen("confirm")}
                className={`flex-1 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2
                  ${stake && stake >= 100 && stake <= 1000
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white"
                    : "bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed"
                  }`}
              >
                Review & Confirm <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ───────────── SCREEN 3: CONFIRM ───────────── */}
        {screen === "confirm" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-2">Final Review</h1>
              <p className="text-zinc-400 text-sm">Lock in your commitment contract</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-60" />
              <div className="relative bg-[#0A0A0C] border border-white/10 rounded-3xl p-8 shadow-2xl">
                
                {/* Visual VS Setup */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-violet-400/30">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-violet-300">YOU (₹{stake})</span>
                  </div>
                  <div className="text-sm font-black text-zinc-500 italic flex items-center justify-center w-10 h-10 rounded-full bg-white/5">VS</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-full flex items-center justify-center text-zinc-500">
                      ?
                    </div>
                    <span className="text-xs font-bold text-zinc-400">FRIEND (₹{stake})</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Duration", value: `${selectedDuration} days`, highlight: false },
                    { label: "Your Stake", value: `₹${stake}`, highlight: false },
                    { label: "Entry Fee", value: `₹${ENTRY_FEE}`, highlight: false },
                    { label: "Total Prize Pool", value: `₹${stake * 2}`, highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <span className="text-zinc-400 text-sm">{label}</span>
                      <span className={`font-bold ${highlight ? "text-yellow-400 text-xl" : "text-white"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setScreen("stake")}
                className="px-6 py-4 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={handleCreateChallenge}
                className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₹{total} & Create Battle</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ───────────── SCREEN 4: WAITING / INVITE ───────────── */}
        {screen === "waiting" && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center min-h-[60vh]">
            
            {/* Animated Radar/Pulse */}
            <div className="relative flex items-center justify-center mb-10 mt-10">
              <div className="absolute w-32 h-32 bg-violet-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute w-48 h-48 border border-violet-500/10 rounded-full"></div>
              <div className="absolute w-64 h-64 border border-violet-500/5 rounded-full"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center z-10 shadow-lg shadow-violet-500/40 relative">
                <Sword className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold mb-3 text-center">
              Waiting for Opponent...
            </h1>
            <p className="text-zinc-400 text-sm text-center mb-8 max-w-sm">
              Your battle is ready. Send this invite code to your friend. The {selectedDuration}-day battle begins the moment they accept.
            </p>

            {/* Invite Code Card */}
            <div className="w-full max-w-md bg-white/5 border border-violet-500/30 rounded-2xl p-6 text-center shadow-xl shadow-violet-500/10 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
              
              <p className="text-xs text-violet-400 font-bold tracking-widest uppercase mb-3">Secret Invite Code</p>
              
              <div className="text-4xl sm:text-5xl font-black tracking-widest text-white mb-6 font-mono select-all bg-black/30 py-4 rounded-xl border border-white/5">
                {generatedInviteCode}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCopy}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all
                    ${copied
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                      : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30">
                  <Share2 className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="mt-8 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}