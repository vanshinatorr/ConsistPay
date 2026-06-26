import React, { useState } from "react";
import { Award, Flame, Swords, Shield, Gem, Crown, Info, Lock } from "lucide-react";

interface AwardsCardProps {
  streak: number;
  consistencyScore: number;
  battleBalance: number;
  graceCoins: number;
  plan: string;
  onboardingComplete?: boolean;
}

interface Badge {
  id: string;
  name: string;
  desc: string;
  requirement: string;
  unlocked: boolean;
  colorClass: string;
  glowClass: string;
  icon: any;
}

export function AwardsCard({
  streak,
  consistencyScore,
  battleBalance,
  graceCoins,
  plan,
  onboardingComplete = true,
}: AwardsCardProps) {
  const [showAll, setShowAll] = useState(false);

  const badges: Badge[] = [
    {
      id: "streak_7",
      name: "Streak Starter",
      desc: "Hit a 7-day consistency streak.",
      requirement: "Reach a 7-day streak",
      unlocked: onboardingComplete && streak >= 7,
      colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      glowClass: "from-orange-500/20 to-red-500/20",
      icon: Flame,
    },
    {
      id: "consistency_90",
      name: "Consistency King",
      desc: "Maintain a consistency score of 90% or above.",
      requirement: "90%+ Consistency score",
      unlocked: onboardingComplete && consistencyScore >= 90,
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      glowClass: "from-amber-500/20 to-yellow-500/20",
      icon: Crown,
    },
    {
      id: "gladiator",
      name: "DSA Gladiator",
      desc: "Step foot in the arena of active battles.",
      requirement: "Add funds/participate in battles",
      unlocked: onboardingComplete && battleBalance > 0,
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      glowClass: "from-rose-500/20 to-pink-500/20",
      icon: Swords,
    },
    {
      id: "grace_shield",
      name: "Shield of Grace",
      desc: "Possess at least one active streak-protecting Grace Coin.",
      requirement: "Keep 1+ Grace Coins",
      unlocked: onboardingComplete && graceCoins >= 1,
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      glowClass: "from-emerald-500/20 to-teal-500/20",
      icon: Shield,
    },
    {
      id: "elite",
      name: "Elite Member",
      desc: "Unlock the premium tier of Habit Tracking.",
      requirement: "Upgrade to Pro Plan",
      unlocked: onboardingComplete && plan.toLowerCase() === "pro",
      colorClass: "text-violet-400 bg-violet-500/10 border-violet-500/30",
      glowClass: "from-violet-500/20 to-fuchsia-500/20",
      icon: Gem,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const visibleBadges = showAll ? badges : badges.slice(0, 4);

  return (
    <div className="relative group h-full">
      {/* Glow backdrop */}
      <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

      <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-full min-h-[196px] shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Achievements
            </span>
            <span className="text-xs text-zinc-400 mt-0.5">My Awards</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            {unlockedCount} / {badges.length} Unlocked
          </span>
        </div>

        {/* Badges Container */}
        <div className="flex-1 flex flex-wrap items-center gap-3 py-1">
          {visibleBadges.map((badge) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={badge.id}
                className="relative group/badge flex items-center justify-center shrink-0"
              >
                {/* Hexagon Wrapper */}
                <div className="relative w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  {badge.unlocked ? (
                    <>
                      {/* Active Hexagon Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.glowClass} blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300`} />
                      <svg className="absolute w-full h-full text-violet-950/20 group-hover/badge:text-violet-900/40 transition-colors" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" stroke="rgba(139,92,246,0.3)" strokeWidth="3" />
                      </svg>
                      <div className={`relative z-10 p-2.5 rounded-full ${badge.colorClass}`}>
                        <BadgeIcon className="w-5 h-5 fill-current/10" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Locked Hexagon */}
                      <svg className="absolute w-full h-full text-zinc-900/50" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      </svg>
                      <div className="relative z-10 p-2.5 text-zinc-600">
                        <Lock className="w-4 h-4" />
                      </div>
                    </>
                  )}
                </div>

                {/* Tooltip Card (Premium style) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-44 bg-[#121216]/95 border border-white/[0.08] backdrop-blur-md rounded-xl p-3 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:scale-100 transition-all duration-200 z-50">
                  <div className="text-xs font-extrabold text-white mb-0.5">{badge.name}</div>
                  <p className="text-[10px] text-zinc-400 leading-normal">{badge.desc}</p>
                  <div className="h-px bg-white/[0.06] my-1.5" />
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span className="text-[9px] text-zinc-500 font-medium">
                      {badge.unlocked ? "Unlocked" : `Requires: ${badge.requirement}`}
                    </span>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#121216] pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More toggle */}
        {badges.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-[10px] font-bold text-zinc-400 hover:text-white transition-colors pt-2 border-t border-white/[0.02] cursor-pointer"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
export default AwardsCard;
