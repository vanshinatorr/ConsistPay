import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroNew } from "../components/HeroNew";
import { SocialProof } from "../components/SocialProof";
import { HowItWorks } from "../components/HowItWorks";
import { MascotSection } from "../components/MascotSection";
import { Footer } from "./dashboard/Footer";

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="text-slate-100 bg-[#06080D] relative w-full overflow-x-hidden min-h-screen font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#06080D]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo/mascot-full.png"
                alt="ConsistPay Logo"
                className="w-9 h-9 object-contain select-none filter drop-shadow-[0_2px_8px_rgba(139,92,246,0.2)]"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                ConsistPay
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
                How It Works
              </a>
              <Link to="/pricing" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
                Pricing
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-violet-650 hover:bg-violet-600 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98]">
                Start Free
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

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-[#0A0C10] border border-white/[0.06] rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-50 transition-all">
                <div className="flex flex-col gap-4">
                  <a 
                    href="#how-it-works" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-zinc-300 hover:text-white py-2 flex items-center justify-between border-b border-white/[0.04]"
                  >
                    <span>How It Works</span>
                  </a>
                  <Link 
                    to="/pricing" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-zinc-300 hover:text-white py-2 flex items-center justify-between border-b border-white/[0.04]"
                  >
                    <span>Pricing</span>
                  </Link>
                  <div className="pt-4 flex flex-col gap-3">
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-xs font-bold text-zinc-300 hover:text-white rounded-xl border border-white/5 bg-white/[0.01] active:scale-95 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-xs font-bold bg-violet-600 text-white rounded-xl active:scale-95 transition-all"
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

      {/* Main Content Layout */}
      <main className="w-full pt-20">
        
        {/* Section 1: Hero (Pure Black bg) */}
        <HeroNew />

        {/* Section 2: Mascot Philosophy & Contrast (Dark Purple bg) */}
        <MascotSection />

        {/* Section 3: Interactive Product Showcase (Pure Black bg) */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* Section 4: Verified Proof Stats (Dark Purple bg) */}
        <SocialProof />

        {/* Section 5: Pre-Footer CTA (Pure Black bg) */}
        <div className="py-20 md:py-28 relative overflow-hidden bg-[#06080D] border-b border-white/[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.03),transparent_60%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-white">
              Ready to Lock in Your Daily Discipline?
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Adopt Consisty, connect your platforms, set your stakes, and start building placement-ready coding habits today.
            </p>
            <Link to="/signup" className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-zinc-100 font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]">
              Start Your Journey Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <Footer className="mt-0" />
      </main>
    </div>
  );
}