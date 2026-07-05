import React, { useState } from "react";
import { Wallet, RefreshCw, CheckCircle2, Swords, Coins, Check, HelpCircle } from "lucide-react";

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
    <section id="how-it-works" className="px-6 py-20 md:py-24 relative overflow-hidden bg-white dark:bg-[#000000] w-full border-b border-zinc-200 dark:border-white/[0.04]">
      {/* Soft backing glow behind the interactive tabs widget to create depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-zinc-650 dark:text-zinc-400 uppercase tracking-widest px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] mb-4 inline-block font-mono">
            Interactive Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight mb-4">
            How Consist<span className="text-emerald-505 dark:text-emerald-400">Pay</span> Works
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-455 max-w-lg mx-auto font-normal">
            Select a phase below to explore how automated accountability secures your coding discipline.
          </p>
        </div>

        {/* Tab Row Selector */}
        <div className="flex justify-center border-b border-zinc-200 dark:border-white/[0.04] mb-12 max-w-xl mx-auto">
          <div className="flex gap-2 w-full p-1 bg-zinc-100 dark:bg-white/[0.005] border border-zinc-200 dark:border-white/[0.03] rounded-2xl">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? "bg-zinc-800 dark:bg-white text-white dark:text-black shadow-sm" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.02]"
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
            <span className="text-[9px] font-bold text-emerald-605 dark:text-emerald-400 uppercase tracking-widest block mb-2 font-mono">
              Phase 0{tabs[activeTab].id + 1}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight leading-tight">
              {tabs[activeTab].title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-405 leading-relaxed font-normal mb-8 max-w-lg">
              {tabs[activeTab].description}
            </p>

            {/* Bullets */}
            <div className="space-y-4 w-full mb-4">
              {tabs[activeTab].features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-455" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-semibold">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Visual Widget Mockup */}
          <div className="relative flex items-center justify-center w-full">
            
            {/* Widget Container */}
            <div className="w-full max-w-md bg-white dark:bg-[#090A0F] border border-zinc-200 dark:border-zinc-805 rounded-[2rem] p-6 sm:p-8 shadow-sm dark:shadow-2xl relative z-10 transition-all duration-300">
              
              {/* Tab 0 Widget: Commit Setup */}
              {activeTab === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-white/[0.04]">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Lock Commitment</span>
                    <span className="text-xs font-bold text-zinc-850 dark:text-white">Stake: ₹20/day</span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-150 dark:border-white/[0.03] rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Refundable Stake</span>
                        <span className="text-base font-bold text-zinc-900 dark:text-white">₹600 / month</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-605 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wider">
                        Principal Protected
                      </span>
                    </div>
                    
                    <div className="space-y-2.5">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Linked User Profiles</span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-1.5 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 rounded-lg flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> LeetCode: demouser
                        </span>
                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 px-3 py-1.5 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10 rounded-lg flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> GFG: demouser
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 1 Widget: API Auto-Sync Verification */}
              {activeTab === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-white/[0.04]">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Background Sync Engine</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> Live API Sync
                    </span>
                  </div>
                  <div className="space-y-3.5">
                    {/* LeetCode Row */}
                    <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-150 dark:border-white/[0.03] rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white">LeetCode API Query</span>
                        <span className="text-[10px] text-zinc-500">leetcode.com/u/demouser</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-605 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        <Check className="w-3.5 h-3.5" /> VERIFIED
                      </div>
                    </div>
                    
                    {/* GFG Row */}
                    <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-150 dark:border-white/[0.03] rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white">GFG API Query</span>
                        <span className="text-[10px] text-zinc-500">auth.geeksforgeeks.org/user/demouser</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-605 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        <Check className="w-3.5 h-3.5" /> VERIFIED
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-550 border-t border-zinc-150 dark:border-white/[0.04] pt-3 px-1">
                      <span>Last Sync: 2 mins ago</span>
                      <span>Next Sync: Today 11:50 PM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2 Widget: Shared Payout */}
              {activeTab === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-white/[0.04]">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-455">Discipline Settlement</span>
                    <span className="text-[9px] font-bold text-emerald-605 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wider">
                      Yield Active
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-150 dark:border-white/[0.03] rounded-xl">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Principal Back</span>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">₹600.00</span>
                      </div>
                      <div className="p-4 bg-emerald-550/[0.01] dark:bg-emerald-500/[0.01] border border-emerald-250 dark:border-emerald-500/10 rounded-xl">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-500/60 uppercase tracking-wider block mb-0.5">Community Yield</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-450">+₹60.00</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-zinc-50 dark:bg-white/[0.005] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] flex items-center justify-center shrink-0">
                          <Swords className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">1v1 Battle Payout</span>
                          <span className="text-[9px] text-zinc-500 block">demouser vs coder22</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-450">+₹20.00</span>
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
