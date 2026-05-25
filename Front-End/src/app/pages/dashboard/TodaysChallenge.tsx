import React from "react";
import { CheckCircle, Lock } from "lucide-react";
import { Input } from "../../components/ui/input";

interface TodaysChallengeProps {
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  solutionLink: string;
  setSolutionLink: (link: string) => void;
  submitError: string;
  currentStreak: number;
  dailyCommitment: number;
  todayLine: string;
  timeLeft: { h: number; m: number; s: number };
}

export function TodaysChallenge({
  submitted,
  handleSubmit,
  solutionLink,
  setSolutionLink,
  submitError,
  currentStreak,
  dailyCommitment,
  todayLine,
  timeLeft,
}: TodaysChallengeProps) {
  return (
    <div className="lg:col-span-2">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${submitted ? "from-emerald-500/20 to-teal-500/20" : "from-violet-500/20 to-purple-500/20"} rounded-2xl blur-xl opacity-50`} />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Today's Challenge</h2>
            <span className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${submitted ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-zinc-400 bg-white/5 border-white/10"}`}>
              {submitted ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-zinc-500" />}
              {submitted ? "Completed" : "Pending"}
            </span>
          </div>

          {!submitted && (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">Solved a coding problem today?</h3>
                <p className="text-zinc-400 text-sm">Paste your solution link from LeetCode, Code360 or any platform</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="solution" className="block text-sm text-zinc-400 mb-2">Paste your solution link</label>
                  <Input
                    id="solution"
                    type="url"
                    placeholder="https://leetcode.com/submissions/detail/..."
                    value={solutionLink}
                    onChange={(e) => setSolutionLink(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20"
                  />
                </div>
                {submitError && (
                  <p className="text-sm text-red-400">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={!solutionLink}
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                    solutionLink
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30"
                      : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/10"
                  }`}
                >
                  Submit Solution
                </button>
              </form>
            </>
          )}

          {submitted && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Proof Submitted!</h3>
              <p className="text-zinc-400 text-sm mb-5">Today's coding session is locked in.</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <div className="text-2xl font-black text-emerald-400">{currentStreak}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">🔥 Day Streak</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                  <div className="text-2xl font-black text-yellow-400">₹{dailyCommitment}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">🪙 Secured today</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
                <p className="text-sm text-zinc-300 italic">"{todayLine}"</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  Next submission unlocks in
                </div>
                <div className="flex items-center justify-center gap-3">
                  {[{ val: timeLeft.h, label: "hrs" }, { val: timeLeft.m, label: "min" }, { val: timeLeft.s, label: "sec" }].map(({ val, label }) => (
                    <div key={label} className="text-center">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                        {String(val).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{label}</div>
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
