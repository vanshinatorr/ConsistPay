import React from "react";
import { ShieldCheck, Cpu, Lock, Server } from "lucide-react";

export function SocialProof() {
  const stats = [
    { value: "80+", label: "Daily Solves Verified" },
    { value: "₹9,500+", label: "Stakes Returned" },
    { value: "88.2%", label: "Streak Success Rate" },
  ];

  return (
    <section className="relative z-20 w-full overflow-hidden bg-[#090A0E] py-20 md:py-24 border-b border-white/[0.04]">
      {/* Premium subtle grid texture background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.006)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Live indicator tag */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
            Verified Network Activity
          </span>
        </div>

        {/* High-Typography Stats Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.04] py-8 border-t border-b border-white/[0.04] items-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-6 md:py-4 relative z-10 group">
              <div className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2 transition-transform duration-300 group-hover:scale-102">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.22em] text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Grayscale Infrastructure Badges */}
        <div className="mt-12 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Security & Integration Partners
          </span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 hover:opacity-50 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-zinc-400 transition-colors cursor-default grayscale">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">Stripe Payments</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 transition-colors cursor-default grayscale">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">OpenAI Engine</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 transition-colors cursor-default grayscale">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 transition-colors cursor-default grayscale">
              <Server className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">AWS Cloud Infrastructure</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
