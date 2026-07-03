import React, { useState } from "react";
import { Wallet, Link2, RefreshCw, CheckCircle2, Swords, Coins } from "lucide-react";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: "01. Commit Stakes",
      title: "Set Stakes & Link Profiles",
      description: "Select a refundable daily stake (₹5 - ₹50) to create financial accountability. Connect LeetCode and GFG handles in seconds.",
      features: [
        "Refundable monthly deposits",
        "Loss-aversion discipline engine",
        "Direct API profile linking",
      ],
      icon: Wallet,
    },
    {
      id: 1,
      label: "02. API Auto-Sync",
      title: "Frictionless Auto-Verification",
      description: "Solve problems directly on LeetCode or GFG. ConsistPay automatically scrapes APIs before midnight to verify progress. Zero uploads.",
      features: [
        "100% automated background sync",
        "No manual screenshot uploads",
        "Double-verification safety check",
      ],
      icon: RefreshCw,
    },
    {
      id: 2,
      label: "03. Earn Yield",
      title: "Shared Pool Payouts",
      description: "Maintain your coding streak. Retrieve your full deposit at period end, plus a dividend from the pool funded by slacking peers.",
      features: [
        "100% principal deposit refund",
        "Dividends from broke streaks",
        "Direct 1v1 battle payouts",
      ],
      icon: Coins,
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 md:py-24 relative overflow-hidden bg-[#000000] w-full border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-4 inline-block font-mono">
            Interactive Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            How ConsistPay Works
          </h2>
          <p className="text-sm text-zinc-450 max-w-lg mx-auto font-normal">
            Select a phase below to explore how automated accountability secures your coding discipline.
          </p>
        </div>

        {/* Tab Row Selector */}
        <div className="flex justify-center border-b border-white/[0.04] mb-12 max-w-xl mx-auto">
          <div className="flex gap-2 w-full p-1 bg-white/[0.005] border border-white/[0.03] rounded-2xl">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive 
                      ? "bg-white text-black shadow-md shadow-white/5" 
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Descriptions */}
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest block mb-2 font-mono">
              Phase 0{tabs[activeTab].id + 1}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              {tabs[activeTab].title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal mb-8 max-w-lg">
              {tabs[activeTab].description}
            </p>

            {/* Bullets */}
            <div className="space-y-4 w-full mb-4">
              {tabs[activeTab].features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center border border-zinc-800 bg-white/[0.02] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-200 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Visual Widget Mockup */}
          <div className="relative flex items-center justify-center">
            
            {/* Widget Container */}
            <div className="w-full max-w-md bg-[#090A0F] border border-zinc-800 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative z-10 transition-all duration-300">
              
              {/* Tab 0 Widget: Commit Setup */}
              {activeTab === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
                    <span className="text-xs font-bold text-zinc-405">Lock Commitment</span>
                    <span className="text-xs font-bold text-white">Stake: ₹20/day</span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Refundable Stake</span>
                        <span className="text-base font-bold text-white">₹600 / month</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-450 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Principal Protected</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Linked User Profiles</span>
                      <div className="flex gap-2">
                        <span className="text-xs font-semibold text-white px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded-lg flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LeetCode: demouser
                        </span>
                        <span className="text-xs font-semibold text-white px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded-lg flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> GFG: demouser
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1 Widget: API Auto-Sync Verification */}
              {activeTab === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
                    <span className="text-xs font-bold text-zinc-405">Background Sync Engine</span>
                    <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> Live
                    </span>
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                      <span className="text-zinc-300">LeetCode API Query</span>
                      <span className="font-semibold text-emerald-450">Verified [Solved]</span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                      <span className="text-zinc-300">GFG API Query</span>
                      <span className="font-semibold text-emerald-450">Verified [Solved]</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-550 border-t border-white/[0.04] pt-3">
                      <span>Last Verified Sync: 2 mins ago</span>
                      <span>Next Sync: Today 11:50 PM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2 Widget: Shared Payout */}
              {activeTab === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
                    <span className="text-xs font-bold text-zinc-405">Discipline Settlement</span>
                    <span className="text-xs font-bold text-emerald-450">Yield Active</span>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                        <span className="text-[10px] text-zinc-550 uppercase tracking-wider block">Principal back</span>
                        <span className="text-sm font-bold text-white">₹600.00</span>
                      </div>
                      <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                        <span className="text-[10px] text-zinc-550 uppercase tracking-wider block">Community yield</span>
                        <span className="text-sm font-bold text-emerald-450">+₹48.50</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.005] border border-zinc-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                          <Swords className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white">1v1 Battle Payout</span>
                          <span className="text-[9px] text-zinc-550 block">demouser vs coder22</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-450">+₹20.00</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
