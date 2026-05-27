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

          {/* POST SUBMIT */}
          {submitted && (
            <div className="text-center py-4">

              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Proof Submitted!
              </h3>

              <p className="text-sm text-zinc-400 mb-6">
                Today's coding session is now protected.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <div className="text-3xl font-black text-emerald-400">
                    {currentStreak}
                  </div>

                  <div className="text-xs text-zinc-400 mt-1">
                    🔥 Day Streak
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                  <div className="text-3xl font-black text-yellow-400">
                    ₹{dailyCommitment}
                  </div>

                  <div className="text-xs text-zinc-400 mt-1">
                    🪙 Secured today
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 mb-5">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {todayLine}
                </p>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">

                <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-4">
                  <Lock className="w-3.5 h-3.5" />
                  Next submission unlocks in
                </div>

                <div className="flex items-center justify-center gap-3">
                  {[
                    { val: timeLeft.h, label: "hrs" },
                    { val: timeLeft.m, label: "min" },
                    { val: timeLeft.s, label: "sec" },
                  ].map(({ val, label }) => (
                    <div
                      key={label}
                      className="text-center"
                    >
                      <div className="w-14 h-14 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                        {String(val).padStart(2, "0")}
                      </div>

                      <div className="text-xs text-zinc-500 mt-1">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}