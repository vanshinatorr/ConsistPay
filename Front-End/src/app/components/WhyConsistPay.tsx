import { X, Check } from "lucide-react";

export function WhyConsistPay() {
  const comparisons = [
    {
      typical: "Easy to fake streaks by just clicking a button",
      consistpay: "AI verifies actual code commits and work proof",
    },
    {
      typical: "No real consequences for skipping a day",
      consistpay: "You lose real money if you break the streak",
    },
    {
      typical: "Boring virtual badges as rewards",
      consistpay: "Earn your stake back plus pool rewards",
    },
    {
      typical: "Single player mode only",
      consistpay: "Challenge friends in 1-on-1 coding battles",
    }
  ];

  return (
    <section className="px-6 py-12 md:py-0 relative overflow-hidden bg-transparent w-full">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Why ConsistPay?
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Standard habit trackers don't work. We fixed the accountability problem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Typical Apps */}
          <div className="bg-[#13151f] border border-red-500/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <h3 className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-3">
              Other Habit Apps
            </h3>
            
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-400" strokeWidth={3} />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.typical}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ConsistPay */}
          <div className="bg-gradient-to-b from-violet-900/20 to-[#13151f] border border-violet-500/20 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full" />
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              ConsistPay
            </h3>
            
            <div className="space-y-6 relative z-10">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                  </div>
                  <p className="text-slate-200 font-medium text-sm leading-relaxed">{item.consistpay}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
