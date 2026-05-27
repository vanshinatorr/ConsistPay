import { Code2, ArrowLeft, Copy, Share2, CheckCircle, Target, Users, Coins, Zap, Shield, Sparkles, User, Sword } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import TopupModal from "../components/battle/TopupModal";

type Screen = "duration" | "stake" | "confirm" | "waiting";

export function CreateChallenge() {
  const [screen, setScreen] = useState<Screen>("duration");
  const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30 | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [battleBalance, setBattleBalance] = useState<number | null>(null);
  const [showTopupModal, setShowTopupModal] = useState(false);

  const ENTRY_FEE = 19;
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetch(`${API_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setBattleBalance(data.user.battleBalance || 0);
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
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="bg-[#0A0A0C]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
          
          {/* Progress Bar Header */}
          <div className="bg-white/[0.02] border-b border-white/5 px-8 py-6">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-white">Create Battle</h2>
               <span className="text-sm text-zinc-500 font-medium">Step {screen === 'duration' ? 1 : screen === 'stake' ? 2 : screen === 'confirm' ? 3 : 4} of 4</span>
             </div>
             <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500" style={{ width: `${((screen === 'duration' ? 1 : screen === 'stake' ? 2 : screen === 'confirm' ? 3 : 4) / 4) * 100}%` }} />
             </div>
          </div>

          <div className="p-8 sm:p-12 min-h-[500px] flex flex-col justify-center">

            {/* ───────────── SCREEN 1: DURATION ───────────── */}
            {screen === "duration" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 text-violet-400 font-bold tracking-wide uppercase text-xs mb-3">
                    <Target className="w-4 h-4" /> Rules of Engagement
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white">
                    How long is the battle?
                  </h1>
                  <p className="text-zinc-400 text-base max-w-md mx-auto sm:mx-0">
                    Select your consistency contract. Both players must submit daily proof or risk losing their stake.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {durations.map(({ days, label, desc, color }) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDuration(days as 7 | 15 | 30)}
                      className={`relative group p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden
                        ${selectedDuration === days
                          ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] scale-[1.02]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                    >
                      {selectedDuration === days && (
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />
                      )}
                      <div className="flex items-center justify-between mb-4 relative z-10">
                         <div className={`text-3xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                          {label}
                        </div>
                        {selectedDuration === days && <CheckCircle className="w-5 h-5 text-violet-400" />}
                      </div>
                      <div className="text-sm text-zinc-400 font-medium relative z-10">{desc}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button
                    disabled={!selectedDuration}
                    onClick={() => setScreen("stake")}
                    className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center
                      ${selectedDuration
                        ? "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]"
                        : "bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed"
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
                  <div className="inline-flex items-center gap-2 text-emerald-400 font-bold tracking-wide uppercase text-xs mb-3">
                    <Coins className="w-4 h-4" /> Skin in the Game
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-white">
                    Set the Stakes
                  </h1>
                  <p className="text-zinc-400 text-base max-w-md mx-auto sm:mx-0">
                    Higher stakes equal higher commitment. The winner takes the entire combined pool.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 mb-8">
                  {/* Quick Select */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setStakeAmount(String(amt))}
                        className={`py-3.5 rounded-xl text-lg font-bold border transition-all duration-300
                          ${stakeAmount === String(amt)
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-105"
                            : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
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
                      className="w-full pl-14 pr-6 py-5 bg-black/50 border border-white/10 rounded-2xl text-3xl font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all text-center sm:text-left"
                    />
                  </div>
                  {stake > 0 && (stake < 100 || stake > 1000) && (
                    <p className="text-sm text-rose-400 mt-3 flex items-center justify-center sm:justify-start gap-2">
                      <Target className="w-4 h-4"/> Amount must be between ₹100 and ₹1000
                    </p>
                  )}

                  {/* Dynamic Prize Pool Preview */}
                  {stake >= 100 && stake <= 1000 && (
                    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex justify-between items-center animate-in fade-in zoom-in-95">
                       <span className="text-emerald-200/80 font-semibold text-lg">Winner Takes:</span>
                       <span className="text-3xl font-black text-emerald-400">₹{stake * 2}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-12 gap-4">
                  <button
                    onClick={() => setScreen("duration")}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    disabled={!stake || stake < 100 || stake > 1000}
                    onClick={() => setScreen("confirm")}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3
                      ${stake && stake >= 100 && stake <= 1000
                        ? "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]"
                        : "bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed"
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
                <div className="text-center mb-10">
                  <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Final Review</h1>
                  <p className="text-zinc-400 text-base">Lock in your commitment contract</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden mb-8 shadow-2xl">
                  {/* VS Head */}
                  <div className="p-8 bg-gradient-to-b from-violet-500/10 to-transparent border-b border-white/5">
                    <div className="flex items-center justify-center gap-4 sm:gap-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 rotate-3 transition-transform hover:rotate-6">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-bold text-violet-300">YOU</span>
                          <span className="block text-xs font-medium text-zinc-400">₹{stake} Stake</span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                        <div className="text-lg font-black text-white italic flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md relative z-10">
                          VS
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl flex items-center justify-center -rotate-3 transition-transform hover:-rotate-6">
                          <span className="text-3xl font-black text-zinc-700">?</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-bold text-zinc-400">FRIEND</span>
                          <span className="block text-xs font-medium text-zinc-600">₹{stake} Stake</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Duration</span>
                      <span className="font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg text-sm">{selectedDuration} Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Your Stake</span>
                      <span className="font-bold text-white">₹{stake}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Platform Entry Fee</span>
                      <span className="font-bold text-white">₹{ENTRY_FEE}</span>
                    </div>
                    <div className="pt-5 mt-2 border-t border-white/10 flex justify-between items-center">
                      <div>
                        <span className="block text-zinc-200 font-bold text-lg">Total Prize Pool</span>
                        <span className="block text-xs text-emerald-400 uppercase tracking-widest mt-1">Winner Takes All</span>
                      </div>
                      <span className="font-black text-3xl sm:text-4xl text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        ₹{stake * 2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet State */}
                {battleBalance !== null && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 mb-8 bg-[#0D0D0F] rounded-2xl border border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                         <Coins className="w-6 h-6 text-zinc-400" />
                       </div>
                       <div>
                         <span className="block text-sm text-zinc-500 font-medium">Available Wallet Balance</span>
                         <span className={`block font-bold text-lg ${battleBalance >= total ? 'text-emerald-400' : 'text-rose-400'}`}>
                           ₹{battleBalance}
                         </span>
                       </div>
                    </div>
                    {battleBalance < total && (
                       <span className="text-sm font-bold text-rose-400 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 text-center">
                         Need ₹{total - battleBalance} more
                       </span>
                    )}
                  </div>
                )}

                {error && (
                  <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl text-center flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4"/> {error}
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setScreen("stake")}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  {battleBalance !== null && battleBalance < total ? (
                    <button
                      onClick={() => setShowTopupModal(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl"
                    >
                      <Coins className="w-5 h-5" />
                      Top-up Wallet
                    </button>
                  ) : (
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
                          Pay ₹{total} & Create
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ───────────── SCREEN 4: WAITING / INVITE ───────────── */}
            {screen === "waiting" && (
              <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center py-10">
                
                <div className="relative flex items-center justify-center mb-12">
                  <div className="absolute w-32 h-32 bg-violet-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute w-48 h-48 border border-violet-500/20 rounded-full animate-pulse"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-3xl rotate-45 flex items-center justify-center z-10 shadow-[0_0_40px_rgba(139,92,246,0.4)] relative border border-white/20">
                    <Sword className="w-10 h-10 text-white -rotate-45" />
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center">
                  Battle Ready!
                </h1>
                <p className="text-zinc-400 text-base text-center mb-10 max-w-md">
                  Send this secret invite code to your opponent. The {selectedDuration}-day battle begins the moment they accept.
                </p>

                <div className="w-full max-w-md bg-[#0D0D0F] border border-white/10 rounded-[2rem] p-8 text-center relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <p className="text-xs text-zinc-500 font-bold tracking-[0.2em] uppercase mb-5">Secret Invite Code</p>
                  
                  <div className="text-4xl sm:text-5xl font-black tracking-[0.15em] text-white mb-8 font-mono select-all">
                    {generatedInviteCode}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <button
                      onClick={handleCopy}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300
                        ${copied
                          ? "bg-emerald-500/20 border border-emerald-500/20 text-emerald-400"
                          : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                        }`}
                    >
                      {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 transition-all duration-300 hover:scale-[1.02] shadow-xl">
                      <Share2 className="w-5 h-5" />
                      Share Link
                    </button>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="mt-12 text-zinc-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4"/> Return to Dashboard
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
              setShowTopupModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
}