import { Wallet, Users, BarChart3, Check } from "lucide-react";

export function MoreFeatures() {
  const features = [
    {
      icon: Wallet,
      title: "Earn While You Code",
      description: "Get back your commitment by maintaining streaks and winning challenges.",
      bullets: ["Streak rewards", "Monthly payouts", "Referral earnings (10%)"],
      color: "violet",
      badge: "Discipline Pays",
    },
    {
      icon: Users,
      title: "Friend Challenges",
      description: "Challenge your friends, compete with each other and winner takes the stake.",
      bullets: ["1-on-1 challenges", "Group battles", "Winner takes all"],
      color: "blue",
      badge: "Compete & Improve",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track your progress with detailed analytics and insights.",
      bullets: ["Consistency score", "Submission heatmap", "Performance trends"],
      color: "emerald",
      badge: "Know your growth",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "violet":
        return {
          bg: "bg-violet-500/10",
          text: "text-violet-400",
          border: "border-violet-500/20",
          badgeBg: "bg-violet-500/10 hover:bg-violet-500/20",
          glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
          iconBg: "bg-gradient-to-br from-violet-500/20 to-purple-600/20",
          checkBorder: "border-violet-500/30",
        };
      case "blue":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/20",
          badgeBg: "bg-blue-500/10 hover:bg-blue-500/20",
          glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
          iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/20",
          checkBorder: "border-blue-500/30",
        };
      case "emerald":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-400",
          border: "border-emerald-500/20",
          badgeBg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
          iconBg: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20",
          checkBorder: "border-emerald-500/30",
        };
      default:
        return {
          bg: "bg-slate-800/50",
          text: "text-slate-300",
          border: "border-white/10",
          badgeBg: "bg-slate-800/30 hover:bg-slate-800/50",
          glow: "",
          iconBg: "bg-slate-800",
          checkBorder: "border-slate-700",
        };
    }
  };

  return (
    <section className="px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            More Than Just a Streak
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Powerful features to keep you accountable and motivated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`group flex flex-col bg-[#13151f]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-500 relative overflow-hidden ${colors.glow}`}
              >
                {/* Subtle top gradient line on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${feature.color}-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${colors.iconBg} shadow-inner`}>
                    <feature.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{feature.title}</h3>
                </div>

                <p className="text-[15px] text-slate-400 mb-8 leading-relaxed relative z-10">
                  {feature.description}
                </p>

                <ul className="space-y-4 mb-10 flex-1 relative z-10">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${colors.checkBorder} ${colors.bg}`}>
                        <Check className={`w-3 h-3 ${colors.text}`} strokeWidth={3} />
                      </div>
                      <span className="text-[14px] text-slate-300 font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`relative z-10 self-start px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${colors.border} ${colors.text} ${colors.badgeBg}`}
                >
                  {feature.badge}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
