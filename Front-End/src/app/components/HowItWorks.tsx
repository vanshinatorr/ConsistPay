import { UserPlus, CreditCard, Wallet, Link2, Flame, BadgeIndianRupee } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Sign Up Free",
      description: "Create your account in seconds. No credit card needed to get started — just your email.",
      color: "violet",
      emphasis: false,
    },
    {
      number: "02",
      icon: CreditCard,
      title: "Pick Your Plan",
      description: "Choose Free (₹5–₹10/day) or Pro (₹5–₹50/day) for advanced analytics & friend challenges.",
      color: "purple",
      emphasis: false,
    },
    {
      number: "03",
      icon: Wallet,
      title: "Deposit & Commit",
      description: "Make a 100% refundable monthly deposit. This is your accountability stake, not a fee.",
      color: "blue",
      emphasis: true, // Primary action
    },
    {
      number: "04",
      icon: Link2,
      title: "Solve & Submit Daily",
      description: "Solve one coding problem and paste the solution link before midnight.",
      color: "emerald",
      emphasis: true, // Primary action
    },
    {
      number: "05",
      icon: Flame,
      title: "Streak or Deduct",
      description: "Submit on time? Streak grows. Miss a day? Daily amount is deducted. Grace coins can save you.",
      color: "orange",
      emphasis: false,
    },
    {
      number: "06",
      icon: BadgeIndianRupee,
      title: "The Payout: Refund + Profit",
      description: "Stay disciplined all month. Not only do you get your full deposit refunded, but you also take a cut from the pool of lazy coders who missed their daily goal.",
      color: "amber",
      emphasis: true, // Emotional peak
    },
  ];

  const getColorTheme = (emphasis: boolean) => {
    if (emphasis) {
      return { bg: 'bg-violet-500/10 border border-violet-500/20', text: 'text-violet-400' };
    }
    return { bg: 'bg-slate-800/50 border border-white/5', text: 'text-slate-400' };
  };

  return (
    <section id="how-it-works" className="px-6 py-32 relative overflow-hidden bg-[#0A0C10]">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#13151f] border border-white/5 mb-6 shadow-xl">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-400 font-bold tracking-wide uppercase">The Engine</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight">
            How ConsistPay Works
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Not just another habit tracker. An entire ecosystem designed to make failure more painful than discipline.
          </p>
        </div>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          
          {/* Box 1: Sign Up (Small) */}
          <div className="col-span-1 bg-[#13151f]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between group hover:bg-[#1a1d27] transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <UserPlus className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-5xl font-black text-white/5">01</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{steps[0].title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{steps[0].description}</p>
            </div>
          </div>

          {/* Box 2: Pick Plan (Small) */}
          <div className="col-span-1 bg-[#13151f]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between group hover:bg-[#1a1d27] transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-5xl font-black text-white/5">02</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{steps[1].title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{steps[1].description}</p>
            </div>
          </div>

          {/* Box 3: Deposit (Wide, Important) */}
          <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-violet-900/30 to-[#13151f]/80 backdrop-blur-xl border border-violet-500/20 rounded-[2rem] p-8 flex flex-col justify-between group hover:border-violet-500/40 transition-all hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Wallet className="w-6 h-6 text-violet-400" />
              </div>
              <span className="text-5xl font-black text-violet-500/10">03</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{steps[2].title}</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">{steps[2].description}</p>
            </div>
          </div>

          {/* Box 4: Solve Daily */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-900/20 to-[#13151f]/80 backdrop-blur-xl border border-blue-500/20 rounded-[2rem] p-8 flex flex-col justify-between group hover:border-blue-500/40 transition-all relative overflow-hidden shadow-2xl shadow-black/50">
            {/* Ambient code background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden text-[8px] font-mono leading-none break-all text-white">
              {`function verifyProof(code) { if (!code) return false; return true; } const engine = new Engine(); engine.start(); verifyProof(code); function verifyProof(code) { if (!code) return false; return true; } const engine = new Engine(); engine.start();`}
              {`function verifyProof(code) { if (!code) return false; return true; } const engine = new Engine(); engine.start(); verifyProof(code); function verifyProof(code) { if (!code) return false; return true; } const engine = new Engine(); engine.start();`}
              {`function verifyProof(code) { if (!code) return false; return true; } const engine = new Engine(); engine.start(); verifyProof(code); function verifyProof(code) { if (!code) return false; return true; } const engine = new Engine(); engine.start();`}
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                <Link2 className="w-8 h-8 text-blue-400" />
              </div>
              <span className="text-5xl font-black text-blue-500/10">04</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{steps[3].title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-lg">{steps[3].description}</p>
            </div>
          </div>

          {/* Box 5: Streak (Small) */}
          <div className="col-span-1 bg-[#13151f]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between group hover:bg-[#1a1d27] transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-5xl font-black text-white/5">05</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{steps[4].title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{steps[4].description}</p>
            </div>
          </div>

          {/* Box 6: Reward (Wide Footer-ish) */}
          <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-emerald-900/30 via-[#13151f] to-[#13151f] border border-emerald-500/20 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 group hover:border-emerald-500/40 transition-all relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -translate-y-1/2 rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-6 relative z-10 shrink-0">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <BadgeIndianRupee className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.15em] mb-1.5 block">Phase 06 — The Payout</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">{steps[5].title}</h3>
              </div>
            </div>

            <div className="relative z-10 md:max-w-lg shrink">
              <p className="text-sm text-slate-300 font-medium leading-relaxed text-balance">
                {steps[5].description}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
