import { Code2, Check, X, Info, Trophy, Zap, Users, TrendingUp, Gift, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Pricing() {
  const [showModal, setShowModal] = useState(false);

  const freePlanFeatures = [
    { text: "Daily commitment: ₹5 or ₹10/day", included: true },
    { text: "Monthly deposit: ₹150 or ₹300", included: true },
    { text: "1 Grace coin per month", included: true },
    { text: "Basic global leaderboard", included: true },
    { text: "Basic analytics", included: true },
    { text: "Friend challenges", included: false },
    { text: "Referral commission", included: false },
    { text: "Full analytics dashboard", included: false },
  ];

  const proPlanFeatures = [
    { text: "Daily commitment: ₹5, ₹10, ₹20, ₹50/day", included: true },
    { text: "Monthly deposit: ₹150 to ₹1500", included: true },
    { text: "2 Grace coins (1 base + 1 bonus on 15 day streak)", included: true },
    { text: "Full global leaderboard", included: true },
    { text: "Advanced analytics dashboard", included: true },
    { text: "Friend challenges", included: true, highlight: true },
    { text: "10% referral commission", included: true },
    { text: "Priority support", included: true },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0D0D0F' }}>
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300 font-medium">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Start building your coding habit with accountability that works.
            <br />All deposits are 100% refundable.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* FREE PLAN */}
          <div className="relative">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-zinc-400 text-sm mb-6">Perfect for getting started</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">₹0</span>
                  <span className="text-zinc-400">/month</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="block w-full py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-lg transition-all duration-300 text-center mb-8 border border-white/20"
              >
                Get Started Free
              </Link>

              <div className="space-y-4">
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-purple-500/30 rounded-2xl blur-2xl opacity-60" />
            
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full text-sm font-semibold shadow-lg shadow-violet-500/50 z-10">
              Most Popular
            </div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-8 hover:border-violet-500/50 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                  Pro
                </h3>
                <p className="text-zinc-400 text-sm mb-6">For serious developers</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                    ₹49
                  </span>
                  <span className="text-zinc-400">/month</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="block w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 text-center mb-8 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
              >
                Get Started with Pro
              </Link>

              <div className="space-y-4">


{proPlanFeatures.map((feature, index) => (
  <div
    key={index}
    className={`flex items-start gap-3 ${feature.highlight ? 'cursor-pointer group' : ''}`}
    onClick={feature.highlight ? () => setShowModal(true) : undefined}
  >
    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-violet-400' : 'text-emerald-400'}`} />
    <div className="flex-1 flex items-center gap-2">
      <span className={`text-sm ${feature.highlight ? 'text-violet-300 font-medium group-hover:text-violet-200' : 'text-zinc-300'}`}>
        {feature.text}
      </span>
      {feature.highlight && (
        <Info className="w-4 h-4 text-violet-400 group-hover:text-violet-300 flex-shrink-0" />
      )}
    </div>
  </div>
))}

              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ConsistPay?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="font-semibold mb-2">Real Stakes</h3>
                <p className="text-sm text-zinc-400">
                  Put your money where your code is. Financial accountability drives results.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold mb-2">Friend Challenges</h3>
                <p className="text-sm text-zinc-400">
                  Compete with friends. Winner takes all. Build habits together.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-zinc-400">
                  Detailed analytics and streaks to keep you motivated every day.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold mb-2">100% Refundable</h3>
                <p className="text-sm text-zinc-400">
                  Complete your streak, get your full deposit back. Zero risk.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                How does the deposit work?
                <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-4">
                You deposit coins once (₹150-₹1500 based on your plan). Each day you miss, we deduct your daily commitment amount. Complete your streak to get your full deposit back.
              </p>
            </details>

            <details className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                What are grace coins?
                <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-4">
                Grace coins let you skip a day without losing your deposit. Free plan gets 1/month. Pro plan gets 2 (1 base + 1 bonus after 15-day streak).
              </p>
            </details>

            <details className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Can I cancel anytime?
                <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-4">
                Yes! You can cancel your Pro subscription anytime. Your deposit is refundable based on your completion rate.
              </p>
            </details>
          </div>
        </div>
      </main>

      {/* Friend Challenge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div
            className="relative max-w-2xl w-full bg-[#0D0D0F] border border-violet-500/30 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-60 -z-10" />

            {/* Header */}
            <div className="sticky top-0 bg-[#0D0D0F]/95 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Users className="w-6 h-6 text-violet-400" />
                    Friend Challenges
                  </h3>
                  <p className="text-zinc-400 text-sm">Compete with friends, winner takes all</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Challenge Your Friends</h4>
                    <p className="text-xs text-zinc-400">Put your streak to the test</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-300">
                  Create 1-on-1 coding challenges with your friends. The most consistent coder wins the entire stake. Build better habits together!
                </p>
              </div>

              {/* Pricing */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="font-semibold mb-1">Entry Fee</h4>
                  <p className="text-2xl font-bold text-violet-400 mb-1">₹19</p>
                  <p className="text-xs text-zinc-400">One-time per challenge</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-1">Stake Amount</h4>
                  <p className="text-2xl font-bold text-emerald-400 mb-1">₹100 - ₹1000</p>
                  <p className="text-xs text-zinc-400">You choose the stakes</p>
                </div>
              </div>

              {/* How It Works */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  How It Works
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 flex-shrink-0 bg-violet-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-violet-400">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Create Challenge</p>
                      <p className="text-xs text-zinc-400">Choose duration (7, 15, or 30 days) and set your stake amount</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 flex-shrink-0 bg-violet-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-violet-400">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Invite Friend</p>
                      <p className="text-xs text-zinc-400">Send challenge link to your friend. Both pay ₹19 entry + stake amount</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 flex-shrink-0 bg-violet-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-violet-400">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Daily Proof Required</p>
                      <p className="text-xs text-zinc-400">Submit LeetCode/Code360 solution link daily before 11:59 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 flex-shrink-0 bg-emerald-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-400">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm">Winner Takes All</p>
                      <p className="text-xs text-zinc-400">Most consistent coder wins 100% of both stakes!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-400" />
                  Important Rules
                </h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Grace coins can be used in challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Proof must be submitted before 11:59 PM daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Any valid coding platform link accepted (LeetCode, Code360, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>If tied, both get their stake back (no entry fee refund)</span>
                  </li>
                </ul>
              </div>

              {/* Example */}
              <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-400" />
                  Example Challenge
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Duration:</span>
                    <span className="font-medium">15 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Stake per person:</span>
                    <span className="font-medium">₹500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Entry fee per person:</span>
                    <span className="font-medium">₹19</span>
                  </div>
                  <div className="border-t border-white/10 my-3 pt-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total prize pool:</span>
                      <span className="text-xl font-bold text-emerald-400">₹1000</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Winner gets ₹500 profit + ₹500 stake back</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-all border border-white/10"
                >
                  Close
                </button>
                <Link
                  to="/signup"
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 text-center"
                >
                  Get Pro to Unlock
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
