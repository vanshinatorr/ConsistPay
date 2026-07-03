import React from "react";
import { ShieldCheck, Cpu, Lock, Server } from "lucide-react";

export function SocialProof() {
  const stats = [
    { value: "4,200+", label: "Submissions Verified" },
    { value: "₹45,000+", label: "Refunded to Users" },
    { value: "96.4%", label: "Streak Retention Rate" },
  ];

  return (
    <section className="relative z-20 w-full overflow-hidden bg-transparent py-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Live Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
            Live Network Data
          </span>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.04] py-6 relative border-t border-b border-white/[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.02),transparent_70%)] pointer-events-none -z-10" />
          
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-4 md:py-0 relative z-10 group">
              <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1 group-hover:scale-102 transition-transform">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Infrastructure Row */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Security & Integration Partners
          </span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-70 transition-opacity duration-300">
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
