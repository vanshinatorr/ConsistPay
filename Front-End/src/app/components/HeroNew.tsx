import { ArrowRight, Check } from "lucide-react";

export function HeroNew() {
  // Mock app UI data
  const currentStreak = 47;
  const coinBalance = 235;
  
  // Calendar data - 7 weeks x 7 days
  const calendarDays = Array.from({ length: 49 }, (_, i) => {
    const random = Math.random();
    if (i > 42) return 'future'; // Future days
    if (random > 0.85) return 'missed'; // 15% missed
    return 'completed'; // 85% completed
  });

  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Code motif */}
        <div className="absolute top-40 right-20 text-violet-500/10 font-mono text-sm hidden lg:block">
          <pre>{`{
  "streak": ${currentStreak},
  "status": "active"
}`}</pre>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-white/10 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-zinc-300">Join 12,400+ developers building streaks</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
              Code Every Day.{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Own Your Streak.
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-xl">
              The habit tracker that turns your commitment into a game. 
              Submit proof daily, build streaks, compete with friends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] hover:-translate-y-0.5">
                <span className="flex items-center gap-2">
                  Start Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-10 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Free forever</span>
              </div>
            </div>
          </div>

          {/* Right: Floating App Mockup */}
          <div className="relative">
            {/* Glassmorphism card */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Top stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/30">
                  <div className="text-sm text-zinc-400 mb-1">Current Streak</div>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    🔥 {currentStreak}
                    <span className="text-sm text-zinc-500">days</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-500/30">
                  <div className="text-sm text-zinc-400 mb-1">Coin Balance</div>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    🪙 {coinBalance}
                    <span className="text-sm text-zinc-500">coins</span>
                  </div>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="p-6 rounded-2xl bg-black/20 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">March 2026</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-emerald-500" />
                      Done
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-red-500" />
                      Missed
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-sm bg-white/10" />
                      Future
                    </div>
                  </div>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs text-zinc-500 font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((status, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg border transition-all ${
                        status === 'completed' 
                          ? 'bg-emerald-500/30 border-emerald-500/50 hover:bg-emerald-500/40' 
                          : status === 'missed'
                          ? 'bg-red-500/20 border-red-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/50 text-sm font-bold text-white">
                98% Consistency
              </div>

              {/* Glow effects */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/30 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
