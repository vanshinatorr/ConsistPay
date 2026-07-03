import React from "react";
import { Wallet, Swords, BarChart3, Check } from "lucide-react";

export function MoreFeatures() {
  return (
    <section className="px-6 py-16 md:py-20 relative overflow-hidden bg-[#06080D] w-full border-b border-white/[0.04]">
      {/* Background visual detail */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.02),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-4 inline-block">
            Feature Set
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            More Than Just a Streak
          </h2>
          <p className="text-sm text-zinc-450 max-w-lg mx-auto font-normal">
            Accountability tools engineered to transform daily coding consistency into placement readiness.
          </p>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Dominant Feature: Discipline-Backed Yield (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 group flex flex-col justify-between bg-gradient-to-br from-[#0F0B1E] to-[#0A0C10] border border-violet-500/20 rounded-[2rem] p-8 md:p-10 shadow-[0_15px_45px_rgba(139,92,246,0.1)] transition-all duration-300 hover:border-violet-500/35 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 blur-[80px] pointer-events-none" />
            
            <div>
              {/* Feature Header */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-violet-500/20 bg-violet-500/10 shadow-inner">
                  <Wallet className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest block mb-0.5">Core Mechanic</span>
                  <h3 className="text-lg font-bold text-white tracking-wide">Discipline-Backed Yield</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 mb-8 leading-relaxed font-normal relative z-10 max-w-xl">
                Self-discipline shouldn't just be rewarding—it should be profitable. Secure your commitment stake by maintaining daily streaks, and earn rewards directly funded by peers who broke their habits.
              </p>

              {/* Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
                {[
                  "Compound monthly stake refunds",
                  "Direct yield share from slacking peers",
                  "10% lifetime referral earnings",
                  "Transparent community-pool verification"
                ].map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center border border-violet-500/20 bg-violet-500/10">
                      <Check className="w-3 h-3 text-violet-400" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-zinc-300 font-medium">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="relative z-10 self-start px-4 py-2 rounded-xl text-xs font-bold transition-all border border-violet-500/20 text-violet-400 bg-violet-500/10 hover:bg-violet-500/20">
              Explore Yield Model
            </button>
          </div>

          {/* Right Column: Stacked Secondary Features (Each spans 1 column) */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            
            {/* Feature 2: Battles */}
            <div className="group flex flex-col justify-between bg-[#0A0C10] border border-white/[0.04] rounded-[2rem] p-6 hover:border-white/[0.08] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(16,185,129,0.04)] flex-1">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-emerald-500/20 bg-emerald-500/10">
                    <Swords className="w-5 h-5 text-emerald-450" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">1v1 Coding Battles</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
                  Challenge peers directly. Set customized stake pools, match on identical tasks, and let the verified winner take the entire stake.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-450 uppercase tracking-widest">
                Direct Peer Competition
              </span>
            </div>

            {/* Feature 3: Placement Analytics */}
            <div className="group flex flex-col justify-between bg-[#0A0C10] border border-white/[0.04] rounded-[2rem] p-6 hover:border-white/[0.08] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(139,92,246,0.04)] flex-1">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.05] bg-white/[0.02]">
                    <BarChart3 className="w-5 h-5 text-zinc-300" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">Placement Analytics</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
                  Get structural insights on solve velocity, consistency scores, and streak retention indices to ensure placement readiness.
                </p>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Data-Driven Discipline
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
