import { TrendingUp, Target, Award } from "lucide-react";

interface StatsRowProps {
  currentStreak: number;
  completedDays: number;
  missedDays: number;
  consistencyScore: number;
}

export function StatsRow({ currentStreak, completedDays, missedDays, consistencyScore }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
  );
}
