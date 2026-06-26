import { Code2, ArrowLeft, TrendingUp, Award, Flame, Target, Crown, Trophy, Medal, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = sorted.filter(u => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (u.username || "").toLowerCase().includes(term) || (u.name || "").toLowerCase().includes(term);
  });

  const currentUser = sorted.find(u => u.isCurrentUser);

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
    <div className="min-h-screen text-white pb-12" style={{ backgroundColor: "#0D0D0F" }}>
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

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-xs text-yellow-300 mb-3 shadow-[0_0_15px_rgba(234,179,8,0.05)]">
            <Award className="w-3.5 h-3.5" />
            Global Leaderboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">
            Compete with the{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
              Best
            </span>
          </h1>
          <p className="text-zinc-400 text-xs">See where you rank among all developers on the platform</p>
        </div>

        {/* Top 3 Podium Unified Panel */}
        <div className="relative mb-6 bg-[#121217]/50 border border-white/[0.04] rounded-2xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Accent glow behind 1st place */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="text-center mb-6">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Top Performers</h2>
          </div>

          <div className="grid grid-cols-3 gap-3 items-end max-w-md mx-auto relative z-10">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-zinc-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <AvatarRenderer 
                  avatar={sorted[1]?.avatar || "US"} 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs relative ring-2 ring-zinc-500 ring-offset-2 ring-offset-[#0F0F13] transition-transform group-hover:scale-105" 
                  colorClass="from-slate-400 to-slate-650"
                />
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1b1b22] text-zinc-300 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-zinc-500/30 shadow-lg">
                  2ND
                </div>
              </div>
              <div className="text-center w-full max-w-[85px] sm:max-w-[110px]">
                <div className="font-semibold text-xs truncate text-zinc-200">{sorted[1]?.username || sorted[1]?.name || "Empty"}</div>
                <div className="text-[10px] text-zinc-500 font-bold mt-0.5">{getValue(sorted[1])}</div>
              </div>
              {/* Podium Pedestal */}
              <div className="w-full h-10 bg-gradient-to-t from-white/[0.01] to-white/[0.03] border-t border-white/[0.04] rounded-t-xl mt-3 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <AvatarRenderer 
                  avatar={sorted[0]?.avatar || "US"} 
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm relative ring-2 ring-yellow-500 ring-offset-2 ring-offset-[#0F0F13] transition-transform group-hover:scale-105" 
                  colorClass="from-amber-400 to-yellow-600"
                />
                <Crown className="w-4.5 h-4.5 text-yellow-400 absolute -top-3.5 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="text-center w-full max-w-[95px] sm:max-w-[130px]">
                <div className="font-bold text-xs truncate text-white">{sorted[0]?.username || sorted[0]?.name || "Empty"}</div>
                <div className="text-[11px] text-yellow-400 font-extrabold mt-0.5">{getValue(sorted[0])}</div>
              </div>
              {/* Podium Pedestal */}
              <div className="w-full h-15 bg-gradient-to-t from-yellow-500/[0.01] to-yellow-500/[0.05] border-t border-yellow-500/20 rounded-t-xl mt-3 flex items-center justify-center shadow-[0_-3px_12px_rgba(234,179,8,0.03)]">
                <Crown className="w-4.5 h-4.5 text-yellow-500" />
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <AvatarRenderer 
                  avatar={sorted[2]?.avatar || "US"} 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] relative ring-2 ring-orange-500/60 ring-offset-2 ring-offset-[#0F0F13] transition-transform group-hover:scale-105" 
                  colorClass="from-amber-600 to-orange-700"
                />
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#1b1b22] text-orange-400 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-orange-500/30 shadow-lg">
                  3RD
                </div>
              </div>
              <div className="text-center w-full max-w-[85px] sm:max-w-[110px]">
                <div className="font-semibold text-xs truncate text-zinc-300">{sorted[2]?.username || sorted[2]?.name || "Empty"}</div>
                <div className="text-[10px] text-zinc-500 font-bold mt-0.5">{getValue(sorted[2])}</div>
              </div>
              {/* Podium Pedestal */}
              <div className="w-full h-7 bg-gradient-to-t from-white/[0.01] to-white/[0.02] border-t border-white/[0.03] rounded-t-xl mt-3 flex items-center justify-center">
                <Medal className="w-3.5 h-3.5 text-orange-500/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 w-full">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#0F0F13] border border-white/[0.04] rounded-xl p-1 w-full sm:w-auto shrink-0">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap
                  ${activeTab === key
                    ? "bg-violet-500/20 border border-violet-500/30 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#0F0F13] border border-white/[0.04] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="relative bg-[#0F0F13] border border-white/[0.04] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-white/[0.04] text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/[0.01]">
            <div className="col-span-2">Rank</div>
            <div className="col-span-5">Developer</div>
            <div className="col-span-3">Streak</div>
            <div className="col-span-2 text-right">Value</div>
          </div>

          {/* Scrollable Rows */}
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-white/[0.02]">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs">
                No developers found matching "{searchQuery}"
              </div>
            ) : (
              filtered.map((user, index) => {
                const isTopThree = user.rank <= 3;
                return (
                  <div
                    key={user._id}
                    className={`grid grid-cols-12 items-center px-6 py-3.5 transition-all
                      ${user.isCurrentUser
                        ? "bg-violet-500/[0.04] border-l-2 border-l-violet-500"
                        : "hover:bg-white/[0.01]"
                      }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2">
                      <div className={`w-6 h-6 flex items-center justify-center font-black text-[10px] rounded-lg border
                        ${user.rank === 1 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : ""}
                        ${user.rank === 2 ? "bg-zinc-400/10 border-zinc-400/20 text-zinc-300" : ""}
                        ${user.rank === 3 ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : ""}
                        ${user.rank > 3 ? "bg-white/5 border-white/[0.04] text-zinc-500" : ""}
                      `}>
                        {user.rank}
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="col-span-5 flex items-center gap-3">
                      <AvatarRenderer 
                        avatar={user.avatar} 
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" 
                        colorClass={user.isCurrentUser ? "from-emerald-400 to-emerald-600" : avatarColors[index % avatarColors.length]}
                      />
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-semibold text-xs truncate ${user.isCurrentUser ? "text-violet-300" : "text-zinc-200"}`}>
                            {user.username || user.name}
                          </span>
                          {user.plan?.toLowerCase() === "pro" && (
                            <span className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[8px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0">
                              PRO
                            </span>
                          )}
                          {user.isCurrentUser && (
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded font-bold shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="col-span-3 flex items-center gap-1.5">
                      <Flame className={`w-3.5 h-3.5 ${user.streak > 0 ? "text-orange-500 animate-pulse" : "text-zinc-600"}`} />
                      <span className={`text-xs ${user.streak > 0 ? "text-zinc-200" : "text-zinc-500 font-medium"}`}>
                        {user.streak || 0}d
                      </span>
                    </div>

                    {/* Value */}
                    <div className="col-span-2 text-right">
                      <div className={`font-bold text-xs ${isTopThree ? "text-white" : "text-zinc-300"}`}>
                        {getValue(user)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Current User placement row */}
          {currentUser && (
            <div className="border-t border-white/[0.06] bg-[#121217]/95 backdrop-blur-md px-6 py-3 flex items-center justify-between z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Your Position</span>
                <div className="bg-violet-500/10 border border-violet-500/20 text-violet-300 font-extrabold px-2 py-0.5 rounded-lg text-xs">
                  #{currentUser.rank}
                </div>
                <AvatarRenderer 
                  avatar={currentUser.avatar} 
                  className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[10px]" 
                  colorClass="from-emerald-400 to-emerald-600"
                />
                <span className="text-xs font-semibold text-white">You</span>
                {currentUser.plan?.toLowerCase() === "pro" && (
                  <span className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[8px] font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                    PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs text-zinc-300 font-medium">{currentUser.streak}d</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-violet-300">{getValue(currentUser)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}