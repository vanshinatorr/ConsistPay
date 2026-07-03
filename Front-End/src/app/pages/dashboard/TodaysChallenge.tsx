import React from "react";
import { CheckCircle, Lock, RefreshCw, AlertTriangle, HelpCircle } from "lucide-react";

interface TodaysChallengeProps {
  onboardingComplete?: boolean;
  onSetupClick?: () => void;
  handleSync: () => Promise<void>;
  syncLoading: boolean;
  apiError: string;
  setApiError: (err: string) => void;
  currentStreak: number;
  dailyCommitment: number;
  todayLine: string;
  timeLeft: { h: number; m: number; s: number };
  todaySubmissionsCount: number;
  linkedPlatforms?: Array<{ platform: string; username: string; isVerified: boolean }>;
  syncLogs?: string[];
}

export function TodaysChallenge({
  onboardingComplete = true,
  onSetupClick,
  handleSync,
  syncLoading,
  apiError,
  setApiError,
  currentStreak,
  dailyCommitment,
  todayLine,
  timeLeft,
  todaySubmissionsCount,
  linkedPlatforms = [],
  syncLogs = [],
}: TodaysChallengeProps) {
  const hasSolvedToday = todaySubmissionsCount > 0;
  
  // Filter out verified active platforms
  const verifiedPlatforms = linkedPlatforms.filter((p) => p.isVerified);
  const hasVerifiedPlatform = verifiedPlatforms.length > 0;

  // Check if stake is at risk (under 2 hours left and 0 solves today)
  const isStakeAtRisk = onboardingComplete && hasVerifiedPlatform && !hasSolvedToday && timeLeft.h < 2;

  return (
    <div className="w-full">
      <div className="relative">
        {/* Ambient Glow */}
        <div
          className={`absolute inset-0 rounded-2xl blur-xl opacity-20 transition-all duration-550 bg-gradient-to-r ${
            hasSolvedToday
              ? "from-emerald-500/10 to-teal-500/10"
              : isStakeAtRisk
              ? "from-red-500/20 to-orange-500/20 animate-pulse"
              : hasVerifiedPlatform
              ? "from-yellow-500/10 to-orange-500/10"
              : "from-zinc-500/5 to-zinc-500/10"
          }`}
        />

        {/* Main Status Bar Container */}
        <div className={`relative bg-[#0F0F13] border border-white/[0.04] p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 shadow-lg ${
          syncLogs && syncLogs.length > 0 ? "rounded-t-2xl border-b-0" : "rounded-2xl"
        }`}>
          
          {/* Left Block: Status & Tracking */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                hasSolvedToday
                  ? "bg-[#10b981]/15 text-[#10b981]"
                  : isStakeAtRisk
                  ? "bg-red-500/10 text-red-500 animate-pulse border border-red-500/25"
                  : "bg-white/[0.02] text-zinc-500 border border-white/[0.04]"
              }`}
            >
              {hasVerifiedPlatform ? (
                <CheckCircle className="w-5.5 h-5.5" strokeWidth={2} />
              ) : (
                <HelpCircle className="w-5.5 h-5.5 text-zinc-500 animate-pulse" strokeWidth={2} />
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Today's Goal</span>
                <span
                  className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border select-none transition-all duration-300 ${
                    hasSolvedToday
                      ? "text-emerald-450 bg-emerald-500/5 border-emerald-500/15"
                      : isStakeAtRisk
                      ? "text-red-400 bg-red-500/5 border-red-500/15"
                      : hasVerifiedPlatform
                      ? "text-yellow-455 bg-yellow-500/5 border-yellow-500/15"
                      : "text-zinc-500 bg-white/[0.01] border-white/[0.04]"
                  }`}
                >
                  {hasSolvedToday ? "Protected" : isStakeAtRisk ? "Stake At Risk" : hasVerifiedPlatform ? "Awaiting Sync" : "Disconnected"}
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 max-w-[250px] truncate">
                {hasVerifiedPlatform ? (
                  <span>
                    Tracking: {verifiedPlatforms.map((p) => p.platform).join(", ")}
                  </span>
                ) : (
                  <span className="text-zinc-550">No profile connected (link on the right)</span>
                )}
              </div>
            </div>
          </div>

          {/* Center Block: Motivational Quote (Hidden on mobile) */}
          <div className="hidden lg:block text-center flex-1 max-w-[280px] px-4 truncate select-none">
            <p className="text-[11px] text-zinc-400 italic font-medium leading-relaxed">
              "{todayLine || "Solve a problem today to update consistency."}"
            </p>
          </div>

          {/* Right Block: Timer & Action Trigger */}
          <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto shrink-0 border-t border-white/[0.04] md:border-t-0 pt-3 md:pt-0">
            {/* Timer Dials */}
            <div className="flex items-center gap-2 font-mono text-zinc-100">
              <span className="text-[9px] text-zinc-500 font-sans font-bold tracking-wider mr-1 uppercase">Closes in</span>
              <div className={`px-2 py-1 rounded bg-[#0A0B10] border border-white/[0.04] text-xs font-bold ${isStakeAtRisk ? "text-red-400 border-red-500/20 animate-pulse" : ""}`}>
                {String(timeLeft.h).padStart(2, "0")}h
              </div>
              <span className="text-zinc-700 text-xs font-bold">:</span>
              <div className={`px-2 py-1 rounded bg-[#0A0B10] border border-white/[0.04] text-xs font-bold ${isStakeAtRisk ? "text-red-400 animate-pulse" : ""}`}>
                {String(timeLeft.m).padStart(2, "0")}m
              </div>
              <span className="text-zinc-700 text-xs font-bold">:</span>
              <div className={`px-2 py-1 rounded bg-[#0A0B10] border border-white/[0.04] text-xs font-bold ${isStakeAtRisk ? "text-red-400 animate-pulse" : "text-emerald-450"}`}>
                {String(timeLeft.s).padStart(2, "0")}s
              </div>
            </div>

            {/* Sync Action Trigger */}
            <div className="shrink-0">
              {hasVerifiedPlatform ? (
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncLoading}
                  className={`h-9 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                    syncLoading
                      ? "bg-white/[0.02] border-white/[0.04] text-zinc-600"
                      : "bg-white text-black hover:bg-zinc-200 border-white active:scale-98"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin text-zinc-500" : "text-emerald-500"}`} />
                  {syncLoading ? "Syncing..." : "Sync solves"}
                </button>
              ) : (
                <div className="h-9 px-4.5 bg-white/[0.02] border border-white/[0.04] text-zinc-500 rounded-xl font-bold text-[10px] flex items-center justify-center select-none cursor-not-allowed">
                  Link Profile to Sync
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Collapsible Slide-Out Console Terminal Drawer */}
        {syncLogs && syncLogs.length > 0 && (
          <div className="relative z-10 w-full bg-black/85 border border-white/[0.04] rounded-b-2xl p-4 font-mono text-[9px] text-zinc-450 text-left shadow-inner overflow-hidden select-text animate-in slide-in-from-top-1 duration-300">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-1.5 mb-2 text-zinc-500 select-none">
              <span>SYSTEM VERIFICATION DRAWER</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-555 animate-ping" />
            </div>
            <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar scroll-smooth">
              {syncLogs.map((log, idx) => {
                let textClass = "text-zinc-400";
                if (log.includes("✅") || log.includes("Secured")) textClass = "text-emerald-450 font-bold";
                if (log.includes("❌")) textClass = "text-red-400 font-bold";
                if (log.includes("⚠️")) textClass = "text-yellow-450";
                return (
                  <div key={idx} className={`${textClass} leading-relaxed`}>
                    {log}
                  </div>
                );
              })}
            </div>
            {apiError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 mt-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-300 leading-normal">{apiError}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
