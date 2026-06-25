import React from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  ExternalLink,
  Instagram,
  Linkedin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 relative border-t border-white/[0.04] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.015),transparent_45%)] pointer-events-none" />


      {/* Main Footer */}
      <div className="relative max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>

              <span className="text-2xl font-semibold tracking-tight text-white">
                ConsistPay
              </span>
            </Link>

            <p className="text-sm leading-7 text-zinc-400 max-w-sm">
              Consistency backed by commitment. Built for developers who perform
              better under accountability than motivation.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-7">
              <a
                href="https://instagram.com/vansh_vj"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-white/[0.04] bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/vansh-vijay/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl border border-white/[0.04] bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white mb-6">
              Platform
            </h3>

            <div className="space-y-4">
              <Link
                to="/faq"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                FAQ
              </Link>

              <Link
                to="/pricing"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Pricing
              </Link>

              <Link
                to="/battles"
                className="block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Battles
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white mb-6">
              Support
            </h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/918529975095"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <span>Vansh <span className="text-zinc-500 text-xs ml-1">(Founder)</span></span>

                <span>+91 85299 75095</span>
              </a>

              <a
                href="https://wa.me/918103475773"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <span>Prateek <span className="text-zinc-500 text-xs ml-1">(Co-Founder)</span></span>

                <span>+91 81034 75773</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            © 2026 ConsistPay. All rights reserved.
          </p>

          <p className="text-[11px] tracking-[0.24em] uppercase text-zinc-600">
            Commit First. Motivation Later.
          </p>
        </div>
      </div>
    </footer>
  );
}