import { Code2, ArrowLeft, TrendingUp, Award, Flame, Target, Crown, Trophy, Medal } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

type Tab = "streak" | "consistency" | "completed";

interface UserData {
  _id: string;
  name: string;
  username?: string;
  email: string;
  streak: number;
  plan: string;
  avatar?: string;
  completed: number;
  missed: number;
  consistency: number;
}

const avatarColors = [
  "from-violet-400 to-purple-600",
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-pink-400 to-rose-600",
  "from-orange-400 to-orange-600",
  "from-teal-400 to-teal-600",
  "from-yellow-400 to-yellow-600",
  "from-red-400 to-red-600",
];

const AvatarRenderer = ({ avatar, className, colorClass }: { avatar: string, className: string, colorClass: string }) => {
  const isUrl = avatar.startsWith("http");
  if (isUrl) {
    return <img src={avatar} alt="Avatar" className={`${className} object-cover bg-white/5 border border-white/[0.04]`} />;
  }
  return <div className={`${className} bg-gradient-to-br ${colorClass} text-white`}>{avatar}</div>;
};

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>("streak");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get current user to highlight them
        const meRes = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUserId(meData._id);
        }

        const res = await fetch(`${API}/api/users/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Leaderboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [API, token]);

  const sorted = [...users].sort((a, b) => {
    if (activeTab === "streak") return b.streak - a.streak;
    if (activeTab === "consistency") return b.consistency - a.consistency;
    return b.completed - a.completed;
  }).map((u, i) => {
    const displayName = u.username || u.name || "US";
    return { 
      ...u, 
      rank: i + 1, 
      isCurrentUser: u._id === currentUserId,
      avatar: u.avatar || displayName.substring(0, 2).toUpperCase()
    };
  });

  const currentUser = sorted.find(u => u.isCurrentUser) || sorted[0]; // fallback if not found

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-zinc-400">
        Loading Leaderboard...
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof Flame }[] = [
    { key: "streak", label: "Streak", icon: Flame },
    { key: "consistency", label: "Consistency", icon: TrendingUp },
    { key: "completed", label: "Completed", icon: Target },
  ];

  const getValue = (user: any) => {
    if (!user) return "0";
    if (activeTab === "streak") return `${user.streak || 0} days`;
    if (activeTab === "consistency") return `${user.consistency || 0}%`;
    return `${user.completed || 0} solved`;
  };

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

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 text-sm text-yellow-300 mb-4">
            <Award className="w-4 h-4" />
            Global Leaderboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Compete with the{" "}
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Best
            </span>
          </h1>
          <p className="text-zinc-400 text-sm">See where you rank among all developers</p>
        </div>

        {/* Your Rank Card */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-60" />
          <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5">
            <p className="text-zinc-400 text-xs mb-3 uppercase tracking-wider">Your Position</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 border border-white/[0.04] rounded-lg flex items-center justify-center font-bold text-violet-300">
                  #{currentUser.rank}
                </div>
                <AvatarRenderer 
                  avatar={currentUser.avatar} 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold" 
                  colorClass="from-emerald-400 to-emerald-600"
                />
                <div>
                  <div className="font-bold text-violet-300">You</div>
                  <div className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>{currentUser.streak} day streak</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{getValue(currentUser)}</div>
                <div className="text-xs text-zinc-400">{activeTab}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* 2nd */}
          <div className="relative mt-6">
            <div className="absolute inset-0 bg-zinc-400/10 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-zinc-500/10 border border-zinc-500/20 rounded-xl">
                  <Trophy className="w-5 h-5 text-zinc-400" />
                </div>
              </div>
              <AvatarRenderer 
                avatar={sorted[1]?.avatar || "US"} 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2" 
                colorClass="from-blue-400 to-blue-600"
              />
              <div className="font-semibold text-sm truncate">{sorted[1]?.username || sorted[1]?.name}</div>
              <div className="text-xs text-zinc-400 mt-1">{getValue(sorted[1])}</div>
            </div>
          </div>

          {/* 1st */}
          <div className="relative -mt-2">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-[#0F0F13] border border-yellow-500/20 rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Crown className="w-6 h-6 text-yellow-400 animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
              </div>
              <AvatarRenderer 
                avatar={sorted[0]?.avatar || "US"} 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold mx-auto mb-2" 
                colorClass="from-violet-400 to-purple-600"
              />
              <div className="font-bold truncate">{sorted[0]?.username || sorted[0]?.name}</div>
              <div className="text-xs text-yellow-400 mt-1 font-semibold">{getValue(sorted[0])}</div>
            </div>
          </div>

          {/* 3rd */}
          <div className="relative mt-6">
            <div className="absolute inset-0 bg-orange-500/10 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <Medal className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <AvatarRenderer 
                avatar={sorted[2]?.avatar || "US"} 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2" 
                colorClass="from-emerald-400 to-emerald-600"
              />
              <div className="font-semibold text-sm truncate">{sorted[2]?.username || sorted[2]?.name}</div>
              <div className="text-xs text-zinc-400 mt-1">{getValue(sorted[2])}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[#0F0F13] border border-white/[0.04] rounded-xl p-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${activeTab === key
                  ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Full List */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl blur-xl opacity-40" />
          <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl overflow-hidden shadow-xl">
            {sorted.map((user, index) => (
              <div
                key={user.name}
                className={`flex items-center justify-between px-5 py-4 border-b border-white/[0.04] last:border-0 transition-all
                  ${user.isCurrentUser
                    ? "bg-violet-500/10 border-l-2 border-l-violet-500"
                    : "hover:bg-white/[0.02]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg border
                    ${user.rank === 1 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : ""}
                    ${user.rank === 2 ? "bg-zinc-400/10 border-zinc-400/20 text-zinc-300" : ""}
                    ${user.rank === 3 ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : ""}
                    ${user.rank > 3 ? "bg-white/5 border-white/[0.04] text-zinc-400" : ""}
                  `}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <AvatarRenderer 
                    avatar={user.avatar} 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0" 
                    colorClass={user.isCurrentUser ? "from-emerald-400 to-emerald-600" : avatarColors[index % avatarColors.length]}
                  />

                  {/* Name */}
                  <div>
                    <div className={`font-semibold flex items-center gap-1.5 ${user.isCurrentUser ? "text-violet-300" : ""}`}>
                      <span>{user.username || user.name}</span>
                      {user.isCurrentUser && <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full font-bold">You</span>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500/60" />
                      <span>{user.streak} day streak</span>
                    </div>
                  </div>
                </div>

                {/* Value */}
                <div className="text-right">
                  <div className={`font-bold ${user.rank <= 3 ? "text-white" : "text-zinc-300"}`}>
                    {getValue(user)}
                  </div>
                  {user.rank <= 3 && (
                    <div className="text-xs text-zinc-500 flex items-center justify-end gap-1 mt-0.5">
                      {user.rank === 1 ? (
                        <>
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className="font-semibold text-yellow-400">Leader</span>
                        </>
                      ) : (
                        <span>#{user.rank}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}