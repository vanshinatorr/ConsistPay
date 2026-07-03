import React from "react";
import { X, Check } from "lucide-react";

export function WhyConsistPay() {
  const comparisons = [
    {
      typical: "Easy to fake streaks (no actual verification checks)",
      consistpay: "100% automated sync directly via LeetCode & GFG APIs",
    },
    {
      typical: "Zero consequences for breaking a daily streak",
      consistpay: "Financial stakes make discipline mandatory",
    },
    {
      typical: "Boring virtual badges and vanity metrics",
      consistpay: "Get refunded plus earn rewards from slacking peers",
    },
    {
      typical: "Isolated, boring coding routine",
      consistpay: "Competitive 1v1 battles and custom group pools",
    }
  ];

  return (
    <section className="px-6 py-16 md:py-20 relative overflow-hidden bg-[#06080D] w-full border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-4 inline-block">
            Deep Contrast
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Designed for Real Accountability
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto font-normal">
            Self-reporting systems are built to be bypassed. ConsistPay enforces genuine consistency.
          </p>
        </div>

        {/* Comparison Offset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-6 md:pt-10">
          
          {/* Column 1: Typical Apps */}
          <div className="bg-[#0C0E14]/60 border border-white/[0.04] rounded-[2rem] p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-base font-bold text-zinc-400 mb-8 uppercase tracking-wider">
              Standard Habit Trackers
            </h3>
            
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-5.5 h-5.5 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                    {item.typical}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: ConsistPay (Asymmetric Offset Card) */}
          <div className="relative bg-[#0E0B19] border border-violet-500/30 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(139,92,246,0.15)] md:-translate-y-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.01] hover:border-violet-500/40">
            {/* Visual glow indicator */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                ConsistPay Engine
              </h3>
              <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Active Verification
              </span>
            </div>
            
            <div className="space-y-6 relative z-10">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-450" strokeWidth={3} />
                  </div>
                  <p className="text-zinc-200 font-medium text-xs sm:text-sm leading-relaxed">
                    {item.consistpay}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
