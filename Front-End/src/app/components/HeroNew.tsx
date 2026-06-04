import { ArrowRight, Check, Upload, Calendar, Wallet, Users, ArrowDownToLine, PlayCircle, Shield, XCircle, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroNew() {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden">
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
          <div className="relative z-20">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#13151f] border border-white/5 mb-8 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400 font-medium tracking-wide">Join early adopters building unstoppable habits</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold mb-6 leading-[1.1] tracking-tight text-white">
              Code Every Day<br />
              <span className="whitespace-nowrap">Stay Consistent</span><br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Get Paid
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
              Put your money where your mouth is.<br />
              Submit proof daily.<br />
              Succeed and earn money from those who fail.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate("/auth")}
                className="group px-8 py-4 bg-white hover:bg-slate-100 text-black font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                Start Free
                <ArrowRight className="w-5 h-5 transition-transform duration-200 animate-struggle" />
              </button>
              
              <a 
                href="https://youtu.be/bdeShmhlTlA"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Watch Demo
                <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span>AI verified submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                </div>
                <span>Earn from the failure pool</span>
              </div>
            </div>
          </div>

          {/* Right: Realistic UI Flow Mockup */}
          <div className="relative w-full mx-auto xl:mx-0 font-sans">
            {/* Dashboard Container */}
            <div className="relative bg-[#0d1017] rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-2xl border border-violet-500/20 flex items-center justify-center shadow-inner">
                    <Calendar className="w-6 h-6 text-violet-400" />
                  </div>
                  <h3 className="font-black text-white text-xl tracking-wide">Today's Proof</h3>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span>🔥</span> 3 Day Streak
                </div>
              </div>

              {/* Steps Flow (3 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                
                {/* Step 1: Upload Proof */}
                <div className="bg-[#13161f] border border-white/5 rounded-3xl p-5 flex flex-col hover:border-violet-500/30 transition-colors shadow-lg min-h-[240px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[11px] font-bold shadow-lg shadow-violet-500/20">1</div>
                    <span className="text-sm font-semibold text-white">Upload</span>
                  </div>
                  
                  {/* Code snippet mockup */}
                  <div className="w-full flex-1 bg-[#0A0C10] rounded-xl border border-white/5 mb-4 flex flex-col overflow-hidden">
                    <div className="w-full flex items-center gap-1.5 p-2 bg-[#13161f] border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-center gap-3">
                      <div className="w-3/4 h-2 bg-blue-500/60 rounded-full" />
                      <div className="w-1/2 h-2 bg-violet-400/60 rounded-full" />
                      <div className="w-5/6 h-2 bg-emerald-400/60 rounded-full" />
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors mt-auto">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                </div>

                {/* Step 2: AI Verification */}
                <div className="bg-[#13161f] border border-white/5 rounded-3xl p-5 flex flex-col hover:border-violet-500/30 transition-colors relative overflow-hidden group shadow-lg min-h-[240px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[11px] font-bold shadow-lg shadow-violet-500/20">2</div>
                      <span className="text-sm font-semibold text-white">AI Verify</span>
                    </div>
                    <div className="flex gap-0.5 items-center">
                      <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse delay-75" />
                      <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full mt-2">
                    {/* Scanning Animation Box */}
                    <div className="w-full h-20 bg-[#090a0f] rounded-xl border border-white/5 mb-5 relative overflow-hidden flex flex-col justify-center px-4 gap-3 shadow-inner">
                      {/* Fake code lines */}
                      <div className="w-3/4 h-2 bg-slate-800 rounded-full" />
                      <div className="w-full h-2 bg-slate-800 rounded-full" />
                      <div className="w-1/2 h-2 bg-slate-800 rounded-full" />
                      
                      {/* Laser scanner */}
                      <div className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent to-violet-500/20 border-b border-violet-500 shadow-[0_2px_15px_rgba(139,92,246,0.6)] animate-scan" />
                    </div>

                    <div className="flex items-center justify-center text-center w-full mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 mb-1 tracking-wider uppercase">Authenticity</span>
                        <div className="text-xl font-black text-white tracking-tight">95% Match</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Streak Protected */}
                <div className="bg-[#13161f] border border-white/5 rounded-3xl p-5 flex flex-col hover:border-violet-500/30 transition-colors relative overflow-hidden shadow-lg min-h-[240px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[11px] font-bold shadow-lg shadow-violet-500/20">3</div>
                    <span className="text-sm font-semibold text-white">Reward</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                      <Shield className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Streak Extended</div>
                    <div className="text-xl font-black text-emerald-400">3 Days 🔥</div>
                  </div>
                </div>

              </div>

              {/* Recent Activity */}
              <div className="mb-8 mt-6">
                <div className="flex items-center mb-5">
                  <h4 className="text-sm font-black text-white tracking-wide uppercase text-slate-300">Recent Activity</h4>
                </div>
                <div className="flex gap-2">
                  {[
                    { day: "Mon", date: "24", status: "success" },
                    { day: "Tue", date: "25", status: "success" },
                    { day: "Wed", date: "26", status: "success" },
                    { day: "Thu", date: "27", status: "failed" },
                    { day: "Fri", date: "28", status: "success" },
                    { day: "Sat", date: "29", status: "success" },
                    { day: "Sun", date: "30", status: "pending" }
                  ].map((item, i) => (
                    <div key={i} className={`flex-1 border rounded-2xl py-4 flex flex-col items-center justify-center gap-3 transition-colors ${
                      item.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
                      item.status === 'failed' ? 'bg-red-500/5 border-red-500/10' :
                      'bg-white/5 border-white/5'
                    }`}>
                      <div className="text-center">
                        <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">{item.day}</div>
                        <div className="text-sm text-white font-black">{item.date}</div>
                      </div>
                      <div>
                        {item.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                        {item.status === 'failed' && <XCircle className="w-5 h-5 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />}
                        {item.status === 'pending' && <Circle className="w-5 h-5 text-slate-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-4 gap-4 bg-[#13161f] border border-white/5 rounded-[2rem] p-6 shadow-lg">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Earned</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">₹450</span>
                  </div>
                </div>
                <div className="flex flex-col border-l border-white/5 pl-3">
                  <span className="text-[10px] text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Active</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">2</span>
                  </div>
                </div>
                <div className="flex flex-col border-l border-white/5 pl-3">
                  <span className="text-[10px] text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">₹150</span>
                  </div>
                </div>
                <div className="flex flex-col border-l border-white/5 pl-3">
                  <span className="text-[10px] text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Grace</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">1</span>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Background glows for the UI card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/10 blur-[120px] -z-10 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
