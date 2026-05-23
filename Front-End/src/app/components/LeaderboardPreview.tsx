import { Crown, Flame, TrendingUp } from "lucide-react";

export function LeaderboardPreview() {
  const topUsers = [
    { 
      rank: 1, 
      username: "code_ninja_47", 
      streak: 127, 
      score: 98,
      avatar: "🥷",
      color: "from-amber-500 to-yellow-600"
    },
    { 
      rank: 2, 
      username: "daily_grinder", 
      streak: 103, 
      score: 96,
      avatar: "⚡",
      color: "from-violet-500 to-purple-600"
    },
    { 
      rank: 3, 
      username: "streak_master", 
      streak: 89, 
      score: 94,
      avatar: "🎯",
      color: "from-emerald-500 to-teal-600"
    },
    { 
      rank: 4, 
      username: "consistent_coder", 
      streak: 76, 
      score: 91,
      avatar: "🚀",
      color: "from-blue-500 to-cyan-600"
    },
    { 
      rank: 5, 
      username: "habitual_dev", 
      streak: 68, 
      score: 89,
      avatar: "💎",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <section className="px-6 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-white/10 mb-6">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-zinc-300">Live Rankings</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-4">
            Compete with the{" "}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              best developers
            </span>
          </h2>
          <p className="text-xl text-zinc-400">See where you rank on the global leaderboard</p>
        </div>

        {/* Leaderboard card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10 bg-white/5">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-zinc-400">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Developer</div>
              <div className="col-span-3 text-center">Consistency</div>
              <div className="col-span-3 text-center">Streak</div>
            </div>
          </div>

          {/* Leaderboard entries */}
          <div className="divide-y divide-white/5">
            {topUsers.map((user, index) => (
              <div
                key={user.rank}
                className="px-8 py-5 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    {user.rank <= 3 ? (
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                          {user.rank}
                        </div>
                        {user.rank === 1 && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-500" />
                        )}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-zinc-500">
                        {user.rank}
                      </div>
                    )}
                  </div>

                  {/* Developer */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {user.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {user.username}
                      </div>
                      <div className="text-xs text-zinc-500">Active now</div>
                    </div>
                  </div>

                  {/* Consistency Score */}
                  <div className="col-span-3 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-2xl font-bold">{user.score}</span>
                    <span className="text-sm text-zinc-500">/100</span>
                  </div>

                  {/* Streak */}
                  <div className="col-span-3 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-orange-400">{user.streak}</span>
                      <span className="text-xs text-zinc-500">days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-white/10 bg-white/5 text-center">
            <button className="text-violet-400 hover:text-violet-300 font-semibold transition-colors flex items-center gap-2 mx-auto">
              View Full Leaderboard
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        </div>

        {/* Your rank teaser */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Start your streak today and see where you rank 🚀
          </p>
        </div>
      </div>
    </section>
  );
}
