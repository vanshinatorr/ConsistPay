import { Link2, TrendingUp, Coins } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Link2,
      title: "Submit Proof",
      description: "Share your LeetCode or Code360 solution link daily",
      color: "violet"
    },
    {
      number: "02",
      icon: TrendingUp,
      title: "Track Streak",
      description: "Watch your consistency score grow with each submission",
      color: "emerald"
    },
    {
      number: "03",
      icon: Coins,
      title: "Earn Coins",
      description: "Retain virtual coins and unlock milestone rewards",
      color: "amber"
    }
  ];

  const getGradient = (color: string) => {
    if (color === "violet") return "from-violet-500 to-purple-600";
    if (color === "emerald") return "from-emerald-500 to-teal-600";
    return "from-amber-500 to-orange-600";
  };

  const getGlowColor = (color: string) => {
    if (color === "violet") return "rgba(139, 92, 246, 0.3)";
    if (color === "emerald") return "rgba(16, 185, 129, 0.3)";
    return "rgba(245, 158, 11, 0.3)";
  };

  return (
    <section className="px-6 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-zinc-400">Three simple steps to building an unbreakable habit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0" />
              )}

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group">
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>

                {/* Icon with glow */}
                <div className="relative mb-6 inline-block">
                  <div 
                    className="absolute inset-0 blur-2xl rounded-full"
                    style={{ backgroundColor: getGlowColor(step.color) }}
                  />
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(step.color)} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.description}</p>

                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(step.color)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
