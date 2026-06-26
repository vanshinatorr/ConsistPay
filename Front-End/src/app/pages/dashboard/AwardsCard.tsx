import React, { useState } from "react";
import { Award, Flame, Shield, Gem, Crown, Swords, Info, Lock, X } from "lucide-react";
import confetti from "canvas-confetti";

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
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = [
    {
      id: "streak_7",
      name: "Streak Starter",
      desc: "You showed up for 7 days straight! This is where habit meets momentum.",
      requirement: "Reach a 7-day streak",
      unlocked: onboardingComplete && streak >= 7,
      colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      glowClass: "from-orange-500/20 to-red-500/20",
      icon: Flame,
    },
    {
      id: "consistency_90",
      name: "Consistency King",
      desc: "Maintained a $\ge 90\%$ consistency score. A true master of daily execution.",
      requirement: "90%+ Consistency score",
      unlocked: onboardingComplete && consistencyScore >= 90,
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      glowClass: "from-amber-500/20 to-yellow-500/20",
      icon: Crown,
    },
    {
      id: "gladiator",
      name: "DSA Gladiator",
      desc: "Stepped into the 1v1 consistency arena. High stakes, high discipline.",
      requirement: "Add funds/participate in battles",
      unlocked: onboardingComplete && battleBalance > 0,
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      glowClass: "from-rose-500/20 to-pink-500/20",
      icon: Swords,
    },
    {
      id: "grace_shield",
      name: "Shield of Grace",
      desc: "Saved your streak with streak-protecting Grace Coins. Always prepared.",
      requirement: "Keep 1+ Grace Coins",
      unlocked: onboardingComplete && graceCoins >= 1,
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      glowClass: "from-emerald-500/20 to-teal-500/20",
      icon: Shield,
    },
    {
      id: "elite",
      name: "Elite Member",
      desc: "Upgraded to Pro habit tracking. Dedicated to long-term compounding growth.",
      requirement: "Upgrade to Pro Plan",
      unlocked: onboardingComplete && plan.toLowerCase() === "pro",
      colorClass: "text-violet-400 bg-violet-500/10 border-violet-500/30",
      glowClass: "from-violet-500/20 to-fuchsia-500/20",
      icon: Gem,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const visibleBadges = showAll ? badges : badges.slice(0, 4);

  const handleBadgeClick = (badge: Badge) => {
    if (badge.unlocked) {
      setSelectedBadge(badge);
      // Trigger a satisfying confetti burst!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"]
      });
    }
  };

  return (
    <div className="relative group h-full">
      {/* Dynamic Keyframes for Glow and Metallic Shine */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine-sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes subtle-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hexagon-shine {
          position: relative;
          overflow: hidden;
        }
        .hexagon-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 30%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          pointer-events: none;
        }
        .hexagon-shine:hover::after {
          animation: shine-sweep 1.2s ease-in-out;
        }
        .unlocked-ring {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 1px dashed rgba(139, 92, 246, 0.3);
          animation: subtle-rotate 20s linear infinite;
        }
      `}} />

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

        {/* Badges List Container */}
        <div className="flex-1 flex flex-wrap items-center gap-3.5 py-1">
          {visibleBadges.map((badge) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={`relative group/badge flex items-center justify-center shrink-0 ${badge.unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                {/* Hexagon Shape Container */}
                <div className="relative w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-95 hexagon-shine">
                  {badge.unlocked ? (
                    <>
                      {/* Dashboard Glow and Spinning Ring */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.glowClass} blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300`} />
                      <div className="unlocked-ring" />
                      
                      {/* Hexagon SVG polygon */}
                      <svg className="absolute w-full h-full text-violet-950/20 group-hover/badge:text-violet-900/40 transition-all" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" stroke="rgba(139,92,246,0.3)" strokeWidth="3" />
                      </svg>
                      
                      {/* Icon overlay */}
                      <div className={`relative z-10 p-2.5 rounded-full ${badge.colorClass}`}>
                        <BadgeIcon className="w-5 h-5 fill-current/10" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Locked State Hexagon */}
                      <svg className="absolute w-full h-full text-zinc-900/50" viewBox="0 0 100 100" fill="currentColor">
                        <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      </svg>
                      <div className="relative z-10 p-2.5 text-zinc-600">
                        <Lock className="w-4 h-4" />
                      </div>
                    </>
                  )}
                </div>

                {/* Normal Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-44 bg-[#121216]/95 border border-white/[0.08] backdrop-blur-md rounded-xl p-3 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:scale-100 transition-all duration-200 z-50">
                  <div className="text-xs font-extrabold text-white mb-0.5">{badge.name}</div>
                  <p className="text-[10px] text-zinc-400 leading-normal">{badge.requirement}</p>
                  <div className="h-px bg-white/[0.06] my-1.5" />
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span className="text-[9px] text-zinc-500 font-medium">
                      {badge.unlocked ? "Click to Celebrate! 🎉" : "Locked"}
                    </span>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#121216] pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle Button */}
        {badges.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-[10px] font-bold text-zinc-400 hover:text-white transition-colors pt-2 border-t border-white/[0.02] cursor-pointer"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* ================= CELEBRATION MODAL (Wow Factor) ================= */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-350">
          {/* Card Container */}
          <div className="relative w-full max-w-md bg-[#0F0F13] border border-violet-500/30 rounded-3xl p-8 shadow-2xl text-center overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Glowing Backdrop inside Modal */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Giant Hexagon Badge Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <svg className="absolute w-full h-full text-violet-950/30" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" stroke="rgba(139,92,246,0.5)" strokeWidth="4" />
              </svg>
              <div className={`p-4 rounded-full ${selectedBadge.colorClass}`}>
                {React.createElement(selectedBadge.icon, { className: "w-10 h-10 fill-current/10" })}
              </div>
            </div>

            {/* Header Text */}
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-2 block">
              Achievement Unlocked
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              {selectedBadge.name}
            </h3>
            
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              {selectedBadge.desc}
            </p>

            {/* Verification Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold mb-6">
              <Award className="w-4 h-4" /> Verified Award
            </div>

            {/* Action button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/25 cursor-pointer"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AwardsCard;
