import React, { useState } from "react";
import { Award, Lock, X, Info, Trophy, Link2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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
}

export function AwardsCard({
  linkedPlatforms = [],
  streak = 0,
  maxStreak = 0,
  consistencyScore = 0,
  totalSolved = 0,
  totalProblemsSolved = 0
}: AwardsCardProps) {
  const [selectedBadge, setSelectedBadge] = useState<LeetCodeBadge | null>(null);
  
  // Find verified LeetCode profile linkage
  const leetcodeLink = linkedPlatforms.find(
    (p) => p.platform === "LeetCode" && p.isVerified
  );
  
  const isLeetCodeConnected = !!leetcodeLink;
  const leetcodeBadges = leetcodeLink?.badges || [];

  const getBadgeIconUrl = (iconPath: string) => {
    if (!iconPath) return "";
    if (iconPath.startsWith("http")) return iconPath;
    return `https://leetcode.com${iconPath}`;
  };

  const fireCelebrationConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"]
    });
    
    // Left burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#8B5CF6", "#10B981", "#F59E0B"]
      });
    }, 200);

    // Right burst
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

  const handleBadgeClick = (badge: LeetCodeBadge) => {
    setSelectedBadge(badge);
    fireCelebrationConfetti();
  };

  return (
    <div className="relative group h-full">
      {/* Styles for rotating sunbursts and shiny hover sweeping */}
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

      {/* Ambient background glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

      <div className="relative bg-white dark:bg-[#0F0F13] border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col justify-between h-full min-h-[220px] shadow-lg">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-white/[0.02] pb-3">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Achievements
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">LeetCode Badges</span>
          </div>
          
          {isLeetCodeConnected && leetcodeBadges.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 select-none shadow-sm">
              {leetcodeBadges.length} Earned
            </span>
          )}
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 flex flex-col justify-center">
          {!isLeetCodeConnected ? (
            /* State 1: LeetCode Not Connected - Call to Action */
            <div className="py-2.5 px-3 rounded-xl border border-dashed border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.01] text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 mb-3 shadow-inner">
                <Link2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-zinc-850 dark:text-white mb-1">
                Sync LeetCode Badges
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal max-w-[220px] mb-4">
                Connect your profile in settings to fetch and display your official 3D glossy achievements here.
              </p>
              <Link
                to="/settings?tab=platforms"
                className="inline-flex items-center gap-1 px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-850 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-black text-[10px] rounded-lg tracking-wider uppercase tracking-widest transition-all duration-150 shadow-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Link Profile</span>
              </Link>
            </div>
          ) : leetcodeBadges.length === 0 ? (
            /* State 2: LeetCode Connected but No Badges Found */
            <div className="py-4 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] flex items-center justify-center text-zinc-400 mb-2">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                No Badges Unlocked Yet
              </h4>
              <p className="text-[9.5px] text-zinc-500 leading-relaxed max-w-[200px] mt-1">
                Start solving LeetCode Daily Challenges to unlock official badges. They will sync automatically during your next solve.
              </p>
            </div>
          ) : (
            /* State 3: LeetCode Connected & Badges Render Grid */
            <div className="flex flex-wrap items-center justify-start gap-3 py-2">
              {leetcodeBadges.map((badge) => {
                const iconUrl = getBadgeIconUrl(badge.icon);
                return (
                  <div
                    key={badge.id}
                    onClick={() => handleBadgeClick(badge)}
                    className="relative group/badge flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {/* Hexagon shape framing container */}
                    <div className="relative w-12 h-12 flex items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95">
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden hexagon-shine">
                        {/* Glowing backing */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                        
                        {/* Hexagon polygon borders */}
                        <svg className="absolute w-full h-full text-zinc-100 dark:text-white/[0.03] group-hover/badge:text-violet-500/10 transition-all duration-300" viewBox="0 0 100 100" fill="currentColor">
                          <polygon 
                            points="50,5 93,25 93,75 50,95 7,75 7,25" 
                            stroke="rgba(139,92,246,0.15)" 
                            strokeWidth="3.5" 
                            className="transition-colors group-hover/badge:stroke-violet-500/40"
                          />
                        </svg>

                        {/* LeetCode Official Glassy 3D Badge Image */}
                        <img
                          src={iconUrl}
                          alt={badge.name}
                          className="w-7.5 h-7.5 object-contain relative z-10 transition-transform duration-300 group-hover/badge:scale-105"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>

                    {/* Highly Polished Hover Tooltip */}
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-48 bg-[#0F0F13]/98 border border-white/[0.08] backdrop-blur-md rounded-xl p-3.5 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:scale-100 group-hover/badge:pointer-events-auto transition-all duration-200 z-50 hover:border-violet-500/40"
                    >
                      <div className="absolute top-full left-0 right-0 h-4 bg-transparent -translate-y-1" />
                      <div className="text-[11px] font-black text-white text-left tracking-wide leading-tight mb-1">
                        {badge.name}
                      </div>
                      <p className="text-[9.5px] text-zinc-400 text-left leading-normal mb-2">
                        {badge.hoverText || "Official LeetCode achievement badge."}
                      </p>
                      
                      <div className="h-px bg-white/[0.06] my-2" />
                      <div className="flex items-center gap-1 justify-start text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                        <Info className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
                        <span>Tap to Celebrate</span>
                      </div>
                      
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0F0F13] pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= CELEBRATION MODAL OVERLAY ================= */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="celebration-modal-card relative w-full max-w-sm bg-[#0F1018] border border-violet-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.1)] text-center overflow-hidden">
            {/* Ambient glows and rays inside the modal */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-500/25 rounded-full blur-[60px] pointer-events-none" />
            <div className="sunburst-rays absolute left-1/2 top-[12%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            {/* Close Button */}
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Giant Hexagon framed Badge Logo */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center z-10">
              <svg className="absolute w-full h-full text-violet-950/30" viewBox="0 0 100 100" fill="currentColor">
                <polygon 
                  points="50,5 93,25 93,75 50,95 7,75 7,25" 
                  stroke="rgba(139, 92, 246, 0.5)" 
                  strokeWidth="4" 
                />
              </svg>
              <img
                src={getBadgeIconUrl(selectedBadge.icon)}
                alt={selectedBadge.name}
                className="w-14 h-14 object-contain relative z-10"
              />
            </div>

            {/* Verification Header Tag */}
            <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 block z-10 text-violet-400">
              LeetCode Achievement
            </span>
            
            <h3 className="text-xl font-black text-white mb-2.5 z-10 leading-snug">
              {selectedBadge.name}
            </h3>
            
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 z-10">
              {selectedBadge.hoverText || "Official LeetCode achievement milestone."}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 z-10 select-none">
              <Award className="w-3.5 h-3.5" /> Verified Award
            </div>

            {/* Close Button action */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-all duration-300 shadow-md shadow-violet-500/20 cursor-pointer active:scale-95"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AwardsCard;
