import React from "react";
import { Shield, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function MascotSection() {
  return (
    <section className="px-6 py-20 relative overflow-hidden bg-transparent w-full">
      {/* Subtle radial backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          
          {/* Left Column: Smart Narrator Mascot visual */}
          <div className="flex flex-col items-center justify-center relative select-none">
            {/* Ambient halo background */}
            <div className="absolute w-72 h-72 bg-violet-500/5 blur-3xl rounded-full pointer-events-none" />
            
            {/* Mascot Image Card */}
            <div className="relative w-64 h-64 flex items-center justify-center group bg-white/[0.01] border border-white/[0.04] rounded-3xl p-6 shadow-inner">
              <img 
                src="/logo/mascot-full.png" 
                alt="ConsistPay Accountability Partner Mascot" 
                className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_12px_24px_rgba(139,92,246,0.25)] transition-all duration-500 hover:scale-[1.02] hover:-rotate-1"
              />
            </div>
            
            {/* Single-line guide bubble explaining auto-sync mechanic */}
            <div className="mt-8 relative max-w-sm bg-[#0A0C10] border border-white/[0.06] rounded-2xl p-4 shadow-lg">
              {/* Arrow */}
              <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A0C10] border-t border-l border-white/[0.06] rotate-45" />
              <p className="text-xs text-zinc-300 font-medium text-center relative z-10 leading-relaxed">
                "I track your daily progress directly from LeetCode and GFG APIs. No manual uploads. No excuses. Stay consistent or fund the pool."
              </p>
            </div>
          </div>

          {/* Right Column: Platform Philosophy & Core Mechanics */}
          <div>
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold border border-violet-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Platform Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                Accountability Trumps Willpower
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                Willpower is finite; system design is permanent. ConsistPay is engineered to replace fragile motivation with bulletproof daily discipline. We connect directly to your public profiles to verify every solve automatically.
              </p>
            </div>

            {/* Sub-principles list */}
            <div className="space-y-6">
              
              {/* Point 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Zero-friction Auto Sync</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    We query platform API pipelines before midnight. No screenshots to upload, no URLs to paste. Just code as you normally do, and we verify the rest.
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-450" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Stakes-backed Motivation</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Locking a small refundable stake uses loss-aversion psychology to make consistency your default state. You retrieve your deposit when you stay active.
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Community Pool Deductions</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Missed coding days deduct a portion of your stake, sending it to a collective pool distributed to developers who kept their streaks alive.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-start">
              <Link 
                to="/signup" 
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-98"
              >
                Get Started
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
