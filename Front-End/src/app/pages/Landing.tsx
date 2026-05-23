import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HeroNew } from "../components/HeroNew";
import { SocialProof } from "../components/SocialProof";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { LeaderboardPreview } from "../components/LeaderboardPreview";
import { CTASection } from "../components/CTASection";

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0D0D0F' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
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
              <a href="#leaderboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Leaderboard
              </a>
       <Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
           Pricing
          </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-5 py-2.5 text-sm text-zinc-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg text-sm transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50">
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-[#0D0D0F]/95 backdrop-blur-xl border-b border-white/10 py-6 px-6">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                  How It Works
                </a>
                <a href="#leaderboard" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                  Leaderboard
                </a>
           <Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors py-2">
                  Pricing
               </Link>
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <Link to="/login" className="px-5 py-2.5 text-sm text-zinc-300 hover:text-white transition-colors text-left">
                    Sign In
                  </Link>
                  <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-lg text-sm">
                    Start Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <HeroNew />
        <SocialProof />
        <Features />
        <HowItWorks />
        <LeaderboardPreview />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold">ConsistPay</span>
              </div>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                The premium coding habit tracker designed for developers who commit.
              </p>
              <p className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Stay Disciplined.
              </p>
            </div>

            {/* Product Links */}

{/* Product Links */}
<div>
  <h4 className="font-semibold mb-4 text-sm text-zinc-300">Product</h4>
  <ul className="space-y-3">
    {["Features", "Roadmap", "Changelog", "API"].map((item) => (
      <li key={item}>
        <a href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
          {item}
        </a>
      </li>
    ))}
    <li>
      <Link to="/pricing" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
        Pricing
      </Link>
    </li>
  </ul>
</div>


            {/* Resources Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-zinc-300">Resources</h4>
              <ul className="space-y-3">
                {["Documentation", "Guides", "Community", "Blog", "Support"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm text-zinc-300">Company</h4>
              <ul className="space-y-3">
                {["About", "Careers", "Privacy", "Terms", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © 2026 ConsistPay. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              {["GitHub", "Twitter", "Discord", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-violet-500/50 transition-all group"
                >
                  <span className="text-xs text-zinc-500 group-hover:text-violet-400 transition-colors">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}