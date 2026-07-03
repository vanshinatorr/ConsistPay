import React from "react";
import { Wallet, Swords, BarChart3, Check } from "lucide-react";

export function MoreFeatures() {
  const features = [
    {
      icon: Wallet,
      title: "Discipline-Backed Yield",
      description: "Secure your deposit by maintaining your coding streak and earn rewards from slacking peers.",
      bullets: ["Streak payouts", "Monthly compound refunds", "10% referral bonuses"],
      color: "violet",
      badge: "Accountability Pays",
    },
    {
      icon: Swords,
      title: "1v1 Coding Battles",
      description: "Challenge friends or peers to custom coding sprints. Set mutual stakes and the winner takes the pool.",
      bullets: ["Custom stake amounts", "Direct 1v1 matchmaking", "Automated solve verification"],
      color: "emerald",
      badge: "Compete to Win",
    },
    {
      icon: BarChart3,
      title: "Placement Analytics",
      description: "Track your performance metrics, solve trends, and placement readiness index.",
      bullets: ["Consistency heatmap", "Solve velocity charts", "Discipline score index"],
      color: "violet",
      badge: "Track Your Growth",
    },
  ];

  const getColorClasses = (color: string) => {
    if (color === "emerald") {
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-450",
        border: "border-emerald-500/20",
        badgeBg: "bg-emerald-500/10 hover:bg-emerald-500/20",
        glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]",
        iconBg: "bg-emerald-500/10",
        checkBorder: "border-emerald-500/20",
      };
    }
    return {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/20",
      badgeBg: "bg-violet-500/10 hover:bg-violet-500/20",
      glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]",
      iconBg: "bg-violet-500/10",
      checkBorder: "border-violet-500/20",
    };
  };

  return (
    <section className="px-6 py-16 relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.02),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-zinc-400 text-xs font-semibold mb-3 inline-block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            More Than Just a Streak
          </h2>
          <p className="text-sm text-zinc-450 max-w-xl mx-auto font-normal">
            SaaS-grade accountability tools designed to turn coding consistency into placement readiness.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`group flex flex-col bg-[#0A0C10] border border-white/[0.04] rounded-3xl p-8 hover:border-white/[0.08] transition-all duration-300 relative overflow-hidden ${colors.glow}`}
              >
                
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.05] ${colors.iconBg} shadow-inner`}>
                    <feature.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">{feature.title}</h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 mb-8 leading-relaxed font-normal relative z-10 flex-1">
                  {feature.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-4 mb-8 relative z-10">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${colors.checkBorder} ${colors.bg}`}>
                        <Check className={`w-3.5 h-3.5 ${colors.text}`} strokeWidth={3} />
                      </div>
                      <span className="text-xs text-zinc-300 font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Badge/Action */}
                <button
                  className={`relative z-10 self-start px-4 py-2 rounded-xl text-xs font-bold transition-all border ${colors.border} ${colors.text} ${colors.badgeBg}`}
                >
                  {feature.badge}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
