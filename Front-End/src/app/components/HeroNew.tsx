import React from "react";
import { ArrowRight, Check, PlayCircle, ShieldCheck, RefreshCw, Link2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroNew() {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 py-20 md:py-0 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="relative z-20 flex flex-col items-center text-center xl:items-start xl:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] mb-8 shadow-sm">
              <img 
                src="/logo/favicon-32x32.png" 
                className="w-5 h-5 rounded-full object-contain animate-bounce" 
                style={{ animationDuration: "3s" }} 
                alt="Mascot Icon" 
              />
              <span className="text-xs text-zinc-300 font-medium tracking-wide pr-1">
                Meet Consisty — Your AI Accountability Partner
              </span>
            </div>
 
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.2rem] font-bold mb-6 leading-[1.1] tracking-tight text-white">
              Stay Consistent.<br />
              Build Real Discipline.<br />
              <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                Get Paid.
              </span>
            </h1>
 
            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed max-w-lg font-normal">
              The ultimate accountability platform for placement preparation. Auto-sync your profiles, commit a daily refundable stake, and earn rewards funded by those who break their streaks.
            </p>
 
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate("/auth")}
                className="group px-7 py-3.5 bg-white hover:bg-zinc-100 text-black font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-white/5 active:scale-[0.98]"
              >
                Start Free
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              
              <a 
                href="https://youtu.be/bdeShmhlTlA"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3.5 bg-white/[0.03] hover:bg-white/[0.07] text-white font-semibold rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Watch Demo
                <PlayCircle className="w-4.5 h-4.5 text-zinc-400 group-hover:text-white transition-colors" />
              </a>
            </div>
 
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400 font-medium justify-center xl:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span>Automated API Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span>Earn from the Shared Pool</span>
              </div>
            </div>
          </div>
 
          {/* Right: Mock Connected Platforms Widget */}
          <div className="hidden xl:block relative w-full mx-auto xl:mx-0 font-sans">
            {/* Main Widget Card */}
            <div className="relative bg-[#0A0C10] rounded-[2.5rem] p-8 border border-white/[0.05] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Account Sync</span>
                  <h3 className="font-semibold text-white text-lg tracking-tight">Connected Platforms</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 14 Day Streak
                </div>
              </div>
 
              {/* Platforms List */}
              <div className="space-y-4 mb-8">
                
                {/* LeetCode Sync */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                      <Globe className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">LeetCode Profile</h4>
                      <p className="text-xs text-zinc-500">leetcode.com/u/demouser</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                      Auto-Synced
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">352 Solved</span>
                  </div>
                </div>
 
                {/* GFG Sync */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <Link2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">GeeksforGeeks Profile</h4>
                      <p className="text-xs text-zinc-500">auth.geeksforgeeks.org/user/demouser</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                      Auto-Synced
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">198 Solved</span>
                  </div>
                </div>
 
                {/* Codeforces - Placeholder / Secondary */}
                <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.02] border-dashed rounded-2xl opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-500/10 rounded-xl flex items-center justify-center border border-zinc-500/20">
                      <RefreshCw className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400">Codeforces Profile</h4>
                      <p className="text-xs text-zinc-600">Not connected</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 transition-all">
                    Connect
                  </button>
                </div>
 
              </div>
 
              {/* Daily Streak Progress Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Left Card: Active Commitment */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Commitment Stake</span>
                    <span className="text-base font-bold text-white">₹250 Locked</span>
                  </div>
                </div>
 
                {/* Right Card: Shared Pool Yield */}
                <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-450" />
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Shared Pool Yield</span>
                    <span className="text-base font-bold text-emerald-450">+₹48.50 Earned</span>
                  </div>
                </div>
 
              </div>
            </div>
            
            {/* Background glows for the UI card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
          </div>
 
        </div>
      </div>
    </section>
  );
}

// Internal placeholder for compatibility with any dynamic import checks
const CheckCircle2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
