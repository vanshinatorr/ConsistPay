import { ShieldCheck, Cpu, Lock, Server } from "lucide-react";

export function SocialProof() {
  const stats = [
    { value: "24", label: "Submissions Verified" },
    { value: "₹150", label: "Refunded to Users" },
    { value: "100%", label: "Streak Retention" },
  ];

  return (
    <section className="relative z-20 border-y border-white/5 bg-white/[0.01] overflow-hidden">
      {/* Very subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col pt-6">
        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Network Data</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 py-6 md:py-8 relative">
          {/* Ambient background glow behind stats */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent opacity-50" />
          
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center py-4 md:py-0 relative z-10 group">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent tracking-tight mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust Logos Row */}
        <div className="border-t border-white/5 py-5 bg-black/20 flex flex-col items-center justify-center relative">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Powered by Enterprise Infrastructure</span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-default grayscale hover:grayscale-0">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-default grayscale hover:grayscale-0">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">OpenAI</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-default grayscale hover:grayscale-0">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">256-bit AES</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-default grayscale hover:grayscale-0">
              <Server className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">AWS Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
