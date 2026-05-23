import { Code2, ArrowLeft, Shield, Zap, CheckCircle, Users } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

type Screen = "preview" | "joined";

export function JoinChallenge() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("preview");

  // Mock challenge data based on code
  const challengeData = {
    code: code || "CP-X7K2M",
    createdBy: "Alex Kumar",
    createdByAvatar: "AK",
    duration: 15,
    stake: 500,
    entryFee: 19,
    startDate: "March 23, 2026",
  };

  const total = challengeData.stake + challengeData.entryFee;

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
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </nav>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── SCREEN 1: PREVIEW ── */}
        {screen === "preview" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 text-sm text-violet-300 mb-4">
                <Users className="w-4 h-4" />
                Challenge Invite
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                You're Invited to a{" "}
                <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Challenge!
                </span>
              </h1>
              <p className="text-zinc-400 text-sm">
                Review the details before accepting
              </p>
            </div>

            {/* Invite Code Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
                <span className="text-zinc-400 text-sm">Code:</span>
                <span className="font-mono font-bold text-white tracking-widest">{challengeData.code}</span>
              </div>
            </div>

            {/* Challenger Info */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-4 text-center">Challenge created by</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {challengeData.createdByAvatar}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{challengeData.createdBy}</div>
                    <div className="text-zinc-400 text-sm">🔥 134 day streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Details */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-60" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-5">Challenge Details</h2>
                <div className="space-y-4">
                  {[
                    { label: "Duration", value: `${challengeData.duration} days` },
                    { label: "Start Date", value: challengeData.startDate },
                    { label: "Stake per person", value: `₹${challengeData.stake}` },
                    { label: "Entry fee", value: `₹${challengeData.entryFee}` },
                    { label: "You pay now", value: `₹${total}`, highlight: "emerald" },
                    { label: "🏆 Winner gets", value: `₹${challengeData.stake * 2}`, highlight: "yellow" },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <span className="text-zinc-400 text-sm">{label}</span>
                      <span className={`font-bold ${
                        highlight === "yellow" ? "text-yellow-400 text-lg" :
                        highlight === "emerald" ? "text-emerald-400" : ""
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">📋 Rules</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Submit LeetCode/Code360 link daily before 11:59 PM
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Most consistent coder wins 100% of both stakes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Grace coins can be used in challenges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  If tied, both get stake back (no entry fee refund)
                </li>
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: "Secure Payment", color: "text-emerald-400" },
                { icon: Zap, text: "Instant Start", color: "text-yellow-400" },
                { icon: CheckCircle, text: "Grace Coins OK", color: "text-violet-400" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                  <p className="text-xs text-zinc-400">{text}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="flex-1 py-4 rounded-xl font-semibold text-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
              >
                Decline
              </Link>
              <button
                onClick={() => setScreen("joined")}
                className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 text-sm"
              >
                Accept & Pay ₹{total}
              </button>
            </div>
          </div>
        )}

        {/* ── SCREEN 2: JOINED SUCCESSFULLY ── */}
        {screen === "joined" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">Challenge Accepted!</h1>
              <p className="text-zinc-400 text-sm">
                You're now competing against {challengeData.createdBy}
              </p>
            </div>

            {/* VS Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-70" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  {/* You */}
                  <div className="text-center flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2">
                      YU
                    </div>
                    <div className="font-bold">You</div>
                    <div className="text-xs text-zinc-400">🔥 47 day streak</div>
                  </div>

                  {/* VS */}
                  <div className="text-center px-4">
                    <div className="text-2xl font-black text-zinc-500">VS</div>
                    <div className="text-xs text-zinc-500 mt-1">{challengeData.duration} days</div>
                  </div>

                  {/* Opponent */}
                  <div className="text-center flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2">
                      {challengeData.createdByAvatar}
                    </div>
                    <div className="font-bold">{challengeData.createdBy}</div>
                    <div className="text-xs text-zinc-400">🔥 134 day streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl blur-xl opacity-40" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
                {[
                  { label: "Duration", value: `${challengeData.duration} days` },
                  { label: "Starts", value: challengeData.startDate },
                  { label: "Prize Pool", value: `₹${challengeData.stake * 2}`, highlight: true },
                  { label: "Status", value: "✅ Active" },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{label}</span>
                    <span className={`font-semibold ${highlight ? "text-yellow-400" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-sm text-zinc-300">
                Challenge is now active! Submit your daily proof before 11:59 PM every day. Good luck! 🚀
              </p>
            </div>

            <Link
              to="/dashboard"
              className="block w-full py-4 rounded-xl font-bold text-center bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5"
            >
              Go to Dashboard 🏠
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}