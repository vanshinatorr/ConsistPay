import { Code2, ArrowLeft, Copy, Share2, CheckCircle, Users, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type Screen = "setup" | "confirm" | "generated";

export function CreateChallenge() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30 | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const ENTRY_FEE = 19;
  const inviteCode = "CP-X7K2M";

  const stake = parseInt(stakeAmount) || 0;
  const total = stake + ENTRY_FEE;

  const durations = [
    { days: 7, label: "7 Days", desc: "Quick sprint", color: "from-emerald-500 to-teal-500" },
    { days: 15, label: "15 Days", desc: "Half month", color: "from-violet-500 to-purple-600" },
    { days: 30, label: "30 Days", desc: "Full month", color: "from-orange-500 to-pink-500" },
  ];

  const isSetupValid = selectedDuration && stake >= 100 && stake <= 1000;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ───────────── SCREEN 1: SETUP ───────────── */}
        {screen === "setup" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 text-sm text-violet-300 mb-4">
                <Users className="w-4 h-4" />
                Friend Challenge
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Create a{" "}
                <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Challenge
                </span>
              </h1>
              <p className="text-zinc-400 text-sm">
                Set the stakes, invite your friend, and let the best coder win.
              </p>
            </div>

            {/* Step 1 — Duration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 bg-violet-500/20 border border-violet-500/30 rounded-lg flex items-center justify-center text-sm font-bold text-violet-300">
                    1
                  </div>
                  <h2 className="text-lg font-semibold">Choose Duration</h2>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {durations.map(({ days, label, desc, color }) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDuration(days as 7 | 15 | 30)}
                      className={`relative group p-4 rounded-xl border transition-all duration-200 text-left
                        ${selectedDuration === days
                          ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                        }`}
                    >
                      {selectedDuration === days && (
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
                      )}
                      <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                        {label}
                      </div>
                      <div className="text-xs text-zinc-500">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 — Stake Amount */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-300">
                    2
                  </div>
                  <h2 className="text-lg font-semibold">Set Stake Amount</h2>
                  <span className="ml-auto text-xs text-zinc-500">₹100 – ₹1000</span>
                </div>

                {/* Quick Select */}
                <div className="flex gap-2 mb-4">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setStakeAmount(String(amt))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all
                        ${stakeAmount === String(amt)
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                        }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">₹</span>
                  <input
                    type="number"
                    min={100}
                    max={1000}
                    placeholder="Enter custom amount"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {stake > 0 && (stake < 100 || stake > 1000) && (
                  <p className="text-xs text-red-400 mt-2">Amount must be between ₹100 and ₹1000</p>
                )}
              </div>
            </div>

            {/* Step 3 — Summary */}
            {isSetupValid && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center text-sm font-bold text-orange-300">
                      3
                    </div>
                    <h2 className="text-lg font-semibold">Challenge Summary</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Duration</span>
                      <span className="font-semibold">{selectedDuration} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Your stake</span>
                      <span className="font-semibold">₹{stake}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Friend's stake</span>
                      <span className="font-semibold">₹{stake}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Entry fee</span>
                      <span className="font-semibold">₹{ENTRY_FEE}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="text-zinc-400 text-sm">You pay now</span>
                      <span className="font-bold text-lg text-emerald-400">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">🏆 Winner gets</span>
                      <span className="font-bold text-yellow-400">₹{stake * 2}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              disabled={!isSetupValid}
              onClick={() => setScreen("confirm")}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300
                ${isSetupValid
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
                  : "bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed"
                }`}
            >
              {isSetupValid ? `Continue → Pay ₹${total}` : "Fill details to continue"}
            </button>
          </div>
        )}

        {/* ───────────── SCREEN 2: CONFIRM ───────────── */}
        {screen === "confirm" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Confirm & Pay</h1>
              <p className="text-zinc-400 text-sm">Review your challenge before paying</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
                {[
                  { label: "Duration", value: `${selectedDuration} days` },
                  { label: "Your Stake", value: `₹${stake}` },
                  { label: "Entry Fee", value: `₹${ENTRY_FEE}` },
                  { label: "Winner Gets", value: `₹${stake * 2}`, highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-zinc-400 text-sm">{label}</span>
                    <span className={`font-bold ${highlight ? "text-yellow-400 text-xl" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: "100% Secure Payment", color: "text-emerald-400" },
                { icon: Zap, text: "Instant Code Generated", color: "text-yellow-400" },
                { icon: CheckCircle, text: "Grace Coins Applicable", color: "text-violet-400" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                  <p className="text-xs text-zinc-400">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setScreen("setup")}
                className="flex-1 py-4 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setScreen("generated")}
                className="flex-2 w-full py-4 rounded-xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5"
              >
                Pay ₹{total} & Create
              </button>
            </div>
          </div>
        )}

        {/* ───────────── SCREEN 3: INVITE CODE ───────────── */}
        {screen === "generated" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">Challenge Created!</h1>
              <p className="text-zinc-400 text-sm">Share the invite code with your friend to start</p>
            </div>

            {/* Invite Code */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-70" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-8 text-center">
                <p className="text-zinc-400 text-sm mb-3">Your Invite Code</p>
                <div className="text-5xl font-black tracking-widest text-white mb-6 font-mono">
                  {inviteCode}
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                      ${copied
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-white/10 border border-white/20 hover:bg-white/15"
                      }`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 transition-all shadow-lg shadow-violet-500/30">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Challenge Info */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl blur-xl opacity-40" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
                {[
                  { label: "Duration", value: `${selectedDuration} days` },
                  { label: "Stake per person", value: `₹${stake}` },
                  { label: "Total prize pool", value: `₹${stake * 2}`, highlight: true },
                  { label: "Status", value: "⏳ Waiting for friend..." },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{label}</span>
                    <span className={`font-semibold ${highlight ? "text-yellow-400" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-sm text-zinc-300">
                Challenge will start automatically when your friend joins using this code. Both of you need to submit daily proof before 11:59 PM.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="block w-full py-4 rounded-xl font-bold text-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}