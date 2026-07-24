import React from "react";
import { ArrowRight, Check, PlayCircle, RefreshCw, Link2, Globe, Shield, Terminal, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroNew() {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 pt-6 pb-12 md:pt-8 md:pb-28 overflow-hidden w-full bg-white dark:bg-[#000000] border-b border-zinc-200 dark:border-white/[0.04]">
      {/* Subtle backing glow for the mockup card to add 3D depth */}
      <div className="absolute right-0 top-1/4 w-[40rem] h-[40rem] bg-emerald-500/[0.02] rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-16 items-center">

          {/* Left: Text Content */}
          <div className="relative z-20 flex flex-col items-center text-center xl:items-start xl:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-405 rounded-full animate-pulse" />
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold tracking-wide uppercase">
                Automated Verification Engine
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.2rem] font-bold mb-6 leading-[1.1] tracking-tight text-zinc-900 dark:text-white">
              Stay Consistent.<br />
              Build Real Discipline.<br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Get Paid.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-300 mb-6 md:mb-10 leading-relaxed max-w-lg font-normal">
              The ultimate accountability platform for placement preparation. Auto-sync your profiles, commit a daily refundable stake, and earn rewards funded by those who break their streaks.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-10">
              <button
                onClick={() => navigate("/auth")}
                className="group px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white-force dark:from-white dark:to-white dark:text-zinc-950 dark:border-transparent dark:hover:from-zinc-100 dark:hover:to-zinc-100 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-[0_1px_2px_rgba(99,102,241,0.2),0_4px_12px_rgba(99,102,241,0.1)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(99,102,241,0.2),0_1px_3px_rgba(99,102,241,0.1)]"
              >
                Start Free
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-250 group-hover:translate-x-1" />
              </button>

              <a
                href="https://youtu.be/bdeShmhlTlA"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3.5 bg-white dark:bg-[#0D0E12] hover:bg-zinc-50 dark:hover:bg-[#16181F] text-zinc-800 dark:text-white font-semibold rounded-xl border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.15] transition-all duration-250 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Watch Demo
                <PlayCircle className="w-4.5 h-4.5 text-zinc-550 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium justify-center xl:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" strokeWidth={3} />
                </div>
                <span>Automated API Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" strokeWidth={3} />
                </div>
                <span>Earn from the Shared Pool</span>
              </div>
            </div>
          </div>

          {/* Right: Mock Connected Platforms Widget */}
          <div className="hidden xl:block relative w-full mx-auto xl:mx-0 font-sans z-10">
            {/* Main Widget Card */}
            <div className="relative bg-white dark:bg-[#090A0F] rounded-[2.5rem] p-8 border border-zinc-200 dark:border-white/[0.05] shadow-sm dark:shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-200 dark:border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Live Api Sync</span>
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-lg tracking-tight">Connected Platforms</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  14 Day Streak
                </div>
              </div>

              {/* Platforms List */}
              <div className="space-y-4 mb-6">

                {/* LeetCode Sync */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/[0.04] rounded-2xl hover:border-zinc-300 dark:hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-amber-550" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">LeetCode Profile</h4>
                      <p className="text-xs text-zinc-500 font-normal">leetcode.com/u/demouser</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wider">
                      Synced
                    </span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">352 Solved</span>
                  </div>
                </div>

                {/* GFG Sync */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/[0.04] rounded-2xl hover:border-zinc-300 dark:hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Link2 className="w-5 h-5 text-emerald-555" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">GeeksforGeeks Profile</h4>
                      <p className="text-xs text-zinc-500 font-normal">auth.geeksforgeeks.org/user/demouser</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wider">
                      Synced
                    </span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">198 Solved</span>
                  </div>
                </div>

                {/* Codeforces - Coming Soon (Disabled Style) */}
                <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-white/[0.005] border border-zinc-200 dark:border-white/[0.02] border-dashed rounded-2xl opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/[0.04] rounded-xl flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-500">Codeforces Profile</h4>
                      <p className="text-xs text-zinc-400 dark:text-zinc-650 font-normal">Integration pending</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#0E0F14] px-2 py-1 rounded-md uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>

              </div>

              {/* Real-time Verification Terminal Feed (High Fidelity Utility) - Keep dark theme style for coding feel */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-6 font-mono text-[11px] leading-relaxed select-none">
                <div className="flex items-center justify-between text-zinc-500 mb-3 pb-2 border-b border-zinc-800">
                  <span className="uppercase text-[9px] font-bold tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-zinc-450" /> Verification Logs
                  </span>
                  <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active Sync
                  </span>
                </div>
                <div className="space-y-1.5 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600">[17:42:01]</span>
                    <span className="text-amber-505 font-semibold">LeetCode</span>
                    <span className="text-zinc-500">→ verified</span>
                    <span className="text-white font-medium">"Two Sum"</span>
                    <span className="text-emerald-400 ml-auto font-semibold text-[10px]">STAKE SECURED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-600">[17:40:15]</span>
                    <span className="text-emerald-500 font-semibold">GFG</span>
                    <span className="text-zinc-500">→ verified</span>
                    <span className="text-white font-medium">"Reverse Array"</span>
                    <span className="text-emerald-400 ml-auto font-semibold text-[10px]">STAKE SECURED</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50">
                    <span className="text-zinc-600">[17:28:40]</span>
                    <span className="text-amber-505 font-semibold">LeetCode</span>
                    <span className="text-zinc-500">→ verified</span>
                    <span className="text-white font-medium">"Valid Parentheses"</span>
                    <span className="text-emerald-400 ml-auto font-semibold text-[10px]">STAKE SECURED</span>
                  </div>
                </div>
              </div>

              {/* Daily Streak Progress Grid */}
              <div className="grid grid-cols-2 gap-4">

                {/* Left Card: Active Commitment */}
                <div className="bg-zinc-50 dark:bg-white/[0.01] border border-zinc-200 dark:border-white/[0.04] hover:border-zinc-300 dark:hover:border-white/[0.08] rounded-2xl p-4 flex items-center gap-4 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-zinc-650 dark:text-zinc-300" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">Commitment Stake</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">₹250 Locked</span>
                  </div>
                </div>

                {/* Right Card: Shared Pool Yield */}
                <div className="bg-emerald-50/40 dark:bg-emerald-500/[0.01] border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-500/60 uppercase tracking-wider block mb-0.5">Shared Pool Yield</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+₹48.50 Earned</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
