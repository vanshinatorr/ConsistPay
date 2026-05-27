import { Code2, ArrowLeft, Settings, Award, TrendingUp, Zap, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AvatarSelectorModal } from "../components/AvatarSelectorModal";

export function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [challengeStats, setChallengeStats] = useState({ total: 0, won: 0 });
  const [loading, setLoading] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch User Data
        const userRes = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch Challenge History
        const challengeRes = await fetch(`${API}/api/challenges/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userRes.ok) {
          const userJson = await userRes.json();
          setUserData(userJson);
        }

        if (challengeRes.ok) {
          const challenges = await challengeRes.json();
          const won = challenges.filter((c: any) => c.outcome === "WON").length;
          setChallengeStats({ total: challenges.length, won });
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API, token]);

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
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
  const longestStreak = userData.streak || 0; // Fallback since longest isn't stored separately
  const completedDays = userData.totalSolved || 0;
  const missedDays = userData.totalMissed || 0;
  const totalDays = completedDays + missedDays;
  const consistencyScore = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const badges = [
    { icon: "🔥", label: "7 Day Streak", color: "from-orange-500/20 to-red-500/20", border: "border-orange-500/30", earned: currentStreak >= 7 },
    { icon: "⚡", label: "First Challenge", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30", earned: challengeStats.total >= 1 },
    { icon: "🏆", label: "Challenge Winner", color: "from-yellow-500/20 to-yellow-600/20", border: "border-yellow-500/30", earned: challengeStats.won >= 1 },
    { icon: "💎", label: "30 Day Streak", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", earned: currentStreak >= 30 },
    { icon: "🌙", label: "Night Coder", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", earned: false }, // Feature placeholder
    { icon: "👑", label: "100% Consistency", color: "from-yellow-500/20 to-yellow-600/20", border: "border-yellow-500/30", earned: consistencyScore === 100 && completedDays > 0 },
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <Link to="/settings" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5 text-zinc-400" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Profile Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {isAvatarUrl ? (
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl object-cover shadow-lg shadow-emerald-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/30">
                      {avatar}
                    </div>
                  )}
                  {userData.plan === "pro" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-xs">⭐</span>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-zinc-400 text-sm">@{username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {userData.plan === "pro" ? (
                      <span className="text-xs bg-violet-500/20 border border-violet-500/30 text-violet-300 px-2 py-0.5 rounded-full font-semibold">
                        ⚡ Pro
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
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm text-zinc-400"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Current Streak</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{consistencyScore}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Score / 100</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-violet-400">{completedDays}</div>
                <div className="text-xs text-zinc-500 mt-0.5">Total Solves</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Performance Stats
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Current Streak", value: `${currentStreak} days`, icon: "🔥", color: "text-orange-400" },
                { label: "Longest Streak", value: `${longestStreak} days`, icon: "⚡", color: "text-yellow-400" },
                { label: "Completed Days", value: completedDays, icon: "✅", color: "text-emerald-400" },
                { label: "Missed Days", value: missedDays, icon: "❌", color: "text-red-400" },
                { label: "Challenges Won", value: `${challengeStats.won}/${challengeStats.total}`, icon: "🏆", color: "text-yellow-400" },
                { label: "Completion Rate", value: `${consistencyScore}%`, icon: "📊", color: "text-violet-400" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="text-xl">{icon}</div>
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
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-2">🪙</div>
              <div className="text-3xl font-bold text-yellow-400">{userData.balance}</div>
              <div className="text-xs text-zinc-400 mt-1">Coin Balance</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <div className="text-3xl font-bold text-emerald-400">{userData.graceCoins}</div>
              <div className="text-xs text-zinc-400 mt-1">Grace Coins</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Badges
              <span className="ml-auto text-xs text-zinc-500">{badges.filter(b => b.earned).length}/{badges.length} earned</span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {badges.map(({ icon, label, color, border, earned }) => (
                <div
                  key={label}
                  className={`relative p-4 rounded-xl border text-center transition-all duration-300
                    ${earned
                      ? `bg-gradient-to-br ${color} ${border} shadow-lg shadow-white/5 hover:scale-105`
                      : "bg-white/5 border-white/10 opacity-50 grayscale hover:opacity-75"
                    }`}
                >
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-xs font-semibold text-zinc-300 leading-tight">{label}</div>
                  {!earned && (
                    <div className="absolute top-2 right-2 text-sm drop-shadow-md">🔒</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  {userData.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                  {userData.plan === "pro" ? "All features unlocked • ₹49/month" : "Basic tracking features"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full">
                  ✅ Active
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