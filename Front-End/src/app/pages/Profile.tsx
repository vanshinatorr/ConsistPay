import { Code2, ArrowLeft, Settings, Award, TrendingUp, Zap, Edit3, Flame, Target, Trophy, Gem, Moon, Sparkles, Shield, Coins, Lock, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AvatarSelectorModal } from "../components/AvatarSelectorModal";
import { AwardsCard } from "./dashboard/AwardsCard";

export function Profile() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Profile | ConsistPay";
  }, []);

  // ── Load cached data instantly from localStorage (set by Dashboard) ──
  const cachedRaw = localStorage.getItem("consistpay_user_data");
  const cachedUser = cachedRaw ? JSON.parse(cachedRaw) : null;

  const [userData, setUserData] = useState<any>(cachedUser);
  const [challengeStats, setChallengeStats] = useState({ total: 0, won: 0 });
  const [loading, setLoading] = useState(!cachedUser); // skip spinner if cache exists
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        // Fetch user + challenge history in parallel for speed
        const [userRes, challengeRes] = await Promise.all([
          fetch(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/challenges/history`, { headers: { Authorization: `Bearer ${token}` } })
            .catch(() => null) // challenge history is non-critical
        ]);

        // Only redirect to login on 401 Unauthorized
        if (userRes.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("consistpay_user_data");
          navigate("/login");
          return;
        }

        if (userRes.ok) {
          const userJson = await userRes.json();
          setUserData(userJson);
          localStorage.setItem("consistpay_user_data", JSON.stringify(userJson)); // keep cache fresh
        }

        if (challengeRes?.ok) {
          const challenges = await challengeRes.json();
          const won = challenges.filter((c: any) => c.outcome === "WON").length;
          setChallengeStats({ total: challenges.length, won });
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        // Network error — do NOT redirect, just keep showing cached data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-400 text-sm">Couldn't load profile. Please check your connection.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-lg text-sm hover:bg-violet-500/30 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // Map Real Data
  const joinDate = new Date(userData.planExpiresAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); 
  const username = userData.email?.split('@')[0] || "user";
  const defaultAvatar = userData.name ? userData.name.substring(0, 2).toUpperCase() : "US";
  const avatar = userData.avatar || defaultAvatar;
  const isAvatarUrl = avatar.startsWith("http");

  const handleSaveAvatar = async (newAvatarUrl: string) => {
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: newAvatarUrl })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUserData({ ...userData, avatar: updatedUser.avatar });
        import("sonner").then(mod => mod.toast.success("Avatar updated!"));
      } else {
        import("sonner").then(mod => mod.toast.error("Failed to update avatar"));
      }
    } catch (err) {
      console.error(err);
      import("sonner").then(mod => mod.toast.error("Network error"));
    }
  };

  const currentStreak = userData.streak || 0;
  const longestStreak = userData.maxStreak || 0;
  const completedDays = userData.totalSolved || 0;
  const missedDays = userData.totalMissed || 0;
  const totalDays = completedDays + missedDays;
  const consistencyScore = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;



  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <Link to="/settings" className="p-2 rounded-lg bg-white/5 border border-white/[0.04] hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-zinc-400" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Profile Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {isAvatarUrl ? (
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 bg-white/5 border border-white/[0.04] rounded-2xl object-cover shadow-lg shadow-emerald-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30">
                      {avatar}
                    </div>
                  )}
                  {userData?.plan?.toLowerCase() === "pro" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold truncate">{userData.name}</h1>
                  <p className="text-zinc-400 text-sm truncate">@{username}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {userData?.plan?.toLowerCase() === "pro" ? (
                      <span className="text-xs bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        Pro
                      </span>
                    ) : (
                      <span className="text-xs bg-zinc-500/20 border border-zinc-500/30 text-zinc-300 px-2 py-0.5 rounded-full font-semibold">
                        Free Plan
                      </span>
                    )}
                    <span className="text-xs text-zinc-500">Joined {joinDate}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 border border-white/[0.04] rounded-lg hover:bg-white/10 transition-all text-sm text-zinc-400 w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0D0D0F] rounded-xl p-3 text-center border border-white/[0.02]">
                <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Current Streak</div>
              </div>
              <div className="bg-[#0D0D0F] rounded-xl p-3 text-center border border-white/[0.02]">
                <div className="text-2xl font-bold text-emerald-400">{consistencyScore}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Score / 100</div>
              </div>
              <div className="bg-[#0D0D0F] rounded-xl p-3 text-center border border-white/[0.02]">
                <div className="text-2xl font-bold text-violet-400">{completedDays}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Total Solves</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Performance Stats
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Current Streak", value: `${currentStreak} days`, icon: Flame, color: "text-orange-400", iconColor: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                { label: "Longest Streak", value: `${longestStreak} days`, icon: Zap, color: "text-yellow-400", iconColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                { label: "Completed Days", value: completedDays, icon: CheckCircle, color: "text-emerald-400", iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { label: "Missed Days", value: missedDays, icon: XCircle, color: "text-red-400", iconColor: "text-red-400 bg-red-500/10 border-red-500/20" },
                { label: "Challenges Won", value: `${challengeStats.won}/${challengeStats.total}`, icon: Trophy, color: "text-yellow-400", iconColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                { label: "Completion Rate", value: `${consistencyScore}%`, icon: BarChart3, color: "text-violet-400", iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
              ].map(({ label, value, icon: IconComponent, color, iconColor }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-[#0D0D0F] border border-white/[0.02] rounded-xl">
                  <div className={`p-2 rounded-lg border ${iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-zinc-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Consistency Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Overall Consistency</span>
                <span className="font-semibold text-emerald-400">{consistencyScore}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${consistencyScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coin & Grace */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Coins className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400">{userData.balance}</div>
              <div className="text-xs text-zinc-400 mt-1">Coin Balance</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-400">{userData.graceCoins}</div>
              <div className="text-xs text-zinc-400 mt-1">Grace Coins</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <AwardsCard
          streak={userData?.streak ?? 0}
          maxStreak={userData?.maxStreak ?? 0}
          consistencyScore={consistencyScore}
          battleBalance={userData?.battleBalance ?? 0}
          graceCoins={userData?.graceCoins ?? 0}
          plan={userData?.plan ?? "free"}
          onboardingComplete={userData?.onboardingComplete ?? true}
          totalSolved={userData?.totalSolved ?? 0}
          totalProblemsSolved={userData?.totalProblemsSolved ?? 0}
          dailyCommitment={userData?.dailyCommitment ?? 5}
        />

        {/* Plan Info */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-[#0F0F13] border border-violet-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  {userData?.plan?.toLowerCase() === "pro" ? "Pro Plan" : "Free Plan"}
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  {userData?.plan?.toLowerCase() === "pro" ? "All features unlocked • ₹49/month" : "Basic tracking features"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Active
                </span>
                {userData.plan !== "pro" && (
                  <Link to="/pricing" className="text-xs text-violet-400 hover:text-violet-300 font-semibold mt-1">
                    Upgrade to Pro →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      <AvatarSelectorModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={avatar}
        onSave={handleSaveAvatar}
      />
    </div>
  );
}