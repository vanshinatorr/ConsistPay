import React, { useState } from "react";
import { Flame, Crown, Trophy, Award, Shield, Gem, Sparkles, Lock, X, Info } from "lucide-react";
import confetti from "canvas-confetti";

interface LeetCodeBadge {
  id: string;
  name: string;
  shortName: string;
  hoverText: string;
  icon: string;
  creationDate: string;
}

interface AwardsCardProps {
  linkedPlatforms?: {
    platform: string;
    username: string;
    isVerified: boolean;
    verificationToken: string;
    badges?: LeetCodeBadge[];
  }[];
  streak?: number;
  maxStreak?: number;
  consistencyScore?: number;
  totalSolved?: number;
  totalProblemsSolved?: number;
  graceCoins?: number;
  plan?: string;
  dailyCommitment?: number;
}

interface UnifiedBadge {
  id: string;
  name: string;
  desc: string;
  requirement: string;
  unlocked: boolean;
  isLeetCode: boolean;
  iconPath?: string;
  iconLucide?: any;
  colorClass: string;
  glowClass: string;
  gradId: string;
  currentProgress: number;
  targetProgress: number;
  percentage: number;
  unit: string;
}

export function AwardsCard({
  linkedPlatforms = [],
  streak = 0,
  maxStreak = 0,
  totalSolved = 0,
  totalProblemsSolved = 0
}: AwardsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<UnifiedBadge | null>(null);
  const [wigglingId, setWigglingId] = useState<string | null>(null);

  // Find verified LeetCode profile linkage
  const leetcodeLink = linkedPlatforms.find(
    (p) => p.platform === "LeetCode" && p.isVerified
  );
  const leetcodeBadges = leetcodeLink?.badges || [];

  const getBadgeIconUrl = (iconPath: string) => {
    if (!iconPath) return "";
    if (iconPath.startsWith("http")) return iconPath;
    return `https://leetcode.com${iconPath}`;
  };

  // High-value, underrated local milestones (LeetCode glossy medal styling)
  const localMilestones = [
    {
      id: "streak_7",
      name: "7-Day Streak",
      desc: "Unlocked a 7-day consistency streak! You showed up for a full week straight.",
      requirement: "Reach a 7-day streak",
      unlocked: streak >= 7 || maxStreak >= 7,
      isLeetCode: false,
      iconLucide: Flame,
      colorClass: "text-amber-500",
      glowClass: "from-orange-500/20 to-red-500/20",
      gradId: "bronzeGrad",
      currentProgress: Math.max(streak, maxStreak),
      targetProgress: 7,
      unit: "days"
    },
    {
      id: "streak_15",
      name: "15-Day Streak",
      desc: "Unlocked a 15-day consistency streak! Officially building an unstoppable coding habit.",
      requirement: "Reach a 15-day streak",
      unlocked: streak >= 15 || maxStreak >= 15,
      isLeetCode: false,
      iconLucide: Award,
      colorClass: "text-slate-300",
      glowClass: "from-slate-400/20 to-zinc-200/20",
      gradId: "silverGrad",
      currentProgress: Math.max(streak, maxStreak),
      targetProgress: 15,
      unit: "days"
    },
    {
      id: "streak_30",
      name: "30-Day Streak",
      desc: "Legendary 30-day streak! Consistency level: Master. You have ultimate discipline.",
      requirement: "Reach a 30-day streak",
      unlocked: streak >= 30 || maxStreak >= 30,
      isLeetCode: false,
      iconLucide: Crown,
      colorClass: "text-yellow-400",
      glowClass: "from-yellow-400/20 to-amber-500/20",
      gradId: "goldGrad",
      currentProgress: Math.max(streak, maxStreak),
      targetProgress: 30,
      unit: "days"
    },
    {
      id: "streak_100",
      name: "100-Day Streak",
      desc: "Consistency Legend! Hit an absolute milestone of 100 days of coding.",
      requirement: "Reach a 100-day streak",
      unlocked: streak >= 100 || maxStreak >= 100,
      isLeetCode: false,
      iconLucide: Trophy,
      colorClass: "text-violet-400",
      glowClass: "from-violet-500/25 to-pink-500/25",
      gradId: "legendGrad",
      currentProgress: Math.max(streak, maxStreak),
      targetProgress: 100,
      unit: "days"
    },
    {
      id: "solved_50",
      name: "50 Solved",
      desc: "Solved 50+ DSA problems overall. You are writing clean, efficient, and logical code.",
      requirement: "Solve 50+ coding problems",
      unlocked: totalProblemsSolved >= 50,
      isLeetCode: false,
      iconLucide: Gem,
      colorClass: "text-teal-400",
      glowClass: "from-emerald-500/20 to-teal-500/20",
      gradId: "emeraldGrad",
      currentProgress: totalProblemsSolved,
      targetProgress: 50,
      unit: "solved"
    },
    {
      id: "solved_100",
      name: "100 Solved",
      desc: "Supercommitter! Solved 100+ coding problems overall. Incredible DSA scaling capability.",
      requirement: "Solve 100+ coding problems",
      unlocked: totalProblemsSolved >= 100,
      isLeetCode: false,
      iconLucide: Sparkles,
      colorClass: "text-rose-400",
      glowClass: "from-rose-500/25 to-red-500/25",
      gradId: "rubyGrad",
      currentProgress: totalProblemsSolved,
      targetProgress: 100,
      unit: "solved"
    }
  ].map(m => ({
    ...m,
    percentage: Math.min(100, Math.max(0, (m.currentProgress / m.targetProgress) * 100))
  }));

  // 2. Map LeetCode badges dynamically into the unified interface
  const mappedLeetcodeBadges = leetcodeBadges.map((lb) => ({
    id: lb.id,
    name: lb.name,
    desc: lb.hoverText || "Official verified LeetCode milestone badge.",
    requirement: `Synced LeetCode badge (${lb.shortName})`,
    unlocked: true,
    isLeetCode: true,
    iconPath: lb.icon,
    colorClass: "text-violet-400",
    glowClass: "from-violet-500/25 to-indigo-500/25",
    gradId: "lcGrad",
    currentProgress: 100,
    targetProgress: 100,
    percentage: 100,
    unit: "%"
  }));

  // Merge local milestones and LeetCode badges
  const allBadges: UnifiedBadge[] = [...mappedLeetcodeBadges, ...localMilestones];

  // Sort: Unlocked first, then by progress percentage descending
  const sortedBadges = [...allBadges].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return b.percentage - a.percentage;
  });

  const visibleBadges = showAll ? sortedBadges : sortedBadges.slice(0, 6);

  const fireCelebrationConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"]
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B"]
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B"]
      });
    }, 350);
  };

  const handleBadgeClick = (badge: UnifiedBadge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      fireCelebrationConfetti();
    } else {
      setWigglingId(badge.id);
      setTimeout(() => {
        setWigglingId(null);
      }, 400);
    }
  };

  return (
    <div className="relative group h-full">
      {/* SVG defs for premium metallic gradients */}
      <svg className="hidden">
        <defs>
          <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F1F5F9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F472B6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D946EF" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#F87171" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#DB2777" stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine-sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes card-bounce {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg) scale(0.95); }
          50% { transform: rotate(8deg) scale(1.05); }
          75% { transform: rotate(-4deg) scale(0.98); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out;
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
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          pointer-events: none;
        }
        .hexagon-shine:hover::after {
          animation: shine-sweep 1.2s ease-in-out;
        }
        .celebration-modal-card {
          animation: card-bounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .sunburst-rays {
          width: 320px;
          height: 320px;
          background-image: repeating-conic-gradient(
            from 0deg,
            rgba(139, 92, 246, 0.08) 0deg 15deg,
            transparent 15deg 30deg
          );
          border-radius: 50%;
          animation: spin-slow 25s linear infinite;
        }
      `}} />

      {/* Ambient outer glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

      <div className="relative bg-white dark:bg-[#0F0F13] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-full min-h-[220px] shadow-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-white/[0.02] pb-3">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Achievements
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">My Badges</span>
          </div>
        </div>

        {/* Badges Display Grid (Responsive Columns matching LeetCode visual rhythm) */}
        <div className="flex-1 flex flex-wrap items-center justify-start gap-4 py-2">
          {visibleBadges.map((badge) => {
            const isWiggling = wigglingId === badge.id;
            return (
              <div
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={`relative group/badge flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${
                  isWiggling ? "animate-wiggle" : ""
                }`}
              >
                {/* Hexagon shape framing container */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden hexagon-shine">
                    {badge.unlocked ? (
                      <>
                        {/* Glow backing */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${badge.glowClass} blur-md opacity-40 group-hover/badge:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Hexagon polygon borders filled with metallic SVG gradients */}
                        <svg className="absolute w-full h-full text-zinc-150 dark:text-white/[0.03]" viewBox="0 0 100 100" fill="none">
                          <polygon 
                            points="50,5 93,25 93,75 50,95 7,75 7,25" 
                            fill={badge.isLeetCode ? "rgba(139, 92, 246, 0.15)" : `url(#${badge.gradId})`}
                            stroke="rgba(255, 255, 255, 0.15)" 
                            strokeWidth="3" 
                            className="transition-colors group-hover/badge:stroke-white/30"
                          />
                        </svg>

                        {/* Image for LeetCode badge, Lucide icon for local milestone badge */}
                        {badge.isLeetCode && badge.iconPath ? (
                          <img
                            src={getBadgeIconUrl(badge.iconPath)}
                            alt={badge.name}
                            className="w-8.5 h-8.5 object-contain relative z-10 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.2)]"
                          />
                        ) : (
                          <div className={`relative z-15 p-2 rounded-full ${badge.colorClass} drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]`}>
                            {React.createElement(badge.iconLucide, { className: "w-5 h-5 fill-current/10" })}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 to-zinc-950/10 blur-md opacity-0 group-hover/badge:opacity-40 transition-opacity duration-300" />
                        
                        <svg className="absolute w-full h-full text-zinc-100/60 dark:text-white/[0.01]" viewBox="0 0 100 100" fill="none">
                          <polygon 
                            points="50,5 93,25 93,75 50,95 7,75 7,25" 
                            stroke="rgba(255,255,255,0.03)" 
                            strokeWidth="2.5" 
                            className="transition-colors group-hover/badge:stroke-zinc-500/20"
                          />
                        </svg>

                        <div className="relative z-15 p-2 rounded-full filter grayscale opacity-20 group-hover/badge:opacity-55 transition-all">
                          {React.createElement(badge.iconLucide, { className: "w-5 h-5 fill-current/10" })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Tiny Lock Icon on top-right of locked badges */}
                  {!badge.unlocked && (
                    <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center text-zinc-400 shadow-md z-25">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Hover Tooltip with Live Progress */}
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-48 bg-[#0F0F13]/98 border border-white/[0.08] backdrop-blur-md rounded-xl p-3.5 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:scale-100 group-hover/badge:pointer-events-auto transition-all duration-200 z-50 hover:border-violet-500/40"
                >
                  <div className="absolute top-full left-0 right-0 h-4 bg-transparent -translate-y-1" />
                  <div className="text-[11px] font-black text-white text-left tracking-wide leading-tight mb-1 flex items-center justify-between gap-1.5">
                    <span>{badge.name}</span>
                    {!badge.unlocked && <Lock className="w-3 h-3 text-zinc-500 shrink-0" />}
                  </div>
                  <p className="text-[9.5px] text-zinc-400 text-left leading-normal mb-2.5">
                    {badge.requirement}
                  </p>
                  
                  {/* Progress tracker */}
                  {!badge.isLeetCode && (
                    <div className="space-y-1.5 mb-2">
                      <div className="flex justify-between items-center text-[8.5px] text-zinc-500 font-bold uppercase tracking-wider">
                        <span>Progress</span>
                        <span className="text-zinc-350">{badge.currentProgress} / {badge.targetProgress} {badge.unit}</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${badge.unlocked ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-zinc-650"} transition-all duration-500`}
                          style={{ width: `${badge.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-white/[0.06] my-2" />
                  <div className="flex items-center gap-1 justify-start text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                    <Info className="w-2.5 h-2.5 shrink-0" />
                    <span>{badge.unlocked ? "Tap to Celebrate" : "Locked Milestone"}</span>
                  </div>
                  
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0F0F13] pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle Button */}
        {sortedBadges.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-[10px] font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-white transition-colors pt-2.5 border-t border-zinc-100 dark:border-white/[0.02] cursor-pointer"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* ================= CELEBRATION MODAL OVERLAY ================= */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="celebration-modal-card relative w-full max-w-sm bg-[#0F1018] border border-violet-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.1)] text-center overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/25 rounded-full blur-[60px] pointer-events-none" />
            
            {selectedBadge.unlocked && (
              <div className="sunburst-rays absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
            )}

            {/* Close Button */}
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Giant Hexagon framed Badge Logo */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center z-10">
              <svg className={`absolute w-full h-full ${selectedBadge.unlocked ? "text-violet-950/30" : "text-zinc-950/40"}`} viewBox="0 0 100 100" fill="none">
                <polygon 
                  points="50,5 93,25 93,75 50,95 7,75 7,25" 
                  fill={selectedBadge.isLeetCode ? "rgba(139, 92, 246, 0.15)" : `url(#${selectedBadge.gradId})`}
                  stroke={selectedBadge.unlocked ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"} 
                  strokeWidth="4" 
                />
              </svg>
              {selectedBadge.isLeetCode && selectedBadge.iconPath ? (
                <img
                  src={getBadgeIconUrl(selectedBadge.iconPath)}
                  alt={selectedBadge.name}
                  className="w-14 h-14 object-contain relative z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
                />
              ) : (
                <div className={`p-4 rounded-full transition-all duration-300 ${selectedBadge.unlocked ? selectedBadge.colorClass : `${selectedBadge.colorClass} filter grayscale opacity-40`} drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]`}>
                  {React.createElement(selectedBadge.iconLucide, { className: "w-10 h-10 fill-current/10" })}
                </div>
              )}
            </div>

            {/* Verification Header Tag */}
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 block z-10 ${selectedBadge.unlocked ? "text-violet-400" : "text-zinc-500"}`}>
              {selectedBadge.unlocked 
                ? (selectedBadge.isLeetCode ? "LeetCode Achievement" : "Milestone Achievement") 
                : "Locked Achievement"}
            </span>
            
            <h3 className="text-xl font-black text-white mb-2.5 z-10 leading-snug">
              {selectedBadge.name}
            </h3>
            
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 z-10">
              {selectedBadge.desc}
            </p>

            {/* Requirement / Progress Details for Locked Badges */}
            {!selectedBadge.unlocked && (
              <div className="mb-6 px-4.5 py-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-left z-10 relative">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Requirement</div>
                <div className="text-xs text-zinc-300 leading-relaxed mb-4">{selectedBadge.requirement}</div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-semibold">Completion Progress</span>
                    <span className="text-zinc-350 font-extrabold">{selectedBadge.currentProgress} / {selectedBadge.targetProgress} {selectedBadge.unit}</span>
                  </div>
                  
                  <div className="relative w-full h-2.5 bg-zinc-950 border border-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700 relative"
                      style={{ width: `${selectedBadge.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedBadge.unlocked && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 z-10 select-none">
                <Award className="w-3.5 h-3.5" /> Verified Award
              </div>
            )}

            {/* Close Button action */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-all duration-300 shadow-md shadow-violet-500/20 cursor-pointer active:scale-95 animate-in fade-in"
            >
              {selectedBadge.unlocked ? "Awesome! 🎉" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AwardsCard;
