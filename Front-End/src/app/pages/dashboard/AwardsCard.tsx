import React, { useState } from "react";
import { Award, Flame, Shield, Gem, Crown, Swords, Info, Lock, X, Coins, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface AwardsCardProps {
  streak: number;
  maxStreak?: number;
  consistencyScore: number;
  battleBalance: number;
  graceCoins: number;
  plan: string;
  onboardingComplete?: boolean;
  totalSolved?: number;
  totalProblemsSolved?: number;
  dailyCommitment?: number;
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
  maxStreak = 0,
  consistencyScore,
  battleBalance,
  graceCoins,
  plan,
  onboardingComplete = true,
  totalSolved = 0,
  totalProblemsSolved = 0,
  dailyCommitment = 5,
}: AwardsCardProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [newlyUnlockedQueue, setNewlyUnlockedQueue] = useState<Badge[]>([]);

  const badges: Badge[] = [
    {
      id: "solved_1",
      name: "First Steps",
      desc: "Solved your first coding problem! The journey of a thousand miles begins with a single line of code.",
      requirement: "Solve 1 coding problem",
      unlocked: onboardingComplete && totalSolved >= 1,
      colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/30",
      glowClass: "from-teal-500/20 to-emerald-500/20",
      icon: Award,
    },
    {
      id: "streak_7",
      name: "Streak Starter",
      desc: "You showed up for 7 days straight! This is where habit meets momentum.",
      requirement: "Reach a 7-day streak",
      unlocked: onboardingComplete && (streak >= 7 || maxStreak >= 7),
      colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/30",
      glowClass: "from-orange-500/20 to-red-500/20",
      icon: Flame,
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
      id: "solved_10",
      name: "Problem Solver",
      desc: "Solved 10+ coding problems overall. Getting comfortable with the syntax and paradigms.",
      requirement: "Solve 10+ coding problems",
      unlocked: onboardingComplete && totalProblemsSolved >= 10,
      colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      glowClass: "from-cyan-500/20 to-sky-500/20",
      icon: Gem,
    },
    {
      id: "streak_15",
      name: "Habit Builder",
      desc: "Maintained a 15-day consistency streak. Coding is officially starting to feel like a daily habit.",
      requirement: "Reach a 15-day streak",
      unlocked: onboardingComplete && (streak >= 15 || maxStreak >= 15),
      colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      glowClass: "from-blue-500/20 to-indigo-500/20",
      icon: Flame,
    },
    {
      id: "consistency_90",
      name: "Consistency King",
      desc: "Maintained a >= 90% consistency score. A true master of daily execution.",
      requirement: "90%+ Consistency score",
      unlocked: onboardingComplete && consistencyScore >= 90,
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      glowClass: "from-amber-500/20 to-yellow-500/20",
      icon: Crown,
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
    {
      id: "grace_5",
      name: "Grace Hoarder",
      desc: "Accumulated 5 or more Grace Coins! You are heavily guarded against accidental streak resets.",
      requirement: "Accumulate 5+ Grace Coins",
      unlocked: onboardingComplete && graceCoins >= 5,
      colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      glowClass: "from-emerald-500/20 to-teal-500/20",
      icon: Shield,
    },
    {
      id: "streak_30",
      name: "Consistency Champion",
      desc: "Hit a legendary 30-day streak! You are now part of the consistency elite.",
      requirement: "Reach a 30-day streak",
      unlocked: onboardingComplete && (streak >= 30 || maxStreak >= 30),
      colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      glowClass: "from-purple-500/20 to-pink-500/20",
      icon: Crown,
    },
    {
      id: "commitment_50",
      name: "High Roller",
      desc: "Set your daily coding commitment to ₹50. Heavy skin in the game makes for ultimate focus.",
      requirement: "Set daily commitment to ₹50",
      unlocked: onboardingComplete && dailyCommitment === 50,
      colorClass: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
      glowClass: "from-yellow-500/20 to-orange-500/20",
      icon: Coins,
    },
    {
      id: "max_streak_50",
      name: "Streak Master",
      desc: "Achieved a lifetime max streak of 50 days or more. Absolutely unstoppable!",
      requirement: "Reach a 50-day streak",
      unlocked: onboardingComplete && (streak >= 50 || maxStreak >= 50),
      colorClass: "text-red-400 bg-red-500/10 border-red-500/30",
      glowClass: "from-red-500/20 to-rose-500/20",
      icon: Trophy,
    },
  ];

  // Sort badges: unlocked ones first, locked ones second
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });

  const unlockedCount = sortedBadges.filter((b) => b.unlocked).length;
  const visibleBadges = showAll ? sortedBadges : sortedBadges.slice(0, 5);

  const fireCelebrationConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"]
    });
    
    // Left side burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B"]
      });
    }, 250);

    // Right side burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B"]
      });
    }, 400);
  };

  const handleBadgeClick = (badge: Badge) => {
    if (badge.unlocked) {
      setSelectedBadge(badge);
      fireCelebrationConfetti();
    }
  };

  // Automatic celebration for newly unlocked achievements
  React.useEffect(() => {
    if (!onboardingComplete) return;

    // Get list of already celebrated badges
    const celebratedStr = localStorage.getItem("consistpay_celebrated_badges");
    let celebratedIds: string[] = [];
    if (celebratedStr) {
      try {
        celebratedIds = JSON.parse(celebratedStr);
      } catch (e) {
        celebratedIds = [];
      }
    }

    // Find unlocked badges that haven't been celebrated yet
    const newlyUnlocked = sortedBadges.filter(
      (b) => b.unlocked && !celebratedIds.includes(b.id)
    );

    if (newlyUnlocked.length > 0) {
      // Add all newly unlocked badges to the queue
      setNewlyUnlockedQueue((prev) => {
        const combined = [...prev];
        newlyUnlocked.forEach((newBadge) => {
          if (!combined.some((b) => b.id === newBadge.id)) {
            combined.push(newBadge);
          }
        });
        return combined;
      });

      // Mark them as celebrated immediately in localStorage
      const updatedCelebrated = [...new Set([...celebratedIds, ...newlyUnlocked.map((b) => b.id)])];
      localStorage.setItem("consistpay_celebrated_badges", JSON.stringify(updatedCelebrated));
    }
  }, [
    streak,
    maxStreak,
    consistencyScore,
    battleBalance,
    graceCoins,
    plan,
    onboardingComplete,
    totalSolved,
    totalProblemsSolved,
    dailyCommitment,
  ]);

  // Process the queue
  React.useEffect(() => {
    if (newlyUnlockedQueue.length > 0 && !selectedBadge) {
      const nextBadge = newlyUnlockedQueue[0];
      setNewlyUnlockedQueue((prev) => prev.slice(1));
      
      // Auto open modal and fire confetti
      setSelectedBadge(nextBadge);
      
      setTimeout(() => {
        fireCelebrationConfetti();
      }, 300);
    }
  }, [newlyUnlockedQueue, selectedBadge]);

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
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes card-bounce {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
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
        {sortedBadges.length > 5 && (
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[200] flex items-center justify-center p-4 animate-in fade-in duration-350">
          {/* Card Container with custom bounce animation */}
          <div className="celebration-modal-card relative w-full max-w-md bg-[#0F0F13] border border-violet-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] text-center overflow-hidden">
            {/* Glowing Backdrop inside Modal */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
            
            {/* Sunburst rays rotating backdrop */}
            <div className="sunburst-rays absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            {/* Close Button */}
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Giant Hexagon Badge Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-300 z-10">
              <svg className="absolute w-full h-full text-violet-950/30" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="4" />
              </svg>
              <div className={`p-4 rounded-full ${selectedBadge.colorClass}`}>
                {React.createElement(selectedBadge.icon, { className: "w-10 h-10 fill-current/10" })}
              </div>
            </div>

            {/* Header Text */}
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-2 block z-10">
              Achievement Unlocked
            </span>
            <h3 className="text-2xl font-black text-white mb-3 z-10">
              {selectedBadge.name}
            </h3>
            
            <p className="text-sm text-zinc-300 leading-relaxed mb-6 z-10">
              {selectedBadge.desc}
            </p>

            {/* Verification Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold mb-6 z-10">
              <Award className="w-4 h-4" /> Verified Award
            </div>

            {/* Action button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/25 cursor-pointer z-10"
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
