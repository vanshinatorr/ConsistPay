import { Code2, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HeroNew } from "../components/HeroNew";
import { SocialProof } from "../components/SocialProof";
import { MoreFeatures } from "../components/MoreFeatures";
import { HowItWorks } from "../components/HowItWorks";
import { WhyConsistPay } from "../components/WhyConsistPay";
import { Footer } from "./dashboard/Footer";

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-100 bg-[#06080D] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2" />
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20" />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0C10]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
                How It Works
              </a>
       <Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
           Pricing
          </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="group relative px-5 py-2.5 bg-white text-black font-semibold rounded-lg text-sm transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Start Free
                <div className="absolute inset-0 rounded-lg ring-2 ring-white/50 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Backdrop and Drawer */}
          {mobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-[#0C0E14]/95 border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-5">
                <div className="flex flex-col gap-4">
                  <a 
                    href="#features" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors py-2 flex items-center justify-between border-b border-white/[0.04]"
                  >
                    <span>Features</span>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-500">Explore</span>
                  </a>
                  <a 
                    href="#how-it-works" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors py-2 flex items-center justify-between border-b border-white/[0.04]"
                  >
                    <span>How It Works</span>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-500">Guide</span>
                  </a>
                  <Link 
                    to="/pricing" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors py-2 flex items-center justify-between border-b border-white/[0.04]"
                  >
                    <span>Pricing</span>
                    <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-bold">Pro</span>
                  </Link>
                  <div className="pt-4 flex flex-col gap-3">
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-semibold text-zinc-350 hover:text-white rounded-xl border border-white/5 bg-white/[0.01] active:scale-95 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-bold bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl active:scale-95 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                    >
                      Start Free
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <HeroNew />
        <div className="hidden md:block">
          <SocialProof />
        </div>
        <div className="hidden md:block">
          <WhyConsistPay />
        </div>
        <HowItWorks />
        <div className="hidden md:block">
          <MoreFeatures />
        </div>
      </main>

      {/* Pre-Footer CTA */}
      <section className="py-24 relative overflow-hidden border-t border-white/5 hidden md:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-[#06080D] to-[#06080D] opacity-100" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 tracking-tight">
            Ready to build unstoppable habits?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the developers who have committed to consistency and transformed their skills. Stop breaking promises to yourself.
          </p>
          <Link to="/signup" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-slate-100 font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105">
            Start Your Journey Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}