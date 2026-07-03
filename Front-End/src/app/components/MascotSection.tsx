import React from "react";
import { X, Check } from "lucide-react";

export function MascotSection() {
  const comparisons = [
    {
      typical: "Easy to bypass (no actual code verification checks)",
      consistpay: "100% automated API verification via LeetCode & GFG",
    },
    {
      typical: "Zero consequences for slacking and breaking streaks",
      consistpay: "Refundable commitment stakes make consistency mandatory",
    },
    {
      typical: "Boring virtual badge rewards and vanity metrics",
      consistpay: "Retrieve your stake plus earn yield from lazy peers",
    },
  ];

  return (
    <section className="px-6 py-20 md:py-24 relative overflow-hidden bg-[#090A0E] w-full border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-16 items-center">
          
          {/* Left Column: Huge Smart Narrator Mascot visual */}
          <div className="flex flex-col items-center justify-center select-none">
            <div className="relative flex flex-col items-center justify-center">
              <img 
                src="/logo/mascot-full.png" 
                alt="ConsistPay Accountability Partner - Consisty" 
                className="w-64 sm:w-72 md:w-[22rem] h-auto object-contain relative z-10 transition-all duration-500 hover:scale-[1.03] hover:rotate-1"
              />
              {/* 3D Floor Shadow */}
              <div className="w-48 sm:w-56 h-4 bg-white/5 rounded-[100%] blur-[12px] mt-2 opacity-50 relative z-0" />
            </div>
          </div>

          {/* Right Column: Comparative Proof Blocks */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-4 inline-block font-mono">
                Systems Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
                Designed for Real Discipline
              </h2>
              <p className="text-sm text-zinc-450 leading-relaxed max-w-lg font-normal mb-8">
                Most platforms fail because self-reporting is easy to skip. We connect directly to your public profiles to verify every solve.
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Box 1: Typical Trackers */}
              <div className="bg-[#000000]/40 border border-white/[0.03] rounded-2xl p-6 flex flex-col">
                <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-wider mb-6">
                  Typical Habit Apps
                </h4>
                <div className="space-y-4 flex-1">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-450 text-xs leading-relaxed font-normal">
                        {item.typical}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: ConsistPay (Highlighted offset card) */}
              <div className="bg-[#0D0E12] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col sm:translate-y-[-8px] transition-colors">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-6 relative z-10">
                  ConsistPay
                </h4>
                <div className="space-y-4 flex-1 relative z-10">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-450" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-200 text-xs leading-relaxed font-semibold">
                        {item.consistpay}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
