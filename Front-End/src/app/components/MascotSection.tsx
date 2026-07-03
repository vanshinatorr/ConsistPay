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
    <section className="px-6 py-20 md:py-24 relative overflow-hidden bg-[#09070F] w-full border-b border-white/[0.04]">
      {/* Background glow radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          
          {/* Left Column: Smart Narrator Mascot visual */}
          <div className="flex flex-col items-center justify-center text-center select-none">
            <div className="relative w-64 h-64 flex items-center justify-center bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] p-6 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />
              
              <img 
                src="/logo/mascot-full.png" 
                alt="ConsistPay Accountability Partner - Consisty" 
                className="w-[90%] h-full object-contain relative z-10 filter drop-shadow-[0_15px_35px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
            
            {/* Guide Bubble */}
            <div className="mt-8 relative max-w-sm bg-[#06080D] border border-white/[0.05] rounded-2xl p-4 shadow-lg text-left">
              <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#06080D] border-t border-l border-white/[0.05] rotate-45" />
              <p className="text-xs text-zinc-300 font-medium leading-relaxed text-center relative z-10">
                "Traditional habit trackers rely on motivation. But motivation is unreliable. ConsistPay is engineered as a system: lock your stake, practice daily, and succeed."
              </p>
            </div>
          </div>

          {/* Right Column: Comparative Proof Blocks */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 py-1 rounded-md bg-violet-950/40 border border-violet-900/30 mb-4 inline-block">
                Systems Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
                Designed for Real Discipline
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg font-normal mb-8">
                Most platforms fail because self-reporting is easy to skip. We connect directly to your public profiles to verify every solve.
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              
              {/* Box 1: Typical Trackers */}
              <div className="bg-[#0C0E14]/40 border border-white/[0.04] rounded-2xl p-6 flex flex-col">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-6">
                  Typical Habit Apps
                </h4>
                <div className="space-y-4 flex-1">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed font-normal">
                        {item.typical}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: ConsistPay (Highlighted offset card) */}
              <div className="bg-[#0E0B19]/80 border border-violet-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col sm:translate-y-[-8px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[60px] rounded-full pointer-events-none" />
                <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-6 relative z-10">
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
