import React, { useRef, useState, useEffect } from "react";
import { CheckCircle, Lock, Upload, X, ImageIcon, ArrowLeft, Check, Sparkles } from "lucide-react";

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
  todaySubmissionsCount: number;
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
  todaySubmissionsCount,
}: TodaysChallengeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [forceShowUploader, setForceShowUploader] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Reset forceShowUploader when todaySubmissionsCount updates or user submits successfully
    setForceShowUploader(false);
  }, [todaySubmissionsCount]);

  useEffect(() => {
    if (!screenshot) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(screenshot);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [screenshot]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setScreenshot(file);
  };

  const canSubmit = problemName.trim() && screenshot && !aiLoading;
  const showUploader = !submitted || forceShowUploader;

  return (
    <div className="lg:col-span-2 flex flex-col h-full">
      <div className="relative flex flex-col h-full flex-1">
        {/* Glow */}
        <div
          className={`absolute inset-0 rounded-2xl blur-2xl opacity-40 ${
            submitted
              ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
              : "bg-gradient-to-br from-violet-500/20 to-purple-500/20"
          }`}
        />

        <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6 overflow-hidden min-h-[522px] flex flex-col justify-between h-full flex-1">
          {/* AI Verification Loading Overlay */}
          {aiLoading && (
            <div className="absolute inset-0 bg-[#0D0D0F]/85 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Analyzing Proof...</h4>
              <p className="text-zinc-400 text-xs max-w-xs leading-relaxed">
                Gemini AI is scanning your screenshot to verify LeetCode/GFG problem status and update your consistency streak.
              </p>
            </div>
          )}

          <div className="flex flex-col flex-1 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                Today's Commitment
                {forceShowUploader && (
                  <button
                    type="button"
                    onClick={() => setForceShowUploader(false)}
                    className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
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

            {/* PRE SUBMIT OR UPLOADER */}
            {showUploader && (
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
                  <div className="flex-1 flex flex-col justify-center py-2">
                    <div>
                      {submitted && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 select-none">
                          Bonus Solve • {todaySubmissionsCount}/3
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-1.5 leading-tight">
                        {submitted ? "Log an additional solve" : "Solved a coding problem today?"}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-normal max-w-md">
                        {submitted 
                          ? "Submit extra solves to climb the leaderboard."
                          : "Upload your accepted submission screenshot to secure your streak."
                        }
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col mt-4">
                      <div className="space-y-5">
                        {/* Problem Name */}
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Problem name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Two Sum, Binary Search..."
                            value={problemName}
                            onChange={(e) => setProblemName(e.target.value)}
                            className="w-full h-12 px-4 bg-white/[0.01] border border-white/[0.04] text-white placeholder:text-zinc-500 focus:border-emerald-500/40 focus:outline-none rounded-xl text-sm"
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
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-28 border border-dashed border-white/[0.08] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-emerald-500/40 hover:bg-white/[0.02] transition-all duration-200 group cursor-pointer"
                            >
                              <Upload className="w-5 h-5 text-zinc-550 group-hover:text-emerald-400 transition-colors" />
                              <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors font-medium">
                                Click to upload screenshot
                              </span>
                              <span className="text-xs text-zinc-600">
                                LeetCode · GFG · Code360
                              </span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-xl">
                              <div className="w-12 h-12 bg-black/40 border border-white/[0.04] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                {previewUrl ? (
                                  <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover animate-in fade-in" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate font-medium">
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
                                className="p-2 hover:bg-white/10 active:scale-95 rounded-lg transition-colors cursor-pointer text-zinc-400 hover:text-white"
                              >
                                <X className="w-4 h-4" />
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
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
                          canSubmit
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-white/[0.02] border border-white/[0.04] text-zinc-500 cursor-not-allowed"
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
                  </div>
                )}
              </>
            )}

            {!showUploader && (
              <div className="flex flex-col flex-1 justify-between items-center text-center py-2 animate-in zoom-in duration-500 w-full">
                {/* Title Block */}
                <div className="flex flex-col items-center">
                  {/* Green Rounded Square Icon */}
                  <div className="w-16 h-16 bg-[#00c58d] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
                    <CheckCircle className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    Streak Secured!
                  </h3>
                </div>

                {/* Sleek inline progress status */}
                <div className="flex items-center justify-center gap-2.5 text-xs select-none py-1">
                  <span className="text-zinc-400">
                    Solves today: <strong className="text-zinc-100 font-semibold">{todaySubmissionsCount}/3</strong>
                  </span>
                  <span className="text-zinc-600 select-none">•</span>
                  {todaySubmissionsCount < 3 ? (
                    <button
                      type="button"
                      onClick={() => setForceShowUploader(true)}
                      className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-bold cursor-pointer"
                    >
                      Submit another solve
                    </button>
                  ) : (
                    <span className="text-zinc-500 font-medium">Daily limit reached</span>
                  )}
                </div>

                {/* Motivation Line with top and bottom borders and light grey bg */}
                <div className="w-full bg-white/[0.01] border-y border-white/[0.04] py-4">
                  <p className="text-[13px] text-zinc-300 italic max-w-sm mx-auto leading-relaxed px-4">
                    "{todayLine}"
                  </p>
                </div>

                {/* Timer Section */}
                <div className="space-y-3 w-full pb-2">
                  <p className="text-xs text-zinc-500 font-medium">Next challenge unlocks in</p>
                  <div className="flex items-center justify-center gap-3 font-mono">
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-14 h-16 rounded-[12px] flex flex-col items-center justify-center text-white">
                      <span className="text-xl font-bold leading-tight">{String(timeLeft.h).padStart(2, "0")}</span>
                      <span className="text-[9px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">HRS</span>
                    </div>
                    <span className="text-zinc-650 text-lg pb-1.5 font-bold">:</span>
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-14 h-16 rounded-[12px] flex flex-col items-center justify-center text-white">
                      <span className="text-xl font-bold leading-tight">{String(timeLeft.m).padStart(2, "0")}</span>
                      <span className="text-[9px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">MIN</span>
                    </div>
                    <span className="text-zinc-650 text-lg pb-1.5 font-bold">:</span>
                    <div className="bg-[#0F0F13] border border-white/[0.04] w-14 h-16 rounded-[12px] flex flex-col items-center justify-center text-emerald-400">
                      <span className="text-xl font-bold leading-tight">{String(timeLeft.s).padStart(2, "0")}</span>
                      <span className="text-[9px] text-zinc-500 block font-sans font-semibold mt-1 leading-none tracking-wider">SEC</span>
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
