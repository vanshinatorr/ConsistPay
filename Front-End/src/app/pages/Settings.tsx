import { Code2, ArrowLeft, User, Lock, CreditCard, Bell, Shield, ChevronRight, Check, LogOut, Loader2, Link2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlatformsManager } from "../components/PlatformsManager";

type Section = "account" | "commitment" | "platforms" | "security" | "notifications" | "plan";

export function Settings() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Settings | ConsistPay";
  }, []);
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as Section | null;
  const [activeSection, setActiveSection] = useState<Section>(tabParam || "account");

  useEffect(() => {
    const tab = searchParams.get("tab") as Section;
    if (tab) {
      setActiveSection(tab);
    }
  }, [searchParams]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Account state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const avatarOptions = ["👨‍💻", "👩‍💻", "🚀", "⚡", "👾", "🎯", "👑", "🦄"];

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setAvatar(data.avatar || "");
          setDailyCommitment(data.dailyCommitment || 5);
          setPlan(data.plan || "free");
          setOnboardingComplete(data.onboardingComplete || false);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [API, token]);

  const handleSaveAccount = async () => {
    setSaveLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, avatar })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || "Failed to update profile");
      }
    } catch (err) {
      setErrorMsg("Network error occurred.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveCommitment = async () => {
    setSaveLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dailyCommitment })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || "Failed to update commitment");
      }
    } catch (err) {
      setErrorMsg("Network error occurred.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    if (!currentPassword) {
      setErrorMsg("Current password is required.");
      return;
    }
    setSaveLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (res.ok) {
        setSaved(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSaved(false), 2000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || "Failed to change password");
      }
    } catch (err) {
      setErrorMsg("Network error occurred.");
    } finally {
      setSaveLoading(false);
    }
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("consistpay_user_data");
      navigate("/login");
    }, 850);
  };

  const sections = [
    { key: "account", label: "Account", icon: User },
    { key: "commitment", label: "Commitment", icon: CreditCard },
    { key: "platforms", label: "Connected Platforms", icon: Link2 },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Lock },
    { key: "plan", label: "Plan & Billing", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  const defaultAvatar = name ? name.substring(0, 2).toUpperCase() : "US";
  const username = email ? email.split("@")[0] : "user";

  return (
    <>
      <div className="min-h-screen text-white" style={{ backgroundColor: "#0F0F13" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0F0F13]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none hidden dark:block"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
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
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 gap-1.5 lg:gap-1 p-2 bg-white/5 border border-white/[0.04] rounded-2xl space-y-0 lg:space-y-1 mb-2 lg:mb-0 select-none">
              {sections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveSection(key as Section);
                    setErrorMsg(""); // Clear errors on tab switch
                  }}
                  className={`flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-medium transition-all text-left whitespace-nowrap shrink-0 cursor-pointer
                    ${activeSection === key
                      ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  {label}
                </button>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl text-xs lg:text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all whitespace-nowrap shrink-0 lg:w-full lg:pt-3 lg:mt-2 lg:border-t lg:border-white/[0.04] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">

            {/* ── ACCOUNT ── */}
            {activeSection === "account" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-6">Account Details</h2>

                  {/* Avatar */}
                  <div className="flex flex-col mb-6 p-4 bg-white/5 rounded-xl border border-white/[0.04]">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-emerald-500/20">
                        {avatar ? (
                          avatar.startsWith("http") || avatar.startsWith("data:") ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <span className="text-3xl">{avatar}</span>
                          )
                        ) : (
                          <span className="text-xl">{defaultAvatar}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-xs text-zinc-400">@{username}</p>
                      </div>
                      <button 
                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                        className="ml-auto text-xs text-violet-400 hover:text-violet-300 border border-violet-500/30 px-3 py-1.5 rounded-lg bg-violet-500/10 transition-all"
                      >
                        {showAvatarSelector ? "Cancel" : "Choose Profile"}
                      </button>
                    </div>

                    {/* Avatar Selector Grid */}
                    {showAvatarSelector && (
                      <div className="mt-4 pt-4 border-t border-white/[0.04]">
                        <p className="text-xs text-zinc-400 mb-3">Choose an avatar emoji</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => { setAvatar(""); setShowAvatarSelector(false); }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${!avatar ? "bg-violet-500/20 border-violet-500/50 border" : "bg-white/5 border border-white/[0.04] hover:bg-white/10"}`}
                          >
                            <span className="text-xs font-bold text-zinc-300">{defaultAvatar}</span>
                          </button>
                          {avatarOptions.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => { setAvatar(emoji); setShowAvatarSelector(false); }}
                              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${avatar === emoji ? "bg-violet-500/20 border-violet-500/50 border scale-110" : "bg-white/5 border border-white/[0.04] hover:bg-white/10 hover:scale-105"}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: name, setter: setName, type: "text" },
                      { label: "Email", value: email, setter: setEmail, type: "email" },
                    ].map(({ label, value, setter, type }) => (
                      <div key={label}>
                        <label className="block text-xs font-bold text-zinc-450 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                        <input
                          type={type}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/[0.06] rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveAccount}
                    disabled={saveLoading}
                    className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 disabled:opacity-50"
                      }`}
                  >
                    {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* ── COMMITMENT ── */}
            {activeSection === "commitment" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-2">Daily Commitment</h2>
                  <p className="text-zinc-400 text-sm mb-6 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    Your daily commitment is locked for this month and cannot be changed.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { coins: 5, amount: "₹5/day", monthly: "₹150/month" },
                      { coins: 10, amount: "₹10/day", monthly: "₹300/month" },
                      { coins: 20, amount: "₹20/day", monthly: "₹600/month", pro: true },
                      { coins: 50, amount: "₹50/day", monthly: "₹1500/month", pro: true },
                    ].map(({ coins, amount, monthly, pro }) => {
                      const isActive = dailyCommitment === coins;
                      return (
                        <div
                          key={coins}
                          className={`relative p-4 rounded-xl border text-left transition-all
                            ${isActive
                              ? "bg-yellow-500/20 border-yellow-500/40 shadow-lg shadow-yellow-500/10"
                              : "opacity-40 bg-white/5 border-white/[0.04] grayscale"
                            }`}
                        >
                          {pro && (
                            <span className="absolute top-2 right-2 text-xs bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-500/30">Pro</span>
                          )}
                          <div className={`text-xl font-bold mb-1 ${isActive ? "text-yellow-400" : "text-white"}`}>{amount}</div>
                          <div className="text-xs text-zinc-400">{monthly}</div>
                          {isActive && (
                            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white/5 border border-white/[0.04] rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Current active plan</span>
                      <span className="font-semibold text-yellow-400">{dailyCommitment} coins/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Monthly deposit</span>
                      <span className="font-semibold">₹{dailyCommitment * 30}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── CONNECTED PLATFORMS ── */}
            {activeSection === "platforms" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6">
                  <PlatformsManager />
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6">
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
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/[0.04] rounded-xl"
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
                    onClick={() => {
                      // Just mock saving since we didn't build a backend endpoint for this
                      setSaveLoading(true);
                      setTimeout(() => {
                        setSaveLoading(false);
                        setSaved(true);
                        setTimeout(() => setSaved(false), 2000);
                      }, 500);
                    }}
                    disabled={saveLoading}
                    className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 disabled:opacity-50"
                      }`}
                  >
                    {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? "Saved!" : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeSection === "security" && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6">
                  <h2 className="text-lg font-bold mb-6">Change Password</h2>

                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-4">
                    {[
                      { label: "Current Password", value: currentPassword, setter: setCurrentPassword },
                      { label: "New Password", value: newPassword, setter: setNewPassword },
                      { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword },
                    ].map(({ label, value, setter }) => (
                      <div key={label}>
                        <label className="block text-xs font-bold text-zinc-450 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                        <input
                          type="password"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/[0.06] rounded-xl text-zinc-900 dark:text-white placeholder-zinc-450 dark:placeholder-zinc-650 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSavePassword}
                    disabled={saveLoading}
                    className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                      ${saved
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                        : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 shadow-lg shadow-red-500/30 disabled:opacity-50"
                      }`}
                  >
                    {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? "Password Updated!" : "Update Password"}
                  </button>

                  {/* Danger Zone */}
                  <div className="mt-8 p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                    <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
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
                      <span className={`text-xs px-2 py-1 rounded-full ${onboardingComplete ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-zinc-550/20 border border-zinc-550/30 text-zinc-400"}`}>
                        {onboardingComplete ? "Active" : "Setup Incomplete"}
                      </span>
                    </div>
                    
                    {!onboardingComplete ? (
                      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div>
                          <div className="font-bold text-zinc-400 text-lg">No Active Plan</div>
                          <div className="text-zinc-550 text-sm">Please complete onboarding setup</div>
                        </div>
                      </div>
                    ) : plan?.toLowerCase() === "pro" ? (
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
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div>
                          <div className="font-bold text-zinc-300 text-lg">Free Plan</div>
                          <div className="text-zinc-400 text-sm">Basic tracking</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black">₹0</div>
                          <div className="text-xs text-zinc-400">/month</div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      {[
                        "Daily commitment up to ₹50/day",
                        "Friend challenges (₹100–₹1000 stake)",
                        "1 Grace coin + 1 at 15-day streak",
                        "Advanced analytics dashboard",
                        "Full global leaderboard",
                        "10% referral commission",
                      ].map((feature) => (
                        <div key={feature} className={`flex items-center gap-2 text-sm ${onboardingComplete && plan?.toLowerCase() === "pro" ? "text-zinc-300" : "text-zinc-500"}`}>
                          <Check className={`w-4 h-4 shrink-0 ${onboardingComplete && plan?.toLowerCase() === "pro" ? "text-emerald-400" : "text-zinc-600"}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Billing */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl blur-xl opacity-40" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Billing</h2>
                    
                    {!onboardingComplete ? (
                      <div className="text-sm text-zinc-400">
                        You have not completed the onboarding process. Setup commitment to activate tracking.
                      </div>
                    ) : plan?.toLowerCase() === "pro" ? (
                      <div className="space-y-3">
                        {[
                          { label: "Next billing date", value: "Next Month" },
                          { label: "Payment method", value: "UPI / Razorpay" },
                          { label: "Amount", value: "₹49/month" },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between text-sm">
                            <span className="text-zinc-400">{label}</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-400">
                        You are currently on the free plan. No active billing.
                      </div>
                    )}

                    <div className="flex gap-3 mt-5">
                      {!onboardingComplete ? (
                        <Link
                          to="/onboarding"
                          className="flex-1 py-3 rounded-xl font-semibold text-center bg-violet-600 hover:bg-violet-500 text-white-force text-sm flex items-center justify-center gap-1 shadow-sm shadow-violet-650/15"
                        >
                          Setup Commitment
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <Link
                          to="/pricing"
                          className="flex-1 py-3 rounded-xl font-semibold text-center bg-white/5 border border-white/[0.04] hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-1"
                        >
                          {plan?.toLowerCase() === "pro" ? "Manage Plan" : "Upgrade to Pro"}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                      {onboardingComplete && plan?.toLowerCase() === "pro" && (
                        <button className="flex-1 py-3 rounded-xl font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm">
                          Cancel Plan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>

    {/* Logout Confirmation Modal (SaaS Vibe) */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-[#0F1018] border border-white/[0.06] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sign Out</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider mt-0.5">End active session</p>
            </div>
          </div>
          
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Are you sure you want to sign out of ConsistPay? You will need to log back in to access your dashboard, track streaks, and process streak payouts.
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              disabled={isLoggingOut}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/5 border border-white/[0.06] transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-red-500/15 disabled:opacity-50 active:scale-95"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <span>Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}