import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export function CTASection() {
  const [email, setEmail] = useState("");

  return (
    <section className="px-6 py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-emerald-500/20 blur-3xl" />
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-emerald-500/20 border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold">Limited Time: Free Forever Plan</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to build{" "}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                the habit?
              </span>
            </h2>

            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join thousands of developers who've transformed their coding consistency. 
              Start your first streak today.
            </p>

            {/* Email form */}
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-white placeholder:text-zinc-500 text-base"
                />
                <button className="group px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <p className="text-xs text-zinc-500 mt-4">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-emerald-500">✓</span>
                </div>
                <span>12,400+ active users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-emerald-500">✓</span>
                </div>
                <span>98% consistency rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-emerald-500">✓</span>
                </div>
                <span>5,000+ challenges</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
      `}</style>
    </section>
  );
}
