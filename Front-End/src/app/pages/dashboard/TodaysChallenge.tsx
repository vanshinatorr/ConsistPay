import React from "react";
import { CheckCircle, Lock, RefreshCw, AlertTriangle, Clock } from "lucide-react";

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
}: TodaysChallengeProps) {
  const hasSolvedToday = todaySubmissionsCount > 0;
  
  // Filter out verified active platforms
  const verifiedPlatforms = linkedPlatforms.filter((p) => p.isVerified);
  const hasVerifiedPlatform = verifiedPlatforms.length > 0;

  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="relative flex flex-col h-full flex-1">
        {/* Ambient Glow */}
        <div
          className={`absolute inset-0 rounded-2xl blur-2xl opacity-40 transition-all duration-500 bg-gradient-to-br ${
            hasSolvedToday
              ? "from-emerald-500/20 to-teal-500/20"
              : hasVerifiedPlatform
              ? "from-emerald-500/10 to-teal-500/10"
              : "from-yellow-500/10 to-orange-500/10"
          }`}
        />

        <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6 overflow-hidden min-h-[460px] flex flex-col justify-between h-full flex-1">
          <div className="flex flex-col flex-1 h-full justify-between">
            
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Today's Goal
              </h2>

              <span
                className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border select-none transition-all duration-300 ${
                  hasSolvedToday
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : hasVerifiedPlatform
                    ? "text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
                    : "text-zinc-500 bg-white/[0.02] border-white/[0.06]"
                }`}
              >
                {hasSolvedToday ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                )}
                {hasSolvedToday ? "Protected" : hasVerifiedPlatform ? "Awaiting Sync" : "Connection Required"}
              </span>
            </div>

            {/* Main Content: Actions or Placeholders */}
            {!onboardingComplete ? (
              /* CASE 1: ONBOARDING REQUIRED */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-white/5 border border-white/[0.04] rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Setup Required</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-sm">
                  You need to set up your daily commitment plan before you can verify coding streaks.
                </p>
                <button
                  onClick={onSetupClick}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Setup Commitment Now
                </button>
              </div>
            ) : !hasVerifiedPlatform ? (
              /* CASE 2: PLATFORM CONNECTION REQUIRED */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Profile Connection Required</h3>
                <p className="text-xs text-zinc-400 mb-4 max-w-sm leading-relaxed">
                  To automatically sync solves and protect your daily stake, please link and verify a username (LeetCode, GFG, or Code360) in the <b>Problem Solving Stats</b> sidebar widget on the right.
                </p>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-2 bg-white/5 border border-white/[0.04] px-3 py-1.5 rounded-lg select-none">
                  <span>Profile Status:</span>
                  <span className="font-bold text-yellow-400 uppercase tracking-widest">Not Connected</span>
                </div>
              </div>
            ) : (
              /* CASE 3: ACTIVE PLAYERS FLOW */
              <div className="flex-1 flex flex-col justify-between items-center text-center py-4 w-full animate-in fade-in duration-300">
                
                {/* Status Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                      hasSolvedToday
                        ? "bg-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        : "bg-white/[0.02] border border-white/[0.06] text-zinc-500"
                    }`}
                  >
                    <CheckCircle className={`w-8 h-8 ${hasSolvedToday ? "text-white" : "text-zinc-600"}`} strokeWidth={2} />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    {hasSolvedToday ? "Streak Secured!" : "Solve Pending"}
                  </h3>
                  
                  {/* List active connected profiles */}
                  <div className="text-[10px] text-zinc-500 mt-2 bg-white/5 border border-white/[0.04] px-3 py-1 rounded-lg select-none">
                    Tracking: {verifiedPlatforms.map((p, idx) => (
                      <span key={p.platform}>
                        <span className="text-emerald-400 font-semibold">{p.platform}</span> (@{p.username})
                        {idx < verifiedPlatforms.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submissions sync controller */}
                <div className="flex flex-col items-center w-full max-w-xs space-y-3 mt-4">
                  <div className="text-xs text-zinc-400 select-none">
                    Solved today: <strong className="text-white font-bold">{todaySubmissionsCount} {todaySubmissionsCount === 1 ? "question" : "questions"}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncLoading}
                    className={`w-full h-11 border rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      syncLoading
                        ? "bg-white/[0.02] border-white/[0.06] text-zinc-650"
                        : "bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] hover:border-white/[0.12] text-white active:scale-98"
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin text-zinc-550" : "text-emerald-400"}`} />
                    {syncLoading ? "Syncing solves..." : "Sync solves now"}
                  </button>
                </div>

                {apiError && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 mt-3 text-left w-full">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-300 leading-normal">{apiError}</p>
                  </div>
                )}

                {/* Motivation Line */}
                <div className="w-full bg-white/[0.01] border-y border-white/[0.04] py-3.5 mt-4 select-none">
                  <p className="text-xs text-zinc-400 italic max-w-sm mx-auto leading-relaxed px-4">
                    "{todayLine || "Solve a problem today to update consistency."}"
                  </p>
                </div>

                {/* Timer Countdown */}
                <div className="space-y-2.5 w-full pt-4">
                  <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Next challenge unlocks in</p>
                  <div className="flex items-center justify-center gap-3 font-mono">
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-12 h-14 rounded-xl flex flex-col items-center justify-center text-white select-none">
                      <span className="text-lg font-bold leading-none">{String(timeLeft.h).padStart(2, "0")}</span>
                      <span className="text-[8px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">HRS</span>
                    </div>
                    <span className="text-zinc-700 text-base font-bold pb-1 select-none">:</span>
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-12 h-14 rounded-xl flex flex-col items-center justify-center text-white select-none">
                      <span className="text-lg font-bold leading-none">{String(timeLeft.m).padStart(2, "0")}</span>
                      <span className="text-[8px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">MIN</span>
                    </div>
                    <span className="text-zinc-700 text-base font-bold pb-1 select-none">:</span>
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-12 h-14 rounded-xl flex flex-col items-center justify-center text-emerald-450 select-none">
                      <span className="text-lg font-bold leading-none">{String(timeLeft.s).padStart(2, "0")}</span>
                      <span className="text-[8px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">SEC</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
