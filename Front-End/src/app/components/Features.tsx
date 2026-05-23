import { Code2, Flame, Users, Trophy, Shield, Target } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Code2,
      title: "Daily Coding Tasks",
      description: "One problem per day. Track with proof-based validation.",
      gradient: "from-violet-500 to-purple-600",
      size: "large"
    },
    {
      icon: Flame,
      title: "Streak & Coins System",
      description: "Build streaks, earn virtual coins, stay motivated.",
      gradient: "from-orange-500 to-red-600",
      size: "medium"
    },
    {
      icon: Shield,
      title: "Grace Coins",
      description: "Second chances at milestone streaks.",
      gradient: "from-amber-500 to-yellow-600",
      size: "small"
    },
    {
      icon: Users,
      title: "Friend Challenges",
      description: "Compete in 7 or 10-day coding duels.",
      gradient: "from-blue-500 to-cyan-600",
      size: "medium"
    },
    {
      icon: Trophy,
      title: "Global Leaderboard",
      description: "Rank by consistency score and streaks.",
      gradient: "from-emerald-500 to-teal-600",
      size: "small"
    },
    {
      icon: Target,
      title: "Analytics Dashboard",
      description: "Track completion rate and habit patterns.",
      gradient: "from-pink-500 to-rose-600",
      size: "large"
    }
  ];

  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              stay consistent
            </span>
          </h2>
          <p className="text-xl text-zinc-400">Powerful features designed for developers who commit.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          {features.map((feature, index) => {
            const getGridClass = () => {
              if (feature.size === 'large') return 'md:col-span-2';
              if (feature.size === 'medium') return 'md:col-span-1';
              return 'md:col-span-1';
            };

            return (
              <div
                key={index}
                className={`group relative ${getGridClass()} p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Gradient glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 blur-3xl`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
