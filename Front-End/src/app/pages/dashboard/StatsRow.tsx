import { TrendingUp, Target, Award } from "lucide-react";

interface StatsRowProps {
  currentStreak: number;
  completedDays: number;
  missedDays: number;
  consistencyScore: number;
  onboardingComplete?: boolean;
}

export function StatsRow({
  currentStreak,
  completedDays,
  missedDays,
  consistencyScore,
  onboardingComplete = true,
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-orange-500/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">🔥</div>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>

          <div className="text-3xl font-bold mb-1">
            {onboardingComplete ? currentStreak : "-"}
          </div>

          <div className="text-sm text-zinc-300">
            Current Streak
          </div>

          <div className="text-xs text-zinc-500 mt-1">
            Active for {currentStreak} day{currentStreak !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">✅</div>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="text-3xl font-bold mb-1">
            {onboardingComplete ? completedDays : "-"}
          </div>

          <div className="text-sm text-zinc-300">
            Completed
          </div>

          <div className="text-xs text-zinc-500 mt-1">
            Verified submissions
          </div>
        </div>
      </div>

      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-red-500/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">❌</div>
          </div>

          <div className="text-3xl font-bold mb-1">
            {onboardingComplete ? missedDays : "-"}
          </div>

          <div className="text-sm text-zinc-300">
            Missed Days
          </div>

          <div className="text-xs text-zinc-500 mt-1">
            This challenge cycle
          </div>
        </div>
      </div>

      
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-violet-500/30 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">📊</div>
            <Award className="w-4 h-4 text-violet-400" />
          </div>

          <div className="text-3xl font-bold mb-1">
            {onboardingComplete ? consistencyScore : "-"}
          </div>

          <div className="text-sm text-zinc-300">
            Consistency Score
          </div>

          <div className="text-xs text-zinc-500 mt-1">
            Based on verified activity
          </div>
        </div>
      </div>
    </div>
  );
}