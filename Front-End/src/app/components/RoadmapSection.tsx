import React from "react";
import { Flame, Watch, BookOpen, Check, ShieldCheck, Dumbbell, Droplets, Hourglass } from "lucide-react";

export function RoadmapSection() {
  const cards = [
    {
      badge: "Q3 2026",
      icon: Dumbbell,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-500/5 border-rose-500/10",
      title: "Active Fitness Sync",
      description: "Automatically verify your morning runs, yoga sessions, or gym workouts. Link Strava, Apple Health, or Google Fit in one tap.",
      logs: [
        { label: "Strava Run Sync", value: "Verified: 5.2K Completed", status: "STAKE SECURED" },
        { label: "Apple Health Workouts", value: "Verified: 45m Yoga Session", status: "STAKE SECURED" }
      ]
    },
    {
      badge: "Q4 2026",
      icon: Watch,
      iconColor: "text-cyan-500",
      iconBg: "bg-cyan-500/5 border-cyan-500/10",
      title: "IoT & Smart Wearables",
      description: "Set stakes for recovery, sleep, and hydration. Sync metrics from Apple Watch, Garmin, Fitbit, or smart water bottles.",
      logs: [
        { label: "Garmin Sleep Index", value: "Verified: 7h 40m Sleep", status: "STAKE SECURED" },
        { label: "Hydrate Smart Bottle", value: "Verified: 2.8L Water Intake", status: "STAKE SECURED" }
      ]
    },
    {
      badge: "Q1 2027",
      icon: BookOpen,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/5 border-indigo-500/10",
      title: "Focus & Lifeware",
      description: "Enforce screentime limits and study consistency. Link Kindle, Goodreads, or RescueTime to maintain your focus discipline.",
      logs: [
        { label: "Kindle Reading Log", value: "Verified: 45 Minutes Read", status: "STAKE SECURED" },
        { label: "RescueTime Limit Check", value: "Verified: <45m Social Apps", status: "STAKE SECURED" }
      ]
    }
  ];

  return (
    <section className="px-6 py-20 md:py-24 relative overflow-hidden bg-[#090A0E] w-full border-b border-white/[0.04]">
      {/* Background radial accent glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/[0.005] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-4 inline-block font-mono">
            Integrations Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Consist<span className="text-emerald-400">Pay</span> Horizons: Future Habit Engines
          </h2>
          <p className="text-sm text-zinc-450 max-w-lg mx-auto font-normal">
            We are expanding our automated API verification beyond software development. Here is a sneak peek of integrations currently in active development.
          </p>
        </div>

        {/* Horizons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="bg-[#000000]/40 border border-white/[0.03] hover:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:bg-[#000000]/60 shadow-lg group"
              >
                <div>
                  {/* Card Header Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${card.iconBg}`}>
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-450 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-405 leading-relaxed font-normal mb-6">
                    {card.description}
                  </p>

                  {/* Mockup Verification logs */}
                  <div className="bg-[#000000] border border-white/[0.04] rounded-2xl p-4 font-mono text-[9px] leading-relaxed mb-6 select-none">
                    <div className="text-zinc-550 mb-2.5 pb-1.5 border-b border-white/[0.03] flex justify-between items-center">
                      <span className="uppercase text-[8px] font-bold tracking-wider">API Sync Preview</span>
                      <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Pending Release</span>
                    </div>
                    <div className="space-y-2">
                      {card.logs.map((log, li) => (
                        <div key={li} className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center text-zinc-400">
                            <span className="font-semibold text-zinc-300">{log.label}</span>
                            <span className="text-emerald-400/80 font-bold uppercase tracking-wider text-[8px] flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-400" /> {log.status}
                            </span>
                          </div>
                          <span className="text-zinc-500 font-normal">{log.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Waitlist tag */}
                <div className="border-t border-white/[0.03] pt-4 flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" /> Waitlist Open
                  </span>
                  <span className="text-emerald-450/80 font-bold uppercase tracking-wider hover:text-emerald-400 cursor-pointer transition-colors">
                    Join Beta →
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
