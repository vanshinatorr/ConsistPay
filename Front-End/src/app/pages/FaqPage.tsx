import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Wallet,
  Swords,
  Sparkles,
  MessageCircle,
  Search,
  X,
} from "lucide-react";

// ─── FAQ DATA ──────────────────────────────────────────────
const faqSections = [
  {
    title: "Daily Submissions",
    icon: ShieldCheck,
    description: "Everything about proof verification and streak tracking.",
    faqs: [
      {
        q: "How do daily submissions work?",
        a: "Submit your coding proof before 11:59 PM using supported coding platforms like LeetCode, GitHub, Code360, or GeeksforGeeks.",
      },
      {
        q: "What counts as valid proof?",
        a: "Accepted proof includes meaningful coding activity such as solved problems, GitHub commits, debugging sessions, project work, or development progress.",
      },
      {
        q: "What happens if I miss a day?",
        a: "Missing a submission may affect your streak, secured amount, and active battles depending on your challenge configuration.",
      },
      {
        q: "Can I submit after midnight?",
        a: "No. Daily proof submissions close at 11:59 PM to maintain fairness and accountability consistency.",
      },
    ],
  },
  {
    title: "Wallet & Commitment System",
    icon: Wallet,
    description: "How deposits, protection, deductions, and payouts work.",
    faqs: [
      {
        q: "How does the commitment system work?",
        a: "Users lock a commitment amount into active consistency challenges.",
      },
      {
        q: "What does secured amount mean?",
        a: "Secured amount represents the protected portion of your committed balance.",
      },
      {
        q: "Are deposits refundable?",
        a: "Protected funds remain tied to your challenge performance and consistency cycle.",
      },
      {
        q: "What are grace coins?",
        a: "Grace coins help protect streak continuity during unavoidable misses.",
      },
    ],
  },
  {
    title: "Friend Battles",
    icon: Swords,
    description: "Competitive accountability with real stakes.",
    faqs: [
      {
        q: "How do friend battles work?",
        a: "Users can challenge friends using custom durations and stake amounts.",
      },
      {
        q: "Who wins the battle?",
        a: "Battle outcomes are determined using consistency and challenge performance.",
      },
      {
        q: "What happens if both users stay consistent?",
        a: "Tie rules and stake return conditions depend on battle configuration settings.",
      },
      {
        q: "Can grace coins be used in battles?",
        a: "Yes. Grace coins may protect streak continuity during active battles.",
      },
    ],
  },
  {
    title: "Platform & Security",
    icon: Sparkles,
    description: "Platform safety, features, and supported systems.",
    faqs: [
      {
        q: "Is ConsistPay free to use?",
        a: "ConsistPay includes both free and premium experiences.",
      },
      {
        q: "Why use financial accountability?",
        a: "Behavioral psychology shows financial commitment improves long-term consistency.",
      },
      {
        q: "Is my account secure?",
        a: "JWT authentication, secured APIs, and backend validation systems protect accounts.",
      },
      {
        q: "Which coding platforms are supported?",
        a: "LeetCode, GitHub, Code360, GeeksforGeeks, and similar development platforms.",
      },
    ],
  },
];

// ─── COMPONENT ─────────────────────────────────────────────
export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Search Filter
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return faqSections;

    const query = searchQuery.toLowerCase();

    return faqSections
      .map((section) => ({
        ...section,
        faqs: section.faqs.filter(
          (faq) =>
            faq.q.toLowerCase().includes(query) ||
            faq.a.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.faqs.length > 0);
  }, [searchQuery]);

  const totalFaqs = faqSections.reduce(
    (acc, section) => acc + section.faqs.length,
    0
  );

  const filteredCount = filteredSections.reduce(
    (acc, section) => acc + section.faqs.length,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_60%)]" />
      </div>

      {/* HERO */}
      <div className="relative border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <HelpCircle className="w-4 h-4 text-violet-400" />

            <span className="uppercase tracking-[0.2em] text-[11px] text-violet-400 font-semibold">
              Support & Clarity
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Questions Before
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              You Commit?
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Everything about streaks, proof submissions, battles, wallet
            protection, and accountability systems inside ConsistPay.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-11 py-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500/50 transition-all duration-300"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-xs text-zinc-500 mt-3 text-left pl-1">
                Showing {filteredCount} of {totalFaqs} questions
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative max-w-4xl mx-auto px-6 py-16 space-y-20">
        {filteredSections.map((section, sectionIndex) => {
          const Icon = section.icon;

          return (
            <div key={sectionIndex}>
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {section.title}
                  </h2>

                  <p className="text-sm text-zinc-500">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Accordion */}
              <div className="space-y-3">
                {section.faqs.map((faq, faqIndex) => {
                  const faqId = `${sectionIndex}-${faqIndex}`;
                  const isOpen = openFaq === faqId;

                  return (
                    <div
                      key={faqId}
                      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? "border-violet-500/30 bg-white/[0.04]"
                          : "border-white/[0.08] bg-white/[0.02]"
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faqId)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left"
                      >
                        <span className="font-medium text-zinc-200 pr-5">
                          {faq.q}
                        </span>

                        <ChevronDown
                          className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px w-full bg-white/[0.06] mb-5" />

                          <p className="text-sm leading-7 text-zinc-400">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* STILL NEED HELP */}
        <div>
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="max-w-2xl mb-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-violet-400" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Still Need Help?
                    </h3>

                    <p className="text-sm text-zinc-500 mt-1">
                      Questions about support, streaks, battles, subscriptions,
                      or platform issues.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Support Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-violet-400" />
                    </div>

                    <div>
                      <p className="text-base font-semibold text-white">
                        Support & Assistance
                      </p>

                      <p className="text-sm text-zinc-500">
                        Usually replies within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-1">
                        Email Support
                      </p>

                      <p className="text-sm text-white font-medium">
                        support@consistpay.com
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-1">
                        Platform Focus
                      </p>

                      <p className="text-sm text-zinc-300 leading-relaxed">
                        Accountability systems, coding consistency, AI proof
                        verification, and competitive streak tracking.
                      </p>
                    </div>

                    <button className="w-full h-12 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all duration-300">
                      Contact Support
                    </button>
                  </div>
                </div>

                {/* About */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <p className="text-base font-semibold text-white">
                        About ConsistPay
                      </p>

                      <p className="text-sm text-zinc-500">
                        Built for serious consistency
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-zinc-400 mb-6">
                    ConsistPay helps developers build long-term coding
                    consistency using accountability systems, proof-based
                    tracking, behavioral commitment, and competitive motivation.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                      <p className="text-xl font-bold text-white mb-1">
                        AI
                      </p>

                      <p className="text-xs text-zinc-500">
                        Proof verification
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                      <p className="text-xl font-bold text-white mb-1">
                        Daily
                      </p>

                      <p className="text-xs text-zinc-500">
                        Consistency tracking
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-xs text-zinc-600">
                      Built by Vansh Vijay & Prateek Patidar
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <p className="text-sm text-zinc-500 text-center leading-relaxed max-w-2xl mx-auto">
                  ConsistPay continuously evolves using developer feedback,
                  accountability psychology, and real user behavior insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}