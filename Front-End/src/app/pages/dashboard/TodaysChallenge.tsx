import React, { useRef } from "react";
import { CheckCircle, Lock, Upload, X, ImageIcon } from "lucide-react";

interface TodaysChallengeProps {
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  problemName: string;
  setProblemName: (name: string) => void;
  screenshot: File | null;
  setScreenshot: (file: File | null) => void;
  submitError: string;
  currentStreak: number;
  dailyCommitment: number;
  todayLine: string;
  timeLeft: { h: number; m: number; s: number };
  aiLoading: boolean;
  onboardingComplete?: boolean;
  onSetupClick?: () => void;
}

export function TodaysChallenge({
  submitted,
  handleSubmit,
  problemName,
  setProblemName,
  screenshot,
  setScreenshot,
  submitError,
  currentStreak,
  dailyCommitment,
  todayLine,
  timeLeft,
  aiLoading,
  onboardingComplete = true,
  onSetupClick,
}: TodaysChallengeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) setScreenshot(file);
  };

  const canSubmit = problemName.trim() && screenshot && !aiLoading;

  return (
    <div className="lg:col-span-2">
      <div className="relative">

        <div
          className={`absolute inset-0 rounded-2xl blur-2xl opacity-40 ${
            submitted
              ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
              : "bg-gradient-to-br from-violet-500/20 to-purple-500/20"
          }`}
        />

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden min-h-[522px]">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Today's Commitment
            </h2>

            <span
              className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${
                submitted
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
              }`}
            >
              {submitted ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              )}

              {submitted ? "Protected" : "Pending Proof"}
            </span>
          </div>

          {/* PRE SUBMIT */}
          {!submitted && (
            <>
              {!onboardingComplete ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Setup Required</h3>
                  <p className="text-sm text-zinc-400 mb-6 max-w-sm">
                    You need to set up your daily commitment plan before you can start submitting proofs.
                  </p>
                  <button
                    onClick={onSetupClick}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25"
                  >
                    Setup Commitment Now
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-3 leading-tight">
                      Solved a coding problem today?
                  </h3>

                <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
                  Enter problem name and upload your accepted
                  submission screenshot from LeetCode, GFG,
                  or Code360.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Problem Name */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Problem name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Two Sum, Binary Search..."
                    value={problemName}
                    onChange={(e) =>
                      setProblemName(e.target.value)
                    }
                    className="w-full h-12 px-4 bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/40 focus:outline-none rounded-xl text-sm"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Submission screenshot
                  </label>

                  {!screenshot ? (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="w-full h-24 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-violet-500/40 hover:bg-white/[0.03] transition-all duration-200 group"
                    >
                      <Upload className="w-5 h-5 text-zinc-500 group-hover:text-violet-400 transition-colors" />

                      <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        Click to upload screenshot
                      </span>

                      <span className="text-xs text-zinc-600">
                        LeetCode · GFG · Code360
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-white/[0.04] border border-white/10 rounded-xl">

                      <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5 text-violet-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {screenshot.name}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {(screenshot.size / 1024).toFixed(0)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setScreenshot(null);

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Error */}
                {submitError && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-3">

                    <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />

                    <p className="text-sm text-red-300">
                      {submitError}
                    </p>
                  </div>
                )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      canSubmit
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20"
                        : "bg-white/[0.05] border border-white/10 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                        Verifying AI...
                      </>
                    ) : (
                      "Submit Solution"
                    )}
                  </button>
                </form>
                </>
              )}
            </>
          )}

          {/* POST SUBMIT (Success State) */}
          {submitted && (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-in zoom-in duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center relative shadow-xl shadow-emerald-500/30 transform hover:scale-105 transition-transform">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Streak Secured!
              </h3>
              
              <p className="text-emerald-400 font-medium mb-6 flex items-center gap-2">
                🔥 {currentStreak} Day Streak
              </p>

              <div className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 mb-8">
                <p className="text-sm text-zinc-400 italic">
                  "{todayLine}"
                </p>
              </div>

              <div className="space-y-2 w-full">
                <p className="text-sm text-zinc-500">Next challenge unlocks in</p>
                <div className="flex items-center justify-center gap-3 font-mono text-lg font-bold">
                  <div className="bg-white/5 px-3 py-2 rounded-lg text-white">
                    {String(timeLeft.h).padStart(2, "0")}
                    <span className="text-xs text-zinc-500 block font-sans">HRS</span>
                  </div>
                  <span className="text-zinc-600 pb-4">:</span>
                  <div className="bg-white/5 px-3 py-2 rounded-lg text-white">
                    {String(timeLeft.m).padStart(2, "0")}
                    <span className="text-xs text-zinc-500 block font-sans">MIN</span>
                  </div>
                  <span className="text-zinc-600 pb-4">:</span>
                  <div className="bg-white/5 px-3 py-2 rounded-lg text-emerald-400">
                    {String(timeLeft.s).padStart(2, "0")}
                    <span className="text-xs text-zinc-500 block font-sans">SEC</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

                        <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5 text-violet-400" />
                        </div>

