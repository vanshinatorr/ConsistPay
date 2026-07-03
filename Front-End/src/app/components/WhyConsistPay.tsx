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
    <section className="px-6 py-16 relative overflow-hidden bg-transparent w-full">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Designed for Real Accountability
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-normal">
            Self-reporting systems are built to be bypassed. ConsistPay enforces genuine consistency.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Typical Apps */}
          <div className="bg-[#0A0C10] border border-white/[0.04] rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-lg font-bold text-zinc-300 mb-8 flex items-center gap-3">
              Standard Habit Trackers
            </h3>
            
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                    {item.typical}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: ConsistPay */}
          <div className="bg-[#0A0C10] border border-violet-500/20 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.08)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              ConsistPay
            </h3>
            
            <div className="space-y-6 relative z-10">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
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
