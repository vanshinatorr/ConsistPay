import { UserPlus, CreditCard, Wallet, Link2, Flame, BadgeIndianRupee } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Sign Up Free",
      description:
        "Create your account in seconds. No credit card needed to get started — just your email and password.",
      color: "violet",
    },
    {
      number: "02",
      icon: CreditCard,
      title: "Pick Your Plan",
      description:
        "Choose Free (₹5–₹10/day) or Pro (₹5–₹50/day). Pro unlocks friend challenges, extra grace coins & advanced analytics.",
      color: "purple",
    },
    {
      number: "03",
      icon: Wallet,
      title: "Deposit & Commit",
      description:
        "Make a one-time monthly deposit (₹150–₹1500). This is 100% refundable — it's your accountability stake, not a fee.",
      color: "blue",
    },
    {
      number: "04",
      icon: Link2,
      title: "Solve & Submit Daily",
      description:
        "Solve one coding problem on LeetCode, GFG, Code360, or any platform. Paste the solution link before midnight.",
      color: "emerald",
    },
    {
      number: "05",
      icon: Flame,
      title: "Streak or Deduct",
      description:
        "Submit on time? Streak grows & money is safe. Miss a day? Your daily amount gets deducted. Grace coins can save you once.",
      color: "orange",
    },
    {
      number: "06",
      icon: BadgeIndianRupee,
      title: "Get Your Money Back",
      description:
        "Complete the month consistently and get your full deposit refunded. Stay disciplined — your wallet rewards you.",
      color: "amber",
    },
  ];

  const getGradient = (color: string) => {
    const map: Record<string, string> = {
      violet: "from-violet-500 to-purple-600",
      purple: "from-purple-500 to-fuchsia-600",
      blue: "from-blue-500 to-cyan-600",
      emerald: "from-emerald-500 to-teal-600",
      orange: "from-orange-500 to-red-600",
      amber: "from-amber-500 to-yellow-600",
    };
    return map[color] || "from-violet-500 to-purple-600";
  };

  const getGlowColor = (color: string) => {
    const map: Record<string, string> = {
      violet: "rgba(139, 92, 246, 0.3)",
      purple: "rgba(168, 85, 247, 0.3)",
      blue: "rgba(59, 130, 246, 0.3)",
      emerald: "rgba(16, 185, 129, 0.3)",
      orange: "rgba(249, 115, 22, 0.3)",
      amber: "rgba(245, 158, 11, 0.3)",
    };
    return map[color] || "rgba(139, 92, 246, 0.3)";
  };

  const getBorderHover = (color: string) => {
    const map: Record<string, string> = {
      violet: "hover:border-violet-500/30",
      purple: "hover:border-purple-500/30",
      blue: "hover:border-blue-500/30",
      emerald: "hover:border-emerald-500/30",
      orange: "hover:border-orange-500/30",
      amber: "hover:border-amber-500/30",
    };
    return map[color] || "hover:border-violet-500/30";
  };

  return (
    <section id="how-it-works" className="px-6 py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <Flame className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">Your journey to consistency</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Six simple steps from sign-up to getting your full deposit back
          </p>
        </div>

        {/* Steps Grid — 3 columns x 2 rows on desktop, 2 columns on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Card */}
              <div
                className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 ${getBorderHover(step.color)} transition-all duration-300 h-full flex flex-col`}
              >
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>

                {/* Icon with glow */}
                <div className="relative mb-5 inline-block">
                  <div
                    className="absolute inset-0 blur-2xl rounded-full"
                    style={{ backgroundColor: getGlowColor(step.color) }}
                  />
                  <div
                    className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient(step.color)} flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm flex-1">
                  {step.description}
                </p>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getGradient(step.color)} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom connector line with CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
            <span className="text-sm text-zinc-400">Your money is always safe.</span>
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              100% refundable deposits.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
