import React from "react";

interface RecentSolve {
  platform: string;
  name: string;
  difficulty: string;
  topic: string;
  time: string;
}

interface RecentSolvesProps {
  recentSolves: RecentSolve[];
}

export function RecentSolves({ recentSolves }: RecentSolvesProps) {
  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-emerald-400";
    if (d === "Medium") return "text-orange-400";
    if (d === "Hard") return "text-red-400";
    return "text-zinc-400";
  };

  const getPlatformStyle = (p: string) => {
    if (p === "LC") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (p === "GFG") return "bg-green-500/20 text-green-400 border-green-500/30";
    return "bg-white/5 text-zinc-400 border-white/[0.04]";
  };

  return (
    <div className="w-full">
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 h-full">
          <h2 className="text-lg font-bold mb-4">Recent Solves</h2>
          <div className="space-y-2">
            {recentSolves.length > 0 ? (
              recentSolves.slice(0, 3).map((solve, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 bg-white/[0.01] rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded border ${getPlatformStyle(solve.platform)}`}>{solve.platform}</span>
                  <span className="font-semibold text-sm truncate max-w-[150px] sm:max-w-none">{solve.name}</span>
                  <span className={`text-xs font-medium ${getDifficultyColor(solve.difficulty)}`}>{solve.difficulty}</span>
                  <span className="text-zinc-600 hidden sm:inline">•</span>
                  <span className="text-xs text-zinc-500 hidden sm:inline truncate">{solve.topic}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500 ml-auto shrink-0">{solve.time}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-zinc-555 border border-dashed border-white/[0.04] rounded-xl">
                <span className="text-sm">No recent solves yet.</span>
                <span className="text-xs mt-1">Submit your first problem to start your streak!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
