import React, { useState } from "react";
import { CheckCircle, Lock, RefreshCw, AlertTriangle, ExternalLink, Link, Check, LogIn, Clock } from "lucide-react";

interface TodaysChallengeProps {
  selectedPlatform: "LeetCode" | "GeeksforGeeks" | "Code360";
  setSelectedPlatform: (platform: "LeetCode" | "GeeksforGeeks" | "Code360") => void;
  onboardingComplete?: boolean;
  onSetupClick?: () => void;
  linkage: { username: string; isVerified: boolean; verificationToken: string } | null;
  handleLink: (username: string) => Promise<void>;
  handleVerify: () => Promise<void>;
  handleSync: () => Promise<void>;
  linkLoading: boolean;
  verifyLoading: boolean;
  syncLoading: boolean;
  apiError: string;
  setApiError: (err: string) => void;
  currentStreak: number;
  dailyCommitment: number;
  todayLine: string;
  timeLeft: { h: number; m: number; s: number };
  todaySubmissionsCount: number;
}

export function TodaysChallenge({
  selectedPlatform,
  setSelectedPlatform,
  onboardingComplete = true,
  onSetupClick,
  linkage,
  handleLink,
  handleVerify,
  handleSync,
  linkLoading,
  verifyLoading,
  syncLoading,
  apiError,
  setApiError,
  currentStreak,
  dailyCommitment,
  todayLine,
  timeLeft,
  todaySubmissionsCount,
}: TodaysChallengeProps) {
  const [usernameInput, setUsernameInput] = useState("");

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setApiError("");
    await handleLink(usernameInput);
  };

  const hasSolvedToday = todaySubmissionsCount > 0;

  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="relative flex flex-col h-full flex-1">
        {/* Ambient Glow */}
        <div
          className={`absolute inset-0 rounded-2xl blur-2xl opacity-40 transition-all duration-500 ${
            hasSolvedToday
              ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
              : linkage?.isVerified
              ? "bg-gradient-to-br from-violet-500/20 to-indigo-500/20"
              : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
          }`}
        />

        <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6 overflow-hidden min-h-[522px] flex flex-col justify-between h-full flex-1">
          <div className="flex flex-col flex-1 h-full justify-between">
            
            {/* 1. Header Row */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Today's Goal
              </h2>

              <span
                className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border select-none transition-all duration-300 ${
                  hasSolvedToday
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : linkage?.isVerified
                    ? "text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
                    : "text-zinc-500 bg-white/[0.02] border-white/[0.06]"
                }`}
              >
                {hasSolvedToday ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                )}
                {hasSolvedToday ? "Protected" : linkage?.isVerified ? "Awaiting Sync" : "Setup Link"}
              </span>
            </div>

            {/* Platform Selector Pills */}
            <div className="flex gap-2 mb-6 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
              {(["LeetCode", "GeeksforGeeks", "Code360"] as const).map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => {
                    setApiError("");
                    setSelectedPlatform(plat);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedPlatform === plat
                      ? "bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>

            {/* 2. Main Setup or Verification Content */}
            {!onboardingComplete ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Setup Required</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-sm">
                  You need to set up your daily commitment plan before you can verify coding streaks.
                </p>
                <button
                  onClick={onSetupClick}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25 cursor-pointer"
                >
                  Setup Commitment Now
                </button>
              </div>
            ) : selectedPlatform === "Code360" ? (
              // CODE360 DISABLED BANNER
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4">
                <div className="w-14 h-14 bg-violet-500/10 rounded-full flex items-center justify-center mb-4 border border-violet-500/20">
                  <Clock className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Code360 Coming Soon</h3>
                <p className="text-xs text-zinc-400 mb-4 max-w-sm leading-relaxed">
                  We are developing a manual verification flow with screenshot proof submission for Code360 to support secure streak tracking.
                </p>
                <p className="text-[11px] text-zinc-550 max-w-xs leading-normal">
                  Until then, please use <span className="text-violet-400 font-semibold">LeetCode</span> or <span className="text-violet-400 font-semibold">GeeksforGeeks</span> to sync your daily coding streaks.
                </p>
              </div>
            ) : (!linkage || !linkage.isVerified) ? (
              // CASE 2: CONNECTION REQUIRED STATE
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Profile Connection Required</h3>
                <p className="text-xs text-zinc-400 mb-4 max-w-sm leading-relaxed">
                  To automatically sync solves and protect your daily stake, please link and verify your <span className="text-emerald-400 font-semibold">{selectedPlatform}</span> username in the <b>Problem Solving Stats</b> sidebar widget on the right.
                </p>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-2 bg-white/5 border border-white/[0.04] px-3 py-1.5 rounded-lg select-none">
                  <span>Profile Status:</span>
                  <span className="font-bold text-yellow-400 uppercase tracking-widest">Not Verified</span>
                </div>
              </div>
            ) : (
              // CASE 3: VERIFIED & ACTIVE FLOW
              <div className="flex-1 flex flex-col justify-between items-center text-center py-4 w-full">
                
                {/* Status Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                      hasSolvedToday
                        ? "bg-[#00c58d] shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                        : "bg-white/[0.02] border border-white/[0.06] text-zinc-500"
                    }`}
                  >
                    <CheckCircle className={`w-8 h-8 ${hasSolvedToday ? "text-white" : "text-zinc-600"}`} strokeWidth={2} />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    {hasSolvedToday ? "Streak Secured!" : "Solve Pending"}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 select-none">
                    {selectedPlatform} handle: <b className="text-violet-400">{linkage.username}</b>
                  </p>
                </div>

                {/* Submissions count / sync control */}
                <div className="flex flex-col items-center w-full max-w-xs space-y-3 mt-4">
                  <div className="text-xs text-zinc-400 select-none">
                    Solves synced today: <strong className="text-white font-bold">{todaySubmissionsCount}/3</strong>
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
                    <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin text-zinc-550" : "text-violet-400"}`} />
                    {syncLoading ? `Syncing ${selectedPlatform}...` : "Sync solves now"}
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
                  <p className="text-xs text-zinc-450 italic max-w-sm mx-auto leading-relaxed px-4">
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
                    <span className="text-zinc-700 text-base font-bold pb-1select-none">:</span>
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-12 h-14 rounded-xl flex flex-col items-center justify-center text-white select-none">
                      <span className="text-lg font-bold leading-none">{String(timeLeft.m).padStart(2, "0")}</span>
                      <span className="text-[8px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">MIN</span>
                    </div>
                    <span className="text-zinc-700 text-base font-bold pb-1 select-none">:</span>
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-12 h-14 rounded-xl flex flex-col items-center justify-center text-emerald-400 select-none">
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
