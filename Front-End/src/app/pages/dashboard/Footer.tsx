import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps = {}) {
  return (
    <footer className={`${className !== undefined ? className : "mt-6"} relative border-t border-zinc-200 dark:border-white/[0.04] bg-white dark:bg-[#06080D] overflow-hidden`}>
      <div className="relative max-w-6xl mx-auto px-6 py-4 md:py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2.5 mb-2.5">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-5 w-auto object-contain select-none"
              />
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
            </Link>
            
            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-sm mb-3.5 font-normal">
              Consistency backed by commitment. Built for software developers preparing for placements who perform best under strict, verified accountability.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/vansh_vj"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/[0.04] bg-zinc-55 dark:bg-white/[0.02] flex items-center justify-center text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.linkedin.com/in/vansh-vijay/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/[0.04] bg-zinc-55 dark:bg-white/[0.02] flex items-center justify-center text-zinc-500 dark:text-zinc-450 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
              Platform
            </h3>
            <div className="space-y-2">
              <Link to="/faq" className="block text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                FAQs
              </Link>
              <Link to="/pricing" className="block text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/battles" className="block text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                Battles
              </Link>
            </div>
          </div>

          {/* Support / Founders */}
          <div className="flex flex-col items-start">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 mb-2.5">
              Support & Contact
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3 font-normal max-w-xs">
              Have questions? Connect directly with support or chat with the founder on WhatsApp for instant assistance.
            </p>
            <a
              href="https://wa.me/918529975095"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-700 dark:text-emerald-450 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-md shadow-emerald-500/5 hover:scale-[1.01]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-5 pt-3.5 border-t border-zinc-200 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-650 font-normal">
            © 2026 ConsistPay. All rights reserved.
          </p>
          <p className="text-[9px] tracking-widest uppercase text-zinc-400 dark:text-zinc-600 font-bold">
            Commit First. Motivation Later.
          </p>
        </div>
      </div>
    </footer>
  );
}