import { Code2, ArrowLeft, Settings, Award, Target, TrendingUp, Calendar, Shield, Zap, Star, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

export function Profile() {
  // Mock data
  const user = {
    name: "Yuvraj Singh",
    username: "yuvraj_codes",
    avatar: "YU",
    joinDate: "January 2026",
    plan: "Pro",
  };

  const stats = {
    currentStreak: 47,
    longestStreak: 89,
    completedDays: 98,
    missedDays: 9,
    consistencyScore: 82,
    totalChallenges: 3,
    challengesWon: 2,
    coins: 235,
    graceCoins: 2,
  };

  const badges = [
    { icon: "🔥", label: "47 Day Streak", color: "from-orange-500/20 to-red-500/20", border: "border-orange-500/30", earned: true },
    { icon: "⚡", label: "First Challenge", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30", earned: true },
    { icon: "🏆", label: "Challenge Winner", color: "from-yellow-500/20 to-yellow-600/20", border: "border-yellow-500/30", earned: true },
    { icon: "💎", label: "30 Day Streak", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", earned: true },
    { icon: "🌙", label: "Night Coder", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", earned: false },
    { icon: "👑", label: "Leaderboard Top 3", color: "from-yellow-500/20 to-yellow-600/20", border: "border-yellow-500/30", earned: false },
  ];

  const completionRate = Math.round((stats.completedDays / (stats.completedDays + stats.missedDays)) * 100);

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
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </div>
            <Link to="/settings" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-zinc-400" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Profile Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30">
                    {user.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-zinc-400 text-sm">@{user.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold">
                      ⚡ {user.plan}
                    </span>
                    <span className="text-xs text-zinc-500">Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm text-zinc-400">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.currentStreak}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Current Streak</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.consistencyScore}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Score / 100</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-violet-400">#{8}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Global Rank</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Performance Stats
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Current Streak", value: `${stats.currentStreak} days`, icon: "🔥", color: "text-orange-400" },
                { label: "Longest Streak", value: `${stats.longestStreak} days`, icon: "⚡", color: "text-yellow-400" },
                { label: "Completed Days", value: stats.completedDays, icon: "✅", color: "text-emerald-400" },
                { label: "Missed Days", value: stats.missedDays, icon: "❌", color: "text-red-400" },
                { label: "Challenges Won", value: `${stats.challengesWon}/${stats.totalChallenges}`, icon: "🏆", color: "text-yellow-400" },
                { label: "Completion Rate", value: `${completionRate}%`, icon: "📊", color: "text-violet-400" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="text-xl">{icon}</div>
                  <div>
                    <div className={`font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-zinc-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Consistency Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Overall Consistency</span>
                <span className="font-semibold text-emerald-400">{completionRate}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coin & Grace */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-2">🪙</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.coins}</div>
              <div className="text-xs text-zinc-400 mt-1">Coin Balance</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <div className="text-3xl font-bold text-emerald-400">{stats.graceCoins}</div>
              <div className="text-xs text-zinc-400 mt-1">Grace Coins</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Badges
              <span className="ml-auto text-xs text-zinc-500">{badges.filter(b => b.earned).length}/{badges.length} earned</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {badges.map(({ icon, label, color, border, earned }) => (
                <div
                  key={label}
                  className={`relative p-4 rounded-xl border text-center transition-all
                    ${earned
                      ? `bg-gradient-to-br ${color} ${border}`
                      : "bg-white/3 border-white/5 opacity-40 grayscale"
                    }`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-xs font-semibold text-zinc-300 leading-tight">{label}</div>
                  {!earned && (
                    <div className="absolute top-1 right-1 text-xs">🔒</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  Pro Plan
                </h2>
                <p className="text-zinc-400 text-sm mt-1">All features unlocked • ₹49/month</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full">
                  ✅ Active
                </span>
                <Link to="/pricing" className="text-xs text-violet-400 hover:text-violet-300">
                  Manage Plan →
                </Link>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}