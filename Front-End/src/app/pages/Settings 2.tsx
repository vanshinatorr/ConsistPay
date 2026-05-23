import { Code2, ArrowLeft, User, Lock, CreditCard, Bell, Shield, ChevronRight, Check, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type Section = "account" | "commitment" | "security" | "notifications" | "plan";

export function Settings() {
  const [activeSection, setActiveSection] = useState<Section>("account");
  const [saved, setSaved] = useState(false);

  // Account state
  const [name, setName] = useState("Yuvraj Singh");
  const [username, setUsername] = useState("yuvraj_codes");
  const [email, setEmail] = useState("yuvraj@example.com");

  // Commitment state
  const [dailyCommitment, setDailyCommitment] = useState<number>(5);

  // Notification state
  const [notifSettings, setNotifSettings] = useState({
    dailyReminder: true,
    streakAlert: true,
    challengeUpdate: true,
    leaderboardMove: false,
    graceAlert: true,
    weeklyReport: true,
  });

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { key: "account", label: "Account", icon: User },
    { key: "commitment", label: "Commitment", icon: CreditCard },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Lock },
    { key: "plan", label: "Plan & Billing", icon: Shield },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </nav>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 space-y-1">
              {sections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as Section)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                    ${activeSection === key
                      ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}

              {/* Logout */}
              <div className="pt-2 mt-2 border-t border-white/10">
                <Link
                  to="/login"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">

            {/* ── ACCOUNT ── */}
            {activeSection === "account" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-6">Account Details</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                      YU
                    </div>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-xs text-zinc-400">@{username}</p>
                    </div>
                    <button className="ml-auto text-xs text-violet-400 hover:text-violet-300 border border-violet-500/30 px-3 py-1.5 rounded-lg bg-violet-500/10 transition-all">
                      Change Avatar
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: name, setter: setName, type: "text" },
                      { label: "Username", value: username, setter: setUsername, type: "text" },
                      { label: "Email", value: email, setter: setEmail, type: "email" },
                    ].map(({ label, value, setter, type }) => (
                      <div key={label}>
                        <label className="block text-sm text-zinc-400 mb-2">{label}</label>
                        <input
                          type={type}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30"
                      }`}
                  >
                    {saved ? "✅ Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ── COMMITMENT ── */}
            {activeSection === "commitment" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-2">Daily Commitment</h2>
                  <p className="text-zinc-400 text-sm mb-6">Choose how many coins you commit per day. Missing a day deducts this amount.</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { coins: 5, amount: "₹5/day", monthly: "₹150/month" },
                      { coins: 10, amount: "₹10/day", monthly: "₹300/month" },
                      { coins: 20, amount: "₹20/day", monthly: "₹600/month", pro: true },
                      { coins: 50, amount: "₹50/day", monthly: "₹1500/month", pro: true },
                    ].map(({ coins, amount, monthly, pro }) => (
                      <button
                        key={coins}
                        onClick={() => setDailyCommitment(coins)}
                        className={`relative p-4 rounded-xl border text-left transition-all
                          ${dailyCommitment === coins
                            ? "bg-yellow-500/20 border-yellow-500/40 shadow-lg shadow-yellow-500/10"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                      >
                        {pro && (
                          <span className="absolute top-2 right-2 text-xs bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-500/30">Pro</span>
                        )}
                        <div className="text-xl font-bold text-yellow-400 mb-1">{amount}</div>
                        <div className="text-xs text-zinc-500">{monthly}</div>
                        {dailyCommitment === coins && (
                          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Current plan</span>
                      <span className="font-semibold text-yellow-400">{dailyCommitment} coins/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Monthly deposit</span>
                      <span className="font-semibold">₹{dailyCommitment * 30}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className={`w-full py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-lg shadow-yellow-500/30"
                      }`}
                  >
                    {saved ? "✅ Saved!" : "Update Commitment"}
                  </button>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-6">Notification Preferences</h2>

                  <div className="space-y-3">
                    {[
                      { key: "dailyReminder", label: "Daily Reminder", desc: "Remind me to submit proof daily" },
                      { key: "streakAlert", label: "Streak Alert", desc: "Alert when streak is at risk" },
                      { key: "challengeUpdate", label: "Challenge Update", desc: "Friend's daily submission updates" },
                      { key: "leaderboardMove", label: "Leaderboard Move", desc: "When my rank changes" },
                      { key: "graceAlert", label: "Grace Coin Alert", desc: "When I earn a grace coin" },
                      { key: "weeklyReport", label: "Weekly Report", desc: "Weekly consistency summary" },
                    ].map(({ key, label, desc }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                      >
                        <div>
                          <div className="font-semibold text-sm">{label}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
                        </div>
                        <button
                          onClick={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={`w-12 h-6 rounded-full transition-all relative
                            ${notifSettings[key as keyof typeof notifSettings]
                              ? "bg-violet-500"
                              : "bg-white/10"
                            }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                            ${notifSettings[key as keyof typeof notifSettings] ? "left-7" : "left-1"}`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30"
                      }`}
                  >
                    {saved ? "✅ Saved!" : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeSection === "security" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-6">Change Password</h2>

                  <div className="space-y-4">
                    {[
                      { label: "Current Password", value: currentPassword, setter: setCurrentPassword },
                      { label: "New Password", value: newPassword, setter: setNewPassword },
                      { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword },
                    ].map(({ label, value, setter }) => (
                      <div key={label}>
                        <label className="block text-sm text-zinc-400 mb-2">{label}</label>
                        <input
                          type="password"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 shadow-lg shadow-red-500/30"
                      }`}
                  >
                    {saved ? "✅ Password Updated!" : "Update Password"}
                  </button>

                  {/* Danger Zone */}
                  <div className="mt-8 p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                    <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Danger Zone</h3>
                    <p className="text-xs text-zinc-500 mb-3">Deleting your account is permanent. All data will be lost.</p>
                    <button className="text-xs text-red-400 border border-red-500/30 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── PLAN ── */}
            {activeSection === "plan" && (
              <div className="space-y-4">
                {/* Current Plan */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-60" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold">Current Plan</h2>
                      <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full">✅ Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                      <div>
                        <div className="font-bold text-violet-300 text-lg">⚡ Pro Plan</div>
                        <div className="text-zinc-400 text-sm">All features unlocked</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black">₹49</div>
                        <div className="text-xs text-zinc-400">/month</div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {[
                        "Daily commitment up to ₹50/day",
                        "Friend challenges (₹100–₹1000 stake)",
                        "2 Grace coins per month",
                        "Advanced analytics dashboard",
                        "Full global leaderboard",
                        "10% referral commission",
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Billing */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl blur-xl opacity-40" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Billing</h2>
                    <div className="space-y-3">
                      {[
                        { label: "Next billing date", value: "April 22, 2026" },
                        { label: "Payment method", value: "UPI / Razorpay" },
                        { label: "Amount", value: "₹49/month" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-zinc-400">{label}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-5">
                      <Link
                        to="/pricing"
                        className="flex-1 py-3 rounded-xl font-semibold text-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-1"
                      >
                        Change Plan
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button className="flex-1 py-3 rounded-xl font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm">
                        Cancel Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}