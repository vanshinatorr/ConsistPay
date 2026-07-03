import React from 'react';
import { Target } from 'lucide-react';

interface DsaStats {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

interface DsaStatsCardProps {
  stats?: DsaStats;
  onboardingComplete?: boolean;
}

export function DsaStatsCard({ stats, onboardingComplete = true }: DsaStatsCardProps) {
  // Default fallback stats
  const currentStats = stats || { easy: 0, medium: 0, hard: 0, total: 0 };
  const { easy, medium, hard, total } = currentStats;

  // SVG circular properties
  const radius = 34;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // Approx 213.63

  // Calculate segment lengths
  const easyPct = total > 0 ? easy / total : 0;
  const mediumPct = total > 0 ? medium / total : 0;
  const hardPct = total > 0 ? hard / total : 0;

  const easyStroke = easyPct * circumference;
  const mediumStroke = mediumPct * circumference;
  const hardStroke = hardPct * circumference;

  return (
    <div className={`relative rounded-2xl border border-white/[0.04] bg-[#0F0F13] p-5 overflow-hidden group hover:border-white/10 transition-all duration-300 ${!onboardingComplete ? 'opacity-40 pointer-events-none' : ''}`}>
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute -right-16 -top-16 w-36 h-36 bg-emerald-500/[0.02] rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/[0.04] transition-all duration-300" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          DSA Solves
        </h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/[0.04] px-2 py-0.5 rounded">
          Sync Status
        </span>
      </div>

      {/* Main Content: Ring & Rows */}
      <div className="flex items-center justify-between gap-6 relative z-10">
        {/* Left Side: Segmented SVG Donut Ring */}
        <div className="relative w-[100px] h-[100px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {total > 0 ? (
              <>
                {/* Easy segment (Green) */}
                {easy > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${easyStroke} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap={medium === 0 && hard === 0 ? "round" : "butt"}
                  />
                )}
                {/* Medium segment (Yellow) */}
                {medium > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#f59e0b"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${mediumStroke} ${circumference}`}
                    strokeDashoffset={-easyStroke}
                    strokeLinecap={easy === 0 && hard === 0 ? "round" : "butt"}
                  />
                )}
                {/* Hard segment (Red) */}
                {hard > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${hardStroke} ${circumference}`}
                    strokeDashoffset={-(easyStroke + mediumStroke)}
                    strokeLinecap={easy === 0 && medium === 0 ? "round" : "butt"}
                  />
                )}
              </>
            ) : (
              /* If no solves, render a default light grey circle */
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#27272a"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
            )}
          </svg>
          {/* Central solved count text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-white leading-none tracking-tight">
              {total}
            </span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
              Solved
            </span>
          </div>
        </div>

        {/* Right Side: Rows */}
        <div className="flex-1 space-y-2">
          {/* Easy Row */}
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.03] rounded-lg px-3 py-1.5 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-zinc-400">Easy</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{easy}</span>
          </div>

          {/* Medium Row */}
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.03] rounded-lg px-3 py-1.5 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-zinc-400">Medium</span>
            </div>
            <span className="text-xs font-bold text-amber-400">{medium}</span>
          </div>

          {/* Hard Row */}
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.03] rounded-lg px-3 py-1.5 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-xs font-semibold text-zinc-400">Hard</span>
            </div>
            <span className="text-xs font-bold text-rose-500">{hard}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
