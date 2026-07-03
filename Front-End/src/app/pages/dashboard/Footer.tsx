import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps = {}) {
  return (
    <footer className={`${className !== undefined ? className : "mt-24"} relative border-t border-white/[0.04] bg-[#06080D] overflow-hidden`}>
      <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo/mascot-full.png"
                alt="ConsistPay Logo"
                className="w-8 h-8 object-contain select-none filter drop-shadow-[0_2px_8px_rgba(139,92,246,0.2)]"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                ConsistPay
              </span>
            </Link>
            
            <p className="text-xs leading-normal text-zinc-400 max-w-sm mb-6 font-normal">
              Consistency backed by commitment. Built for software developers preparing for placements who perform best under strict, verified accountability.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/vansh_vj"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-white/[0.04] bg-white/[0.02] flex items-center justify-center text-zinc-450 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/vansh-vijay/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-white/[0.04] bg-white/[0.02] flex items-center justify-center text-zinc-450 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Platform
            </h3>
            <div className="space-y-3">
              <Link to="/faq" className="block text-xs text-zinc-400 hover:text-white transition-colors">
                FAQs
              </Link>
              <Link to="/pricing" className="block text-xs text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/battles" className="block text-xs text-zinc-400 hover:text-white transition-colors">
                Battles
              </Link>
            </div>
          </div>

          {/* Support / Founders */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-4">
              Support & Contact
            </h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/918529975095"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors py-1"
              >
                <span>Vansh <span className="text-zinc-600 text-[10px] ml-1">(Founder)</span></span>
                <span className="font-mono text-zinc-550 hover:text-white">+91 85299 75095</span>
              </a>

              <a
                href="https://wa.me/918103475773"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors py-1"
              >
                <span>Prateek <span className="text-zinc-600 text-[10px] ml-1">(Co-Founder)</span></span>
                <span className="font-mono text-zinc-550 hover:text-white">+91 81034 75773</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-650 font-normal">
            © 2026 ConsistPay. All rights reserved.
          </p>
          <p className="text-[9px] tracking-widest uppercase text-zinc-600 font-bold">
            Commit First. Motivation Later.
          </p>
        </div>
      </div>
    </footer>
  );
}