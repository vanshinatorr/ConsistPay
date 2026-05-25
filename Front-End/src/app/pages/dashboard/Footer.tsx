import React from "react";
import { Link } from "react-router-dom";
import { Code2, HelpCircle, ChevronDown, Linkedin } from "lucide-react";

interface FooterProps {
  faqs: { q: string; a: string }[];
  openFaqIndex: number | null;
  setOpenFaqIndex: (index: number | null) => void;
}

export function Footer({ faqs, openFaqIndex, setOpenFaqIndex }: FooterProps) {
  return (
    <footer className="mt-16 pt-16 border-t border-white/10">
      <div className="mb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-6 h-6 text-violet-400" /> Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-400">Everything you need to know about building your coding habit.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
              <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-zinc-200">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${openFaqIndex === idx ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="p-4 pt-0 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <Link to="/dashboard" className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">ConsistPay</span>
          </Link>
          <p className="text-sm text-zinc-400 mb-6 max-w-xs">Building the 1% of developers who show up every day.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/vansh-vijay/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/in/prateekpatidar1008/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link to="/create-challenge" className="text-sm text-zinc-400 hover:text-white transition-colors">Challenges</Link></li>
            <li><Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
        <p>© 2026 ConsistPay. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built with persistence.</p>
      </div>
    </footer>
  );
}
