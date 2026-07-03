import React from "react";
import { Wallet, Link2, Flame, RefreshCw, AlertTriangle, Coins } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Wallet,
      title: "Set Your Stakes",
      description: "Select a refundable daily stake (₹5 - ₹50) to back your consistency habit. This forms your commitment.",
      size: "max-w-md",
      accent: "border-white/[0.04] bg-[#0A0C10]/60",
      iconColor: "text-violet-400"
    },
    {
      number: "02",
      icon: Link2,
      title: "Link Coding Profiles",
      description: "Connect LeetCode, GFG, or Codeforces accounts using your public username handles.",
      size: "max-w-md",
      accent: "border-white/[0.04] bg-[#0A0C10]/60",
      iconColor: "text-violet-400"
    },
    {
      number: "03",
      icon: Flame,
      title: "Practice Daily",
      description: "Solve coding problems directly on your connected platforms as you normally do.",
      size: "max-w-lg",
      accent: "border-white/[0.04] bg-[#0A0C10]/60",
      iconColor: "text-violet-400"
    },
    {
      number: "04",
      icon: RefreshCw,
      title: "Automated API Sync Check",
      description: "Our system automatically queries public APIs before midnight to verify your daily solve progress. No screenshots, no manual links.",
      size: "max-w-2xl border-emerald-500/20 bg-gradient-to-br from-[#0A0C10] to-[#0D1512] shadow-[0_0_30px_rgba(16,185,129,0.06)]",
      iconColor: "text-emerald-450 animate-spin"
    },
    {
      number: "05",
      icon: AlertTriangle,
      title: "Streak or Deduct",
      description: "Stay consistent to build your streak. Break it, and your daily stake amount is deducted for that day.",
      size: "max-w-lg",
      accent: "border-rose-500/20 bg-gradient-to-br from-[#0A0C10] to-[#150D0D]",
      iconColor: "text-rose-500"
    },
    {
      number: "06",
      icon: SharedPoolPayoutCard,
      title: "Shared Pool Payout",
      description: "Stay disciplined all month. Not only do you get your full deposit refunded, but you also take a cut from the rewards pool funded by developers who missed their daily goal.",
      size: "max-w-2xl border-emerald-500/20 bg-gradient-to-br from-[#0A0C10] to-[#0D1512] shadow-[0_0_30px_rgba(16,185,129,0.06)]",
      iconColor: "text-emerald-450"
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 md:py-24 relative overflow-hidden bg-[#09070F] w-full border-b border-white/[0.04]">
      {/* Background glow highlights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-violet-950/40 border border-violet-900/30 mb-4 inline-block">
            Connected Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            How ConsistPay Works
          </h2>
          <p className="text-sm text-zinc-450 max-w-lg mx-auto font-normal">
            A frictionless automated pipeline that turns daily consistency into an absolute habit.
          </p>
        </div>

        {/* Timeline Flow Container */}
        <div className="relative pl-8 sm:pl-12 border-l border-dashed border-white/[0.08] space-y-10 ml-4 sm:ml-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            
            return (
              <div key={idx} className="relative group">
                
                {/* Step Connector Node */}
                <div className="absolute left-[-45px] sm:left-[-61px] top-4 w-8 h-8 rounded-full bg-[#09070F] border border-white/[0.08] flex items-center justify-center group-hover:border-violet-500/40 transition-colors z-20 shadow-lg">
                  <span className="text-[10px] font-bold text-zinc-400 font-mono">
                    {step.number}
                  </span>
                </div>

                {/* Variable Size Step Card */}
                <div className={`w-full ${step.size} border rounded-[1.5rem] p-6 hover:border-white/[0.08] transition-all duration-300 ${step.accent ? step.accent : "bg-white/[0.02] border-white/[0.04]"}`}>
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                    {/* Content */}
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-2 tracking-wide">
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

const SharedPoolPayoutCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
