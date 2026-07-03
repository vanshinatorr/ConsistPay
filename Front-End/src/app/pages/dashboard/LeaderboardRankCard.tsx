import React from "react";
import { Trophy, BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeaderboardRankCardProps {
  rank: number;
  totalUsers: number;
  loading: boolean;
  onboardingComplete?: boolean;
}

export function LeaderboardRankCard({
  rank,
  totalUsers,
  loading,
  onboardingComplete = true,
}: LeaderboardRankCardProps) {
  const navigate = useNavigate();

  return (
    <div className="relative group h-full">
      {/* Premium Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-[249px] min-h-[249px] shadow-xl overflow-hidden">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Leaderboard
            </span>
            <span className="text-xs text-zinc-400 mt-0.5">Global Rank</span>
          </div>
          <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
        </div>

        {/* Content */}
        <div className="my-4 relative z-10 flex items-center gap-4">
          <div className="text-violet-500/30 font-black text-3xl shrink-0">
            <BarChart3 className="w-8 h-8 rotate-90" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight leading-none flex items-baseline">
              {loading ? (
                <div className="h-8 w-16 bg-white/5 animate-pulse rounded" />
              ) : !onboardingComplete ? (
                "-"
              ) : (
                `#${rank}`
              )}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 font-medium">
              Based on global streak and solutions verified
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/leaderboard")}
          className="w-full py-2 bg-white/5 border border-white/[0.04] rounded-xl hover:bg-violet-600 hover:border-violet-500/30 hover:text-white transition-all text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer relative z-10 group/btn"
        >
          View Leaderboard
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
export default LeaderboardRankCard;
