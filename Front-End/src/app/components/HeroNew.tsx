import { ArrowRight, Check, Upload, Calendar, Wallet, Users, ArrowDownToLine, PlayCircle, Shield, XCircle, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroNew() {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 py-24 md:py-0 overflow-hidden w-full">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(300%); }
          100% { transform: translateY(-100%); }
        }
        .animate-scan {
          animation: scanline 2.5s ease-in-out infinite;
        }
        @keyframes struggle {
          0%, 100% { transform: translateX(4px); }
          50% { transform: translateX(8px); }
        }
        .group:hover .animate-struggle {
          animation: struggle 1s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-16 items-center">
          {/* Left: Text Content */}
          <div className="relative z-20 flex flex-col items-center text-center xl:items-start xl:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12141c] border border-white/[0.05] mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-zinc-400 font-medium tracking-wide">Join early adopters building unstoppable habits</span>
            </div>
 
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.2rem] font-bold mb-6 leading-[1.1] tracking-tight text-white">
              Code Every Day<br />
              <span className="sm:whitespace-nowrap">Stay Consistent</span><br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Get Paid
              </span>
            </h1>
 
            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed max-w-lg font-normal">
              Put your money where your mouth is. Submit proof daily. Succeed and earn consistency rewards from those who break their promises.
            </p>
 
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate("/auth")}
                className="group px-7 py-3.5 bg-white hover:bg-zinc-100 text-black font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-white/5 active:scale-[0.98]"
              >
                Start Free
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-200 animate-struggle" />
              </button>
              
              <a 
                href="https://youtu.be/bdeShmhlTlA"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3.5 bg-white/[0.03] hover:bg-white/[0.07] text-white font-semibold rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Watch Demo
                <PlayCircle className="w-4.5 h-4.5 text-zinc-400 group-hover:text-white transition-colors" />
              </a>
            </div>
 
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400 font-medium justify-center xl:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span>AI verified submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span>Earn from the failure pool</span>
              </div>
            </div>
          </div>

          {/* Right: Mascot Character Visual */}
          <div className="hidden xl:flex items-center justify-center relative w-full mx-auto xl:mx-0">
            <div className="relative w-[480px] h-[480px] flex items-center justify-center">
              {/* Premium Background Glows */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/25 via-purple-600/15 to-transparent blur-[80px] rounded-full animate-pulse" />
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-[100px] rounded-full" />
              
              {/* Mascot Image */}
              <img 
                src="/logo/mascot-full.png" 
                alt="ConsistPay Mascot" 
                className="w-full h-full object-contain relative z-10 select-none drop-shadow-[0_20px_50px_rgba(139,92,246,0.35)] hover:scale-[1.03] hover:-rotate-1 transition-all duration-700 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
