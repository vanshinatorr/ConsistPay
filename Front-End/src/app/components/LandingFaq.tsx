import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const landingFaqs = [
  {
    q: "Is my money actually safe?",
    a: "Yes. Your commitment is securely processed via Stripe. Funds are automatically refunded to your original payment method when you successfully complete your consistency challenge. We never store your card details."
  },
  {
    q: "What if I get sick or have an emergency?",
    a: "We understand life happens. Every user gets 'Grace Coins' which act as a safety net. You can use a Grace Coin to skip a day without losing your streak or your committed stake."
  },
  {
    q: "How does the AI verify my code?",
    a: "Our AI model analyzes the actual substance of your code commits, LeetCode submissions, or GitHub pushes. It looks for genuine logical progress, meaning you can't cheat by just adding comments or changing variable names."
  },
  {
    q: "How do I earn from the failure pool?",
    a: "When a user fails their consistency challenge, their stake goes into the community Failure Pool. At the end of the month, all successful users who maintained their streaks get their refund PLUS an equal distribution of the failure pool."
  },
  {
    q: "Is ConsistPay free to use?",
    a: "Yes! You can use ConsistPay as a standard habit tracker for free. The paid commitment features (where you stake money) are optional, but behavioral psychology shows financial stakes increase success rates by 80%."
  }
];

export function LandingFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden border-t border-white/5 bg-[#0A0C10]">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <HelpCircle className="w-4 h-4 text-violet-400" />
            <span className="uppercase tracking-[0.2em] text-[11px] text-violet-400 font-semibold">
              Clear your doubts
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to know before staking your first commitment.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {landingFaqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-violet-500/30 bg-violet-500/[0.02] shadow-[0_0_30px_rgba(139,92,246,0.05)]"
                    : "border-white/5 bg-[#0A0C10] hover:bg-[#13161f] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-6 text-left group"
                >
                  <span className={`font-semibold text-lg transition-colors ${isOpen ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-violet-500/10" : "bg-white/5 group-hover:bg-white/10"}`}>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6">
                      <p className="text-base leading-relaxed text-zinc-400">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
