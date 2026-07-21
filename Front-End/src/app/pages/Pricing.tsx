import { Code2, Check, X, Info, Trophy, Zap, Users, TrendingUp, Gift, Shield, Coins, Target, HelpCircle, ArrowRight, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Pricing() {
  useEffect(() => {
    document.title = "Pricing | ConsistPay";
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");
  const [userPlan, setUserPlan] = useState<string>("free");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) return;
    const fetchUserPlan = async () => {
      try {
        const res = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.plan || "free");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserPlan();
  }, [token, API]);

  const handleUpgrade = async () => {
    if (!token) {
      navigate("/signup");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/payment/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        import("sonner").then((mod) => mod.toast.success("Upgraded to Pro!"));
        setUserPlan("pro");
        navigate("/dashboard");
      } else {
        const data = await res.json();
        import("sonner").then((mod) => mod.toast.error(data.message || "Failed to upgrade"));
      }
    } catch (err) {
      import("sonner").then((mod) => mod.toast.error("Network error"));
    } finally {
      setLoading(false);
    }
  };

  const freePlanFeatures = [
    { text: "Daily commitment: ₹5 or ₹10/day", included: true },
    { text: "Monthly deposit: ₹150 or ₹300", included: true },
    { text: "1 Grace coin per month", included: true },
    { text: "Basic global leaderboard", included: true },
    { text: "Basic analytics dashboard", included: true },
    { text: "Battle Mode 1v1 challenges", included: false },
    { text: "Referral commission earnings", included: false },
    { text: "Priority support response", included: false },
  ];

  const proPlanFeatures = [
    { text: "Daily commitment: ₹5, ₹10, ₹20, ₹50/day", included: true },
    { text: "Monthly deposit: ₹150 to ₹1500", included: true },
    { text: "1 Grace coin + 1 bonus on 15-day streak", included: true },
    { text: "Full global leaderboard rankings", included: true },
    { text: "Advanced analytics & progression charts", included: true },
    { text: "Battle Mode challenges", included: true, highlight: true },
    { text: "10% referral commission", included: true },
    { text: "24/7 Priority developer support", included: true },
  ];

  return (
    <div className="min-h-screen text-white bg-[#0D0D0F] font-sans">
      {/* Background Neon Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] animate-pulse duration-[6000ms]" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar (Unified glassmorphic layout) */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.03] bg-[#0D0D0F]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-7 w-auto object-contain select-none hidden dark:block"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
            </Link>

            {/* Navigation Right actions */}
            <div className="flex items-center gap-6">
              {token ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-violet-500/10 active:scale-95 cursor-pointer"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-violet-500/10 active:scale-95 cursor-pointer"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        
        {/* Page Hero Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-violet-300 font-bold tracking-wider uppercase">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-none">
            Invest in Your <span className="bg-gradient-to-r from-violet-400 via-indigo-350 to-emerald-400 bg-clip-text text-transparent">Consistency</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Choose the stakes that keep your coding habit alive. Every single deposit is 100% refundable when you complete your streak. Zero risk.
          </p>
        </div>

        {/* Dynamic Billing Switcher */}
        <div className="flex items-center justify-center gap-3.5 mb-14">
          <span className={`text-xs font-black uppercase tracking-wider transition-colors duration-200 ${billingInterval === "monthly" ? "text-white" : "text-zinc-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingInterval(billingInterval === "monthly" ? "annual" : "monthly")}
            className="relative w-12 h-6.5 rounded-full bg-zinc-900 border border-white/[0.06] hover:border-violet-500/30 transition-all flex items-center p-0.5 cursor-pointer"
            aria-label="Billing Interval Toggle"
          >
            <div className={`w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md transform transition-transform duration-350 ${billingInterval === "annual" ? "translate-x-5.5" : "translate-x-0"}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase tracking-wider transition-colors duration-200 ${billingInterval === "annual" ? "text-white" : "text-zinc-500"}`}>
              Annual
            </span>
            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-28 items-stretch">
          
          {/* FREE PLAN */}
          <div className="relative group/card flex flex-col justify-between bg-[#0F0F13]/90 border border-white/[0.04] rounded-2xl p-7 sm:p-8 hover:border-zinc-800 transition-all duration-300 shadow-xl text-left">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-zinc-300">Free</h3>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 bg-zinc-850 px-2.5 py-1 rounded">Basics</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">Perfect for test driving and building basic habits.</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-zinc-500 font-medium">/month</span>
              </div>

              {/* Action Button */}
              {token && userPlan === "free" ? (
                <button
                  disabled
                  className="block w-full py-3.5 bg-zinc-855 text-zinc-500 border border-zinc-800 font-extrabold text-xs uppercase tracking-widest rounded-xl text-center mb-8 select-none"
                >
                  Active Plan
                </button>
              ) : token && userPlan === "pro" ? (
                <button
                  disabled
                  className="block w-full py-3.5 bg-zinc-855/50 text-zinc-550 border border-zinc-800/50 font-extrabold text-xs uppercase tracking-widest rounded-xl text-center mb-8 select-none"
                >
                  Pro is Active
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="block w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all text-center mb-8 border border-white/[0.05] active:scale-98"
                >
                  Get Started Free
                </Link>
              )}

              {/* Features List */}
              <div className="space-y-4">
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-zinc-900 border border-white/[0.02] flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-2.5 h-2.5 text-zinc-700" />
                      </div>
                    )}
                    <span className={`text-xs ${feature.included ? 'text-zinc-300 font-medium' : 'text-zinc-600 font-normal line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRO PLAN */}
          <div className="relative group/card flex flex-col justify-between bg-[#0C0C10] border border-violet-500/20 rounded-2xl p-7 sm:p-8 hover:border-violet-500/40 transition-all duration-300 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] text-left">
            {/* Glow backing */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-2xl pointer-events-none group-hover/card:opacity-100 transition-opacity" />
            
            {/* Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-lg shadow-violet-500/20 z-10 flex items-center gap-1 animate-bounce">
              <Star className="w-2.5 h-2.5 fill-current" />
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black bg-gradient-to-r from-violet-300 to-indigo-350 bg-clip-text text-transparent">Pro</h3>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded">Full Suite</span>
              </div>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">For serious developers committed to mastering daily consistency.</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-violet-200 to-indigo-200 bg-clip-text text-transparent">
                  ₹{billingInterval === "monthly" ? "49" : "39"}
                </span>
                <span className="text-xs text-zinc-500 font-medium">/month</span>
                {billingInterval === "annual" && (
                  <span className="text-[9px] text-zinc-400 ml-2 font-bold bg-white/5 border border-white/5 px-2 py-0.5 rounded">₹468/yr</span>
                )}
              </div>

              {/* Action Button */}
              {token && userPlan === "pro" ? (
                <button
                  disabled
                  className="block w-full py-3.5 bg-violet-600/10 text-violet-400 border border-violet-500/20 font-extrabold text-xs uppercase tracking-widest rounded-xl text-center mb-8 select-none"
                >
                  Active Plan
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="block w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all text-center mb-8 shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Upgrading..." : (token ? "Upgrade to Pro" : "Get Started with Pro")}
                </button>
              )}

              {/* Features List */}
              <div className="space-y-4">
                {proPlanFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${feature.highlight ? 'cursor-pointer group' : ''}`}
                    onClick={feature.highlight ? () => setShowModal(true) : undefined}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${feature.highlight ? 'bg-violet-500/10 border border-violet-500/25' : 'bg-emerald-500/10 border border-emerald-500/25'}`}>
                      <Check className={`w-2.5 h-2.5 ${feature.highlight ? 'text-violet-400 animate-pulse' : 'text-emerald-400'}`} />
                    </div>
                    <div className="flex-1 flex items-center gap-1.5">
                      <span className={`text-xs ${feature.highlight ? 'text-violet-300 font-extrabold group-hover:text-violet-200 underline decoration-dotted decoration-violet-500/40 offset-2' : 'text-zinc-300 font-medium'}`}>
                        {feature.text}
                      </span>
                      {feature.highlight && (
                        <Info className="w-3 h-3 text-violet-400 group-hover:text-violet-300 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Feature Comparison Matrix */}
        <div className="max-w-4xl mx-auto mb-28 text-left">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black mb-2">Compare Features</h2>
            <p className="text-xs text-zinc-500">A granular breakdown of plan capabilities.</p>
          </div>

          <div className="overflow-hidden border border-white/[0.04] bg-[#0F0F13]/40 backdrop-blur-xl rounded-2xl shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                    <th className="p-4 font-bold text-zinc-400 uppercase tracking-wider">Features</th>
                    <th className="p-4 font-bold text-zinc-400 uppercase tracking-wider text-center w-28">Free</th>
                    <th className="p-4 font-bold text-violet-400 uppercase tracking-wider text-center w-28">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Category: Stakes Limits */}
                  <tr className="border-b border-white/[0.02] bg-white/[0.02]">
                    <td colSpan={3} className="px-4 py-2 font-black uppercase text-[10px] tracking-wider text-zinc-500">Accountability & Limits</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Daily commitment stakes limit</td>
                    <td className="p-4 text-zinc-500 text-center">₹5 - ₹10/day</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">₹5 - ₹50/day</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Monthly locked deposit options</td>
                    <td className="p-4 text-zinc-500 text-center">₹150 - ₹300</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">₹150 - ₹1500</td>
                  </tr>
                  
                  {/* Category: Protections */}
                  <tr className="border-b border-white/[0.02] bg-white/[0.02]">
                    <td colSpan={3} className="px-4 py-2 font-black uppercase text-[10px] tracking-wider text-zinc-500">Streak Protections</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Monthly base Grace coins allowance</td>
                    <td className="p-4 text-zinc-500 text-center">1 Grace coin</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">1 Base Grace coin</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Grace bonus coins reward on 15-day streak</td>
                    <td className="p-4 text-zinc-550 text-center text-zinc-650">—</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">1 Bonus Grace coin</td>
                  </tr>

                  {/* Category: Social & Analytics */}
                  <tr className="border-b border-white/[0.02] bg-white/[0.02]">
                    <td colSpan={3} className="px-4 py-2 font-black uppercase text-[10px] tracking-wider text-zinc-500">Social & Analytics</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Rank positions on Global Leaderboard</td>
                    <td className="p-4 text-zinc-500 text-center">Basic rankings</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">Full leaderboard analytics</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Dsa Analytics & progress charts</td>
                    <td className="p-4 text-zinc-500 text-center">Basic dashboard stats</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">Advanced visual progression</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">1v1 Battle Mode matchmaking challenges</td>
                    <td className="p-4 text-center">
                      <X className="w-4 h-4 text-zinc-700 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    </td>
                  </tr>

                  {/* Category: Commissions */}
                  <tr className="border-b border-white/[0.02] bg-white/[0.02]">
                    <td colSpan={3} className="px-4 py-2 font-black uppercase text-[10px] tracking-wider text-zinc-500">Earnings & Support</td>
                  </tr>
                  <tr className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Referrals commission rate</td>
                    <td className="p-4 text-zinc-550 text-center text-zinc-650">—</td>
                    <td className="p-4 text-emerald-400 font-bold text-center">10% commission</td>
                  </tr>
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-zinc-300 font-medium">Technical developer support tier</td>
                    <td className="p-4 text-zinc-500 text-center">Standard support</td>
                    <td className="p-4 text-zinc-200 font-bold text-center">Priority developer support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Why Choose ConsistPay Grid */}
        <div className="max-w-6xl mx-auto mb-28">
          <h2 className="text-2xl font-black text-center mb-10">Why Coder's Trust ConsistPay</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Trophy, title: "Real Stakes", text: "Put your money where your code is. Financial accountability drive real habits.", color: "from-violet-500/10 to-violet-600/10 border-violet-500/20 text-violet-400" },
              { icon: Users, title: "Battle Mode", text: "Challenge peers in 1v1 consistency duels. Set the stake pool and claim victory.", color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400" },
              { icon: TrendingUp, title: "Progress Analytics", text: "Verify completed solutions across platform API sync logs with deep progress insights.", color: "from-blue-500/10 to-indigo-600/10 border-blue-500/20 text-blue-400" },
              { icon: Shield, title: "100% Refundable", text: "Secure deposit return. Maintain your target daily streak to reclaim full funds.", color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400" },
            ].map((prop, idx) => (
              <div key={idx} className="relative group text-left">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all duration-300 shadow-md flex flex-col justify-between h-full">
                  <div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${prop.color} rounded-xl flex items-center justify-center mb-4 border`}>
                      <prop.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm mb-2 text-zinc-100">{prop.title}</h3>
                    <p className="text-[11.5px] text-zinc-450 leading-relaxed font-medium">{prop.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-2xl mx-auto mt-20 text-left">
          <div className="flex items-center justify-center gap-2 mb-10">
            <HelpCircle className="w-5 h-5 text-violet-400" />
            <h2 className="text-2xl font-black">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "How does the deposit accountability work?", a: "You deposit stakes once depending on your commitment plan (₹150-₹1500). Each day you miss your coding submission target, we deduct your pre-configured daily commitment amount. Meet your target streak, and your remaining funds are 100% withdrawable. Zero fee cuts." },
              { q: "What are Grace coins and how are they used?", a: "Grace coins let you skip your daily submission target once without penalizing your active streak or deposit stakes. All accounts receive 1 Grace coin per month automatically, and Pro subscribers earn 1 bonus Grace coin each time they maintain a 15-day streak." },
              { q: "Can I cancel subscription and request a payout?", a: "Yes! You can cancel Pro or adjust daily stakes anytime from settings. Upon cancellation, your withdrawable wallet balances are immediately processed back to your payout account via UPI/Razorpay." }
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-[#0F0F13]/85 border border-white/[0.04] rounded-xl p-5 hover:border-white/[0.08] hover:bg-[#0F0F13] transition-all duration-300 shadow-sm"
              >
                <summary className="font-bold text-xs uppercase tracking-wide cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white select-none">
                  {faq.q}
                  <span className="text-zinc-555 group-open:rotate-180 transition-transform duration-300 ml-2">
                    ▼
                  </span>
                </summary>
                <p className="text-[11.5px] text-zinc-400 mt-3.5 leading-relaxed border-t border-white/[0.03] pt-3.5 font-medium">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Friend Challenge details modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-250" onClick={() => setShowModal(false)}>
          <div
            className="relative max-w-xl w-full bg-[#0E0F14] border border-violet-500/20 rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal backdrop lights */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl blur-xl opacity-40 pointer-events-none" />

            {/* Sticky Header */}
            <div className="sticky top-0 bg-[#0E0F14]/90 backdrop-blur-xl border-b border-white/[0.04] p-5 rounded-t-2xl flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-black">Battle Mode</h3>
                  <p className="text-[9.5px] text-zinc-500 uppercase font-extrabold tracking-wider mt-0.5">Matchmaking Rules & details</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.04] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-left">
              {/* Info ribbon */}
              <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/25 rounded-xl p-5">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-violet-400 mb-2">Challenge your peers</h4>
                <p className="text-[11.5px] text-zinc-300 leading-relaxed font-medium">
                  Create custom 1-on-1 coding streak battles. The person who completes the most daily coding solutions across the challenge duration wins 100% of the joint stakes pool.
                </p>
              </div>

              {/* Stake limits row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#090A0D] border border-white/[0.04] rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-400 mt-0.5 shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[10px] uppercase tracking-wider text-zinc-550 mb-0.5">Entry Platform Fee</h5>
                    <p className="text-lg font-black text-white">₹19</p>
                    <p className="text-[9px] text-zinc-500 font-semibold mt-0.5">Per battle opponent</p>
                  </div>
                </div>

                <div className="bg-[#090A0D] border border-white/[0.04] rounded-xl p-4 flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mt-0.5 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[10px] uppercase tracking-wider text-zinc-550 mb-0.5">Flexible Stakes</h5>
                    <p className="text-lg font-black text-emerald-400">₹100 - ₹1000</p>
                    <p className="text-[9px] text-zinc-500 font-semibold mt-0.5">Winner take all pool</p>
                  </div>
                </div>
              </div>

              {/* Match rules */}
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-4">How it works</h4>
                <div className="space-y-4">
                  {[
                    { title: "Generate Invitation Code", text: "Set duration (7, 15, or 30 days) and specify stake amount to create challenge." },
                    { title: "Opponent Accepts Duel", text: "Invite friend via copy code. Both players match stakes + pay entry fee." },
                    { title: "Submit Daily Code Proof", text: "Sync active submission logs on your dashboards daily before 11:59 PM." },
                    { title: "Claim Winnings", text: "Winner gets 100% of joint stakes! Tie refunds the stakes." }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-7 h-7 flex-shrink-0 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center text-xs font-black text-violet-400">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-zinc-200">{rule.title}</h5>
                        <p className="text-[11px] text-zinc-450 leading-relaxed mt-0.5 font-medium">{rule.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caution details list */}
              <div className="bg-[#090A0D] border border-white/[0.04] rounded-xl p-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-400 mb-3">Critical Battle Rules</h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2.5">
                    <X className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-zinc-350 leading-relaxed font-semibold">
                      <strong className="text-rose-400/90 font-black">Grace coins CANNOT be used</strong> during active Battle challenges. A single miss counts as a tiebreaker loss.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-zinc-400 font-medium">Tie refunds basic stake amount to both players' withdrawable wallets (minus entry fee).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-[#0E0F14]/95 backdrop-blur-xl border-t border-white/[0.04] p-5 rounded-b-2xl flex gap-3 z-10">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all border border-white/[0.04] cursor-pointer"
              >
                Close
              </button>
              {token && userPlan === "pro" ? (
                <Link
                  to="/dashboard"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md text-center"
                >
                  Create Battle
                </Link>
              ) : (
                <button
                  onClick={() => { setShowModal(false); handleUpgrade(); }}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md text-center cursor-pointer"
                >
                  Get Pro to Unlock
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
