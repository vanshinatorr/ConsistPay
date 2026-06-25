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

          {/* Right: Realistic UI Flow Mockup */}
          <div className="hidden xl:block relative w-full mx-auto xl:mx-0 font-sans">
            {/* Dashboard Container */}
            <div className="relative bg-[#0b0c10] rounded-[2rem] p-4 sm:p-8 border border-zinc-800/80 shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-violet-500/10 rounded-xl border border-violet-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-violet-450" />
                  </div>
                  <h3 className="font-semibold text-zinc-100 text-lg sm:text-xl tracking-tight">Today's Proof</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 3 Day Streak
                </div>
              </div>
 
              {/* Steps Flow (3 Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                
                {/* Step 1: Upload Proof */}
                <div className="bg-[#12141c] border border-white/[0.04] rounded-3xl p-5 flex flex-col hover:border-violet-500/20 transition-colors shadow-lg min-h-[220px] sm:min-h-[240px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5.5 h-5.5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-semibold">1</div>
                    <span className="text-sm font-semibold text-zinc-200">Upload</span>
                  </div>
                  
                  {/* Code snippet mockup */}
                  <div className="w-full flex-1 bg-[#090a0e] rounded-xl border border-white/[0.04] mb-4 flex flex-col overflow-hidden">
                    <div className="w-full flex items-center gap-1.5 p-2 bg-[#12141c] border-b border-white/[0.04]">
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-center gap-3">
                      <div className="w-3/4 h-1.5 bg-blue-500/40 rounded-full" />
                      <div className="w-1/2 h-1.5 bg-violet-400/40 rounded-full" />
                      <div className="w-5/6 h-1.5 bg-emerald-400/40 rounded-full" />
                    </div>
                  </div>
                  
                  <button className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-colors mt-auto">
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                </div>
 
                {/* Step 2: AI Verification */}
                <div className="bg-[#12141c] border border-white/[0.04] rounded-3xl p-5 flex flex-col hover:border-violet-500/20 transition-colors relative overflow-hidden group shadow-lg min-h-[220px] sm:min-h-[240px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-semibold">2</div>
                      <span className="text-sm font-semibold text-zinc-200">AI Verify</span>
                    </div>
                    <div className="flex gap-0.5 items-center">
                      <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full mt-2">
                    {/* Scanning Animation Box */}
                    <div className="w-full h-20 bg-[#090a0f] rounded-xl border border-white/[0.04] mb-5 relative overflow-hidden flex flex-col justify-center px-4 gap-3 shadow-inner">
                      {/* Fake code lines */}
                      <div className="w-3/4 h-1.5 bg-zinc-800 rounded-full" />
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full" />
                      <div className="w-1/2 h-1.5 bg-zinc-800 rounded-full" />
                      
                      {/* Laser scanner */}
                      <div className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent to-violet-500/10 border-b border-violet-500/60 shadow-[0_2px_15px_rgba(139,92,246,0.3)] animate-scan" />
                    </div>
 
                    <div className="flex items-center justify-center text-center w-full mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-500 mb-1 tracking-wider uppercase font-semibold">Authenticity</span>
                        <div className="text-lg font-bold text-zinc-100 tracking-tight">95% Match</div>
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Step 3: Streak Protected */}
                <div className="bg-[#12141c] border border-white/[0.04] rounded-3xl p-5 flex flex-col hover:border-violet-500/20 transition-colors relative overflow-hidden shadow-lg min-h-[220px] sm:min-h-[240px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <div className="w-5.5 h-5.5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-semibold">3</div>
                    <span className="text-sm font-semibold text-zinc-200">Reward</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
                    </div>
                    <div className="text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">Streak Extended</div>
                    <div className="text-lg font-bold text-emerald-400">3 Days</div>
                  </div>
                </div>
 
              </div>
 
              {/* Recent Activity */}
              <div className="mb-8 mt-6">
                <div className="flex items-center mb-5">
                  <h4 className="text-xs font-semibold text-zinc-550 tracking-wider uppercase">Recent Activity</h4>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
                  {[
                    { day: "Mon", date: "24", status: "success" },
                    { day: "Tue", date: "25", status: "success" },
                    { day: "Wed", date: "26", status: "success" },
                    { day: "Thu", date: "27", status: "failed" },
                    { day: "Fri", date: "28", status: "success" },
                    { day: "Sat", date: "29", status: "success" },
                    { day: "Sun", date: "30", status: "pending" }
                  ].map((item, i) => (
                    <div key={i} className={`flex-1 min-w-[56px] sm:min-w-0 border rounded-2xl py-4 flex flex-col items-center justify-center gap-3 transition-colors ${
                      item.status === 'success' ? 'bg-emerald-500/[0.02] border-emerald-500/10' :
                      item.status === 'failed' ? 'bg-red-500/[0.02] border-red-500/10' :
                      'bg-white/[0.02] border-white/[0.04]'
                    }`}>
                      <div className="text-center">
                        <div className="text-[9px] text-zinc-500 font-semibold mb-1 uppercase tracking-widest">{item.day}</div>
                        <div className="text-xs text-zinc-150 font-bold">{item.date}</div>
                      </div>
                      <div className="flex justify-center items-center">
                        {item.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {item.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                        {item.status === 'pending' && <Circle className="w-4 h-4 text-zinc-700" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Stats Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#12141c] border border-white/[0.04] rounded-2xl p-4 sm:p-5 shadow-lg">
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Earned</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">₹450</span>
                  </div>
                </div>
                <div className="flex flex-col sm:border-l sm:border-white/[0.04] sm:pl-3">
                  <span className="text-[9px] text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Active</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">2</span>
                  </div>
                </div>
                <div className="flex flex-col border-t border-white/[0.04] pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.04] sm:pl-3">
                  <span className="text-[9px] text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">₹150</span>
                  </div>
                </div>
                <div className="flex flex-col border-t border-white/[0.04] pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.04] sm:pl-3">
                  <span className="text-[9px] text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Grace</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">1</span>
                  </div>
                </div>
              </div>
 
            </div>
            
            {/* Background glows for the UI card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
