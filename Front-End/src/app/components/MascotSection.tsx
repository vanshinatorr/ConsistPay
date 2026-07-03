import React from "react";

export function MascotSection() {
  return (
    <section className="px-6 py-24 md:py-28 relative overflow-hidden bg-[#09070F] w-full border-b border-white/[0.04]">
      {/* Faint radial purple glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_65%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Bold, large scale typography */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-violet-950/40 border border-violet-900/30 mb-8">
              Platform Philosophy
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8 leading-[1.15]">
              Consistency is a System,<br />Not an Emotion.
            </h2>
            
            <div className="space-y-6 text-zinc-300 font-medium">
              <p className="text-base sm:text-lg leading-relaxed text-zinc-400 font-normal">
                Most habit platforms fail because they rely on motivation. But motivation is unreliable. When interview deadlines pile up or routines break, willpower dissolves.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-zinc-400 font-normal">
                ConsistPay treats consistency as an engineering problem. By connecting directly to platform APIs and backing it with refundable stakes, we align your incentives so discipline becomes automatic.
              </p>
            </div>
            
            {/* Speach note block as editorial quote */}
            <div className="mt-10 border-l-2 border-violet-500 pl-4 py-1 text-xs text-zinc-550 leading-relaxed max-w-lg font-normal italic">
              "No screenshots to upload, no spreadsheets to paste. ConsistPay queries public profiles directly before midnight. You either stay consistent, or your stake funds the rewards pool." — Consisty
            </div>
          </div>

          {/* Right Column: Dominant Mascot Visual Anchor */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm h-[320px] sm:h-[400px] flex items-center justify-center select-none bg-white/[0.01] border border-white/[0.03] rounded-[2rem] p-6 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />
              
              <img 
                src="/logo/mascot-full.png" 
                alt="ConsistPay Smart Accountability Narrator Mascot - Consisty" 
                className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_20px_50px_rgba(139,92,246,0.35)] transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
