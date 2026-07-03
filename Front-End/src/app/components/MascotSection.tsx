import React from "react";
import { ShieldCheck, Coins, Flame, Swords } from "lucide-react";
import { Link } from "react-router-dom";

export function MascotSection() {
  const points = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-450" />,
      title: "AI-Verified Submissions",
      desc: "Connect LeetCode or GFG. Consisty scrapes and verifies your solve progress dynamically in real-time."
    },
    {
      icon: <Coins className="w-5 h-5 text-amber-450" />,
      title: "Skin in the Game",
      desc: "Put small stakes on the line. Behavioral psychology shows financial stakes boost coding consistency by 80%."
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      title: "Earn from Slackers",
      desc: "Succeed and get your stake back, plus a slice of the rewards pool funded by developers who broke their streaks."
    },
    {
      icon: <Swords className="w-5 h-5 text-violet-400" />,
      title: "1v1 Coding Battles",
      desc: "Challenge peers, set custom stakes, and battle to see who remains consistent. Winner takes the pool."
    }
  ];

  return (
    <section className="px-6 py-16 md:py-24 relative overflow-hidden bg-transparent w-full">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Glassmorphic Panel Wrapper */}
        <div className="bg-[#12141c]/40 border border-white/[0.04] rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            
            {/* Left: Mascot & Speech Bubble */}
            <div className="flex flex-col items-center justify-center relative select-none">
              
              {/* Mascot Bubble */}
              <div className="relative mb-10 w-full max-w-md bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 shadow-lg backdrop-blur-md">
                {/* Speech Bubble Arrow */}
                <div className="absolute bottom-[-8px] left-[50%] -translate-x-1/2 w-4 h-4 bg-[#141620] border-r border-b border-white/[0.06] rotate-45" />
                
                <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block mb-1">Mascot Message</span>
                <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed font-medium">
                  "Hey! I'm Consisty. My job is to verify your commits every single day. If you succeed, you secure your stakes and pocket rewards. If you slack off, your stakes go straight to the community pool. Simple as that!"
                </p>
              </div>

              {/* Tortoise Mascot container */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center group">
                {/* Glowing ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-purple-600/10 to-transparent blur-[40px] rounded-full animate-pulse group-hover:scale-110 transition-all duration-700" />
                
                <img 
                  src="/logo/mascot-full.png" 
                  alt="ConsistPay Mascot Character" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(139,92,246,0.3)] group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500"
                />
              </div>
            </div>

            {/* Right: Pitch & points */}
            <div className="flex flex-col justify-center">
              <div className="mb-8 text-center lg:text-left">
                <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold border border-violet-500/20 mb-3 inline-block">
                  Accountability Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Meet Your New Coding Partner
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Traditional habit trackers fail because they rely on pure willpower. ConsistPay leverages positive peer pressure, verified proof, and financial accountability to ensure you show up.
                </p>
              </div>

              {/* Points grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {points.map((pt, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.05] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                      {pt.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-150 mb-1">{pt.title}</h4>
                      <p className="text-[11px] text-zinc-450 leading-relaxed">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center lg:justify-start">
                <Link 
                  to="/signup" 
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/20 active:scale-98"
                >
                  Adopt Consisty Now
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
