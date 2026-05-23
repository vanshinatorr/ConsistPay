import { Code2, Bell, Calendar, TrendingUp, Target, Award, Users, ChevronRight, CheckCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";

const motivationalLines = [
  "You showed up. That's what counts.",
  "₹5 secured. Streak intact. 🔥",
  "Commitment protected. See you tomorrow.",
  "Another day coded. Another day closer.",
  "Small wins compound. Keep going.",
  "You didn't quit today. That's enough.",
  "Consistency beats talent. Proven today.",
  "Future you is grateful for today's you.",
  "The grind is quiet. The results are loud.",
  "One problem a day keeps mediocrity away.",
  "You kept your word to yourself. 💪",
  "Champions show up even when they don't feel like it.",
  "Progress > Perfection. Always.",
  "Streak alive. Mind sharp. Keep moving.",
  "Today's effort is tomorrow's edge.",
];

export function Dashboard() {
  const [solutionLink, setSolutionLink] = useState("");
  const [hasActiveChallenge, setHasActiveChallenge] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  // Daily motivational line — same all day, changes next day
  const todayLine = motivationalLines[new Date().getDate() % motivationalLines.length];

  // Midnight countdown timer
  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ h, m, s });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionLink) return;
    setSubmitted(true);
  };


  // Mock data
  const currentStreak = 47;
  const completedDays = 38;
  const missedDays = 9;
  const consistencyScore = 82;
  const coins = 235;
  const dailyCommitment = 5;
  const graceCoins = 2;
  const monthlyCoins = 150;
  const coinsUsed = monthlyCoins - coins;

  // Calendar data for March 2026
  const currentMonth = "March 2026";
  const daysInMonth = 31;


  const firstDayOfMonth = 0; // Sunday
  
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    let status: 'completed' | 'missed' | 'pending' = 'pending';
    if (day < 20) {
      status = Math.random() > 0.2 ? 'completed' : 'missed';
    }
    return { day, status };
  });

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", streak: 156, avatar: "SC" },
    { rank: 2, name: "Alex Kumar", streak: 134, avatar: "AK" },
    { rank: 3, name: "Jordan Smith", streak: 98, avatar: "JS" },
    { rank: 8, name: "You", streak: 47, avatar: "YU", isCurrentUser: true },
  ];

  const friendChallenge = {
    friendName: "Alex Kumar",
    friendAvatar: "AK",
    yourProgress: 47,
    friendProgress: 134,
    daysRemaining: 13,
    totalDays: 60
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0D0D0F' }}>
      {/* Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </Link>

            {/* Title */}
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg sm:text-xl font-semibold">Dashboard</h1>

  
  {/* User Controls */}
            <div className="flex items-center gap-3">
<Link to="/notifications" className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
<Bell className="w-5 h-5" />
<span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full"></span>
</Link>
<Link to="/profile" className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm">
  YU
</Link>


            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Current Streak */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-orange-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">🔥</div>
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{currentStreak}</div>
              <div className="text-sm text-zinc-400">Current Streak</div>
            </div>
          </div>

          {/* Completed */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">✅</div>
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{completedDays}</div>
              <div className="text-sm text-zinc-400">Completed</div>
            </div>
          </div>

          {/* Missed */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-red-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">❌</div>
              </div>
              <div className="text-3xl font-bold mb-1">{missedDays}</div>
              <div className="text-sm text-zinc-400">Missed Days</div>
            </div>
          </div>

          {/* Consistency Score */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">📊</div>
                <Award className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{consistencyScore}</div>
              <div className="text-sm text-zinc-400">Score / 100</div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">



            {/* Today's Task Card */}
            
<div className="relative">
  <div className={`absolute inset-0 bg-gradient-to-br ${submitted ? 'from-emerald-500/20 to-teal-500/20' : 'from-violet-500/20 to-purple-500/20'} rounded-2xl blur-xl opacity-50`} />
  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold">Today's Challenge</h2>
      <span className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border
        ${submitted
          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          : 'text-zinc-400 bg-white/5 border-white/10'
        }`}>
        {submitted ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-zinc-500" />}
        {submitted ? 'Completed' : 'Pending'}
      </span>
    </div>

    {/* STATE 1 — Pending */}
    {!submitted && (
      <>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">Solved a coding problem today?</h3>
          <p className="text-zinc-400 text-sm">
            Paste your solution link from LeetCode, Code360 or any platform
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="solution" className="block text-sm text-zinc-400 mb-2">
              Paste your solution link
            </label>
            <Input
              id="solution"
              type="url"
              placeholder="https://leetcode.com/submissions/detail/..."
              value={solutionLink}
              onChange={(e) => setSolutionLink(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={!solutionLink}
            className={`w-full py-3 font-semibold rounded-lg transition-all duration-300
              ${solutionLink
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50'
                : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/10'
              }`}
          >
            Submit Solution
          </button>
        </form>
      </>
    )}

    {/* STATE 2 — Success */}
    {submitted && (
      <div className="text-center py-4">
        {/* Green Check */}
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold mb-1">Proof Submitted!</h3>
        <p className="text-zinc-400 text-sm mb-5">Today's coding session is locked in.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <div className="text-2xl font-black text-emerald-400">48</div>
            <div className="text-xs text-zinc-400 mt-0.5">🔥 Day Streak</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <div className="text-2xl font-black text-yellow-400">₹5</div>
            <div className="text-xs text-zinc-400 mt-0.5">🪙 Secured today</div>
          </div>
        </div>

        {/* Motivational Line */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
          <p className="text-sm text-zinc-300 italic">"{todayLine}"</p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-3">
            <Lock className="w-3.5 h-3.5" />
            Next submission unlocks in
          </div>
          <div className="flex items-center justify-center gap-3">
            {[
              { val: timeLeft.h, label: 'hrs' },
              { val: timeLeft.m, label: 'min' },
              { val: timeLeft.s, label: 'sec' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                  {String(val).padStart(2, '0')}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

  </div>
</div>

            {/* Calendar Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {currentMonth}
                  </h2>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-2">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs text-zinc-500 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    
                    {/* Actual days */}
                    {calendarDays.map(({ day, status }) => (
                      <div
                        key={day}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                          ${status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
                          ${status === 'missed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                          ${status === 'pending' ? 'bg-white/5 text-zinc-400 border border-white/10' : ''}
                        `}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/50" />
                    <span className="text-xs text-zinc-400">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500/40 border border-red-500/50" />
                    <span className="text-xs text-zinc-400">Missed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-white/10 border border-white/20" />
                    <span className="text-xs text-zinc-400">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Coin Balance Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">Coin Balance</h2>
                
                <div className="text-center mb-6">
                  <div className="text-5xl mb-2">🪙</div>
                  <div className="text-4xl font-bold mb-1">{coins}</div>
                  <div className="text-sm text-zinc-400">coins remaining</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Daily commitment:</span>
                    <span className="font-semibold">{dailyCommitment} coins</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Grace coins:</span>
                    <span className="font-semibold text-emerald-400">{graceCoins} available</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Monthly usage</span>
                    <span className="text-xs text-zinc-500">{coinsUsed} / {monthlyCoins}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${(coinsUsed / monthlyCoins) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>






{/* Friend Challenge Card */}
<div className="relative">
<div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
<div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
<Users className="w-5 h-5" />
      Friend Challenge
</h2>
{hasActiveChallenge ? (
// State 2 — Active Challenge
<div className="space-y-4">
<div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
{friendChallenge.friendAvatar}
</div>
<div>
<div className="font-semibold">{friendChallenge.friendName}</div>
<div className="text-xs text-zinc-400">{friendChallenge.daysRemaining} days left</div>
</div>
</div>
<span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
            🔴 Behind
</span>
</div>
<div className="space-y-3">
<div>
<div className="flex justify-between text-sm mb-2">
<span className="text-zinc-400">You</span>
<span className="font-semibold">{friendChallenge.yourProgress}/{friendChallenge.totalDays} days</span>
</div>
<div className="h-2 bg-white/5 rounded-full overflow-hidden">
<div
className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
style={{ width: `${(friendChallenge.yourProgress / friendChallenge.totalDays) * 100}%` }}
/>
</div>
</div>
<div>
<div className="flex justify-between text-sm mb-2">
<span className="text-zinc-400">{friendChallenge.friendName}</span>
<span className="font-semibold">{friendChallenge.friendProgress}/{friendChallenge.totalDays} days</span>
</div>
<div className="h-2 bg-white/5 rounded-full overflow-hidden">
<div
className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
style={{ width: `${(friendChallenge.friendProgress / friendChallenge.totalDays) * 100}%` }}
/>
</div>
</div>
</div>
</div>
    ) : (



      // State 1 — No Active Challenge
<div className="space-y-4">
<div className="text-center py-4">
<div className="text-4xl mb-3">🤝</div>
<p className="text-zinc-400 text-sm mb-1">No active challenge</p>
<p className="text-zinc-500 text-xs">Challenge a friend and put your streak to the test!</p>
</div>
<Link
to="/create-challenge"
className="block w-full py-3 text-center bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
>
  + Create Challenge
</Link>
<button
  onClick={() => setShowJoinModal(true)}
  className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
>
  Join with Code
</button>
<p className="text-center text-xs text-zinc-500">Pro feature • ₹19 entry + stake</p>
</div>
    )}
</div>
</div>


{/* Leaderboard Preview */}
            <div className="relative">
<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-50" />
<div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
<div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-bold flex items-center gap-2">
<Award className="w-5 h-5" />
                    Leaderboard
</h2>
<Link to="/leaderboard" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    View All
<ChevronRight className="w-4 h-4" />
</Link>
</div>
<div className="space-y-3">
{leaderboard.map((user) => (
<div
key={user.rank}
className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all
${user.isCurrentUser 
? 'bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10' 
: 'bg-white/5 border-white/10 hover:border-white/20'
                        }
                      `}
>
<div className="flex items-center gap-3">
<div className={`
                          w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg
${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : ''}
${user.rank === 2 ? 'bg-zinc-400/20 text-zinc-300' : ''}
${user.rank === 3 ? 'bg-orange-500/20 text-orange-400' : ''}
${user.rank > 3 ? 'bg-white/10 text-zinc-400' : ''}
                        `}>
{user.rank}
</div>
<div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
${user.isCurrentUser 
? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
: 'bg-gradient-to-br from-violet-400 to-purple-600'
                          }
                        `}>
{user.avatar}
</div>
<div>
<div className={`font-semibold ${user.isCurrentUser ? 'text-violet-300' : ''}`}>
{user.name}
</div>
<div className="text-xs text-zinc-400">🔥 {user.streak} day streak</div>
</div>
</div>
{user.rank <= 3 && (
<div className="text-2xl">
{user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
</div>
                      )}
</div>
                  ))}
</div>
</div>
</div>
</div>
</div>



     {/* Join with Code Modal */}
      {showJoinModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJoinModal(false)} />
<div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
<h2 className="text-xl font-bold mb-2">Join a Challenge</h2>
<p className="text-zinc-400 text-sm mb-6">Enter the invite code shared by your friend</p>
<div className="mb-4">
<label className="block text-sm text-zinc-400 mb-2">Invite Code</label>
<input
type="text"
placeholder="e.g. CP-X7K2M"
value={joinCode}
onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 font-mono tracking-widest text-center text-lg uppercase"
/>
</div>
<div className="flex gap-3">
<button
onClick={() => setShowJoinModal(false)}
className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
>
                Cancel
</button>
<Link
  to={`/join-challenge/${joinCode}`}
  className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm text-center
    ${joinCode.length >= 5
      ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 pointer-events-auto"
      : "bg-white/5 text-zinc-600 pointer-events-none"
    }`}
>
  Join Challenge
</Link>
</div>
</div>
</div>
      )}
</main>
</div>
  );
}