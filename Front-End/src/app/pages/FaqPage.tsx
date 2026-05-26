import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Wallet,
  Swords,
  Sparkles,
  MessageCircle,
  Phone,
  Instagram,
  ExternalLink,
  Search,
  X,
  Copy,
  Check,
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
        a: "Submit your coding proof before 11:59 PM using supported coding platforms like LeetCode, GitHub, Code360, or GeeksforGeeks. Verified submissions automatically update your streak and protected amount.",
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
        a: "Users lock a commitment amount into active consistency challenges. Successful daily proof protects the committed amount while missed days may trigger deductions.",
      },
      {
        q: "What does secured amount mean?",
        a: "Secured amount represents the portion of your committed balance protected through successful consistency.",
      },
      {
        q: "Are deposits refundable?",
        a: "Protected funds remain tied to your challenge performance and consistency cycle.",
      },
      {
        q: "What are grace coins?",
        a: "Grace coins help protect streak continuity during unavoidable misses based on your available balance and challenge rules.",
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
        a: "Users can challenge friends using custom durations and stake amounts while competing through daily coding consistency.",
      },
      {
        q: "Who wins the battle?",
        a: "Battle outcomes are determined using streak consistency, proof submissions, missed days, and overall challenge performance.",
      },
      {
        q: "What happens if both users stay consistent?",
        a: "Tie rules and stake return conditions depend on battle configuration settings.",
      },
      {
        q: "Can grace coins be used in battles?",
        a: "Yes. Grace coins may protect streak continuity during active battles depending on challenge conditions.",
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
        a: "ConsistPay includes both free and premium experiences with advanced accountability systems and battle features available in Pro.",
      },
      {
        q: "Why use financial accountability?",
        a: "Behavioral psychology shows that financial commitment and social pressure significantly improve long-term consistency.",
      },
      {
        q: "Is my account secure?",
        a: "JWT authentication, protected APIs, secured routes, and backend validation systems are used to protect user accounts.",
      },
      {
        q: "Which coding platforms are supported?",
        a: "Proof submissions are supported from platforms like LeetCode, GitHub, Code360, GeeksforGeeks, and similar development platforms.",
      },
    ],
  },
];

// ─── COMPONENT ─────────────────────────────────────────────
export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleCopy = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch {
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    }
  };

  // Search filter
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

  const totalFaqs = faqSections.reduce((acc, s) => acc + s.faqs.length, 0);
  const filteredCount = filteredSections.reduce(
    (acc, s) => acc + s.faqs.length,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ─── BACKGROUND GLOWS ─── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="absolute top-[60%] right-0 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(236,72,153,0.04),transparent_60%)]" />
      </div>

      {/* ─── HERO SECTION ─── */}
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
            Everything about streaks, proof submissions, wallet protection,
            grace coins, friend battles, and accountability systems inside
            ConsistPay.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-11 py-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
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

      {/* ─── FAQ SECTIONS ─── */}
      <div className="relative max-w-4xl mx-auto px-6 py-16 space-y-20">
        {filteredSections.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No questions found</p>
            <p className="text-zinc-600 text-sm mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          filteredSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <div key={sectionIndex} className="scroll-mt-24">
                {/* Section Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/5">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="pt-1">
                    <h2 className="text-2xl font-bold text-white mb-1.5">
                      {section.title}
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Accordions */}
                <div className="space-y-3">
                  {section.faqs.map((faq, faqIndex) => {
                    const faqId = `${sectionIndex}-${faqIndex}`;
                    const isOpen = openFaq === faqId;
                    return (
                      <div
                        key={faqId}
                        className={`rounded-2xl border overflow-hidden transition-all duration-500 ${
                          isOpen
                            ? "border-violet-500/30 bg-gradient-to-b from-white/[0.04] to-white/[0.02] shadow-lg shadow-violet-500/5"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]"
                        }`}
                      >
                        <button
                          onClick={() => toggleFaq(faqId)}
                          className="w-full flex items-center justify-between px-6 py-5 text-left group"
                        >
                          <span
                            className={`font-medium pr-6 transition-colors duration-300 ${
                              isOpen
                                ? "text-white"
                                : "text-zinc-300 group-hover:text-white"
                            }`}
                          >
                            {faq.q}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                              isOpen
                                ? "bg-violet-500/20 text-violet-400"
                                : "bg-white/5 text-zinc-500 group-hover:bg-white/10 group-hover:text-zinc-400"
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        <div
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${
                            isOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-6 pb-6">
                            <div className="h-px w-full bg-gradient-to-r from-violet-500/20 via-white/5 to-transparent mb-5" />
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
          })
        )}

        {/* ─── STILL NEED HELP SECTION ─── */}
        <div className="pt-8">
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Still Need Help?
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Reach out directly for support, collaborations, or
                    platform queries.
                  </p>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* WhatsApp Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-emerald-500/20 hover:bg-white/[0.03] transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-300">
                        WhatsApp Support
                      </p>
                      <p className="text-xs text-zinc-600">
                        Direct message
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/918529975095"
                    target="_blank"
                    rel="noreferrer"
                    className="block mb-3"
                  >
                    <p className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      +91 85299 75095
                    </p>
                  </a>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">
                      Usually replies within a few hours
                    </p>
                    <button
                      onClick={() => handleCopy("+91 85299 75095")}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title="Copy number"
                    >
                      {copiedNumber === "+91 85299 75095" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Founder Card */}
                <a
                  href="https://instagram.com/vansh_vj"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-pink-500/20 hover:bg-white/[0.03] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center text-sm font-bold text-pink-300">
                      VV
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-white truncate">
                        Vansh Vijay
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] text-pink-400 font-medium mt-0.5">
                        Founder
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Product, frontend & system design
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 group-hover:text-pink-400 transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@vansh_vj</span>
                  </div>
                </a>

                {/* Co-Founder Card */}
                <a
                  href="https://instagram.com/prateek_10x"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 hover:border-violet-500/20 hover:bg-white/[0.03] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-sm font-bold text-violet-300">
                      PP
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-white truncate">
                        Prateek Patidar
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] text-violet-400 font-medium mt-0.5">
                        Co-Founder
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Backend systems & platform architecture
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 group-hover:text-violet-400 transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@prateek_10x</span>
                  </div>
                </a>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <p className="text-sm text-zinc-500 text-center leading-relaxed">
                  ConsistPay is designed around accountability, commitment, and
                  behavioral consistency. We actively improve the platform using
                  real developer feedback and user behavior insights.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ─── END STILL NEED HELP ─── */}
      </div>
      {/* ─── END FAQ SECTIONS ─── */}
    </div>
  );
}