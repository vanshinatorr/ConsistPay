import React from "react";
import { Wallet, Link2, Flame, RefreshCw, AlertTriangle, Coins } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Wallet,
      title: "Set Your Stakes",
      description: "Select a refundable daily stake (₹5 - ₹50) to create financial accountability.",
      color: "violet",
    },
    {
      number: "02",
      icon: Link2,
      title: "Link Coding Profiles",
      description: "Connect LeetCode, GFG, or Codeforces accounts using your public username handles.",
      color: "violet",
    },
    {
      number: "03",
      icon: Flame,
      title: "Solve Daily Problems",
      description: "Practice and solve coding problems directly on your connected platforms as usual.",
      color: "violet",
    },
    {
      number: "04",
      icon: RefreshCw,
      title: "Automated API Sync",
      description: "Our system automatically scrapes public APIs before midnight to verify your progress. No manual uploads.",
      color: "emerald",
    },
    {
      number: "05",
      icon: AlertTriangle,
      title: "Streak or Deduct",
      description: "Stay consistent to build your streak. Break it, and your daily stake amount is deducted.",
      color: "rose",
    },
    {
      number: "06",
      icon: Coins,
      title: "Shared Pool Payout",
      description: "Maintain your monthly streak to retrieve your full deposit plus your share of rewards funded by slacking peers.",
      color: "emerald",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 relative overflow-hidden bg-transparent w-full">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-zinc-400 text-xs font-semibold mb-3 inline-block">
            Step-by-step
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            How ConsistPay Works
          </h2>
          <p className="text-sm text-zinc-450 max-w-xl mx-auto font-normal">
            A frictionless automated loop that turns daily consistency into an absolute habit.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Step 1: Stakes */}
          <div className="bg-[#0A0C10] border border-white/[0.04] rounded-3xl p-6 flex flex-col justify-between group hover:border-white/[0.08] transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-3xl font-black text-zinc-800">01</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">{steps[0].title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">{steps[0].description}</p>
            </div>
          </div>

          {/* Step 2: Profiles */}
          <div className="bg-[#0A0C10] border border-white/[0.04] rounded-3xl p-6 flex flex-col justify-between group hover:border-white/[0.08] transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Link2 className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-3xl font-black text-zinc-800">02</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">{steps[1].title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">{steps[1].description}</p>
            </div>
          </div>

          {/* Step 3: Solve Problems */}
          <div className="bg-[#0A0C10] border border-white/[0.04] rounded-3xl p-6 flex flex-col justify-between group hover:border-white/[0.08] transition-all hover:translate-y-[-2px]">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-3xl font-black text-zinc-800">03</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">{steps[2].title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">{steps[2].description}</p>
            </div>
          </div>

          {/* Step 4: Auto Sync (Highlighted Green) */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#0A0C10] to-[#0D1512] border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between group hover:border-emerald-500/35 transition-all hover:translate-y-[-2px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] pointer-events-none" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5 text-emerald-450 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <span className="text-3xl font-black text-emerald-500/10">04</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">{steps[3].title}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal max-w-lg">{steps[3].description}</p>
            </div>
          </div>

          {/* Step 5: Streak or Deduct (Highlighted Red) */}
          <div className="bg-gradient-to-br from-[#0A0C10] to-[#150D0D] border border-rose-500/20 rounded-3xl p-6 flex flex-col justify-between group hover:border-rose-500/35 transition-all hover:translate-y-[-2px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[80px] pointer-events-none" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
              <span className="text-3xl font-black text-rose-500/10">05</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-2">{steps[4].title}</h3>
              <p className="text-xs text-zinc-350 leading-relaxed font-normal">{steps[4].description}</p>
            </div>
          </div>

          {/* Step 6: Payout (Full Width Highlighted Green/Gold style but strict emerald) */}
          <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-[#0A0C10] via-[#0A0C10] to-[#0D1512] border border-emerald-500/20 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-emerald-500/35 transition-all hover:translate-y-[-2px] relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -translate-y-1/2 rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-emerald-450" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">Final Phase</span>
                <h3 className="text-base font-semibold text-white">{steps[5].title}</h3>
              </div>
            </div>
 
            <div className="relative z-10 md:max-w-xl shrink">
              <p className="text-xs text-zinc-350 leading-relaxed font-normal">
                {steps[5].description}
              </p>
            </div>
          </div>

        </div>

        {/* Mobile View Timeline */}
        <div className="block md:hidden space-y-4 relative z-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const theme = item.color === "emerald" 
              ? "text-emerald-450 border-emerald-500/20 bg-emerald-500/10" 
              : item.color === "rose"
              ? "text-rose-500 border-rose-500/20 bg-rose-500/10"
              : "text-violet-400 border-white/[0.04] bg-white/[0.02]";
            
            return (
              <div key={idx} className="flex gap-4 p-5 bg-[#0A0C10] border border-white/[0.04] rounded-2xl">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${theme}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-zinc-600 font-mono">{item.number}</span>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
