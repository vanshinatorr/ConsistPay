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
  useEffect(() => {
    document.title = "Leaderboard | ConsistPay";
  }, []);
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
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0D0D0F] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
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
    <div className="min-h-screen text-zinc-800 dark:text-white pb-12 bg-zinc-50 dark:bg-[#0D0D0F]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] dark:opacity-100 opacity-30" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] dark:opacity-100 opacity-30" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-white/[0.04] bg-white/80 dark:bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-zinc-550 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors">
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

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-xs text-yellow-600 dark:text-yellow-305 mb-3 shadow-[0_0_15px_rgba(234,179,8,0.05)]">
            <Award className="w-3.5 h-3.5" />
            Global Leaderboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight text-zinc-850 dark:text-white">
            Compete with the{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Best
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">See where you rank among all developers on the platform</p>
        </div>

        {/* Top 3 Performers Row (Horizontal Card Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 2nd Place */}
          <div className="relative bg-white dark:bg-[#121217]/50 border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-4.5 backdrop-blur-xl shadow-md dark:shadow-lg flex items-center justify-between overflow-hidden group hover:scale-[1.01] hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AvatarRenderer 
                  avatar={sorted[1]?.avatar || "US"} 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-slate-500/20 ring-offset-2 ring-offset-white dark:ring-offset-[#0F0F13]" 
                  colorClass="from-slate-400 to-slate-650"
                />
                <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-zinc-100 dark:bg-[#1b1b22] text-[9px] font-black text-zinc-600 dark:text-slate-300 flex items-center justify-center rounded-full border border-zinc-250 dark:border-slate-500/30">
                  2
                </span>
              </div>
              <div>
                <div className="font-extrabold text-xs text-zinc-800 dark:text-white truncate max-w-[85px] sm:max-w-[100px]">
                  {sorted[1]?.username || sorted[1]?.name || "Empty Slot"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold mt-0.5">{getValue(sorted[1])}</div>
                <span className="inline-block text-[8px] text-slate-600 dark:text-slate-300 font-black bg-slate-500/5 dark:bg-slate-500/10 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-500/20 mt-1 uppercase tracking-wider">
                  2nd Place
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 flex items-center justify-center border border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.15)] shrink-0 select-none relative group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-full opacity-35" />
              <Trophy className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          {/* 1st Place */}
          <div className="relative bg-gradient-to-r from-yellow-500/[0.08] via-amber-500/5 to-transparent dark:from-yellow-500/[0.06] dark:via-[#161622]/40 dark:to-transparent border border-yellow-500/20 dark:border-yellow-500/30 rounded-2xl p-4.5 backdrop-blur-xl shadow-md dark:shadow-lg flex items-center justify-between overflow-hidden group hover:scale-[1.01] hover:border-yellow-500/45 transition-all duration-300">
            {/* Subtle gold radial background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.03] rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <AvatarRenderer 
                  avatar={sorted[0]?.avatar || "US"} 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-yellow-500/50 ring-offset-2 ring-offset-white dark:ring-offset-[#0F0F13]" 
                  colorClass="from-amber-400 to-yellow-600"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-100 dark:bg-[#1b1b22] text-[9px] font-black text-amber-800 dark:text-yellow-450 flex items-center justify-center rounded-full border border-amber-200 dark:border-yellow-500/35">
                  1
                </span>
              </div>
              <div>
                <div className="font-black text-xs truncate max-w-[85px] sm:max-w-[100px] flex items-center gap-1">
                  <span className="bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-yellow-100 dark:via-yellow-200 dark:to-amber-300 bg-clip-text text-transparent font-black">
                    {sorted[0]?.username || sorted[0]?.name || "Empty Slot"}
                  </span>
                </div>
                <div className="text-[10px] text-amber-700 dark:text-yellow-500/80 font-bold mt-0.5">{getValue(sorted[0])}</div>
                <span className="inline-block text-[8px] text-amber-700 dark:text-yellow-400 font-black bg-amber-500/10 dark:bg-yellow-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 dark:border-yellow-500/20 mt-1 uppercase tracking-wider">
                  Leader
                </span>
              </div>
            </div>
            <div className="w-10.5 h-10.5 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 flex items-center justify-center border border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.25)] shrink-0 select-none relative group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-full opacity-40" />
              <Crown className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="relative bg-white dark:bg-[#121217]/50 border border-zinc-200 dark:border-white/[0.04] rounded-2xl p-4.5 backdrop-blur-xl shadow-md dark:shadow-lg flex items-center justify-between overflow-hidden group hover:scale-[1.01] hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AvatarRenderer 
                  avatar={sorted[2]?.avatar || "US"} 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-orange-500/20 ring-offset-2 ring-offset-white dark:ring-offset-[#0F0F13]" 
                  colorClass="from-amber-600 to-orange-705"
                />
                <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-orange-100 dark:bg-[#1b1b22] text-[9px] font-black text-orange-850 dark:text-orange-400 flex items-center justify-center rounded-full border border-orange-200 dark:border-orange-500/30">
                  3
                </span>
              </div>
              <div>
                <div className="font-extrabold text-xs text-zinc-800 dark:text-white truncate max-w-[85px] sm:max-w-[100px]">
                  {sorted[2]?.username || sorted[2]?.name || "Empty Slot"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold mt-0.5">{getValue(sorted[2])}</div>
                <span className="inline-block text-[8px] text-orange-600 dark:text-orange-400 font-black bg-orange-500/10 px-1.5 py-0.2 rounded border border-orange-200 dark:border-orange-500/20 mt-1 uppercase tracking-wider">
                  3rd Place
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 via-amber-600 to-amber-800 flex items-center justify-center border border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] shrink-0 select-none relative group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-full opacity-35" />
              <Medal className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>

        {/* My Position Row Card (Prominent display above list, similar to Codolio) */}
        {currentUser && (
          <div className="relative bg-gradient-to-r from-violet-500/[0.08] to-transparent border border-violet-500/20 rounded-2xl p-4 mb-6 overflow-hidden backdrop-blur-md flex items-center justify-between shadow-[0_4px_20px_rgba(139,92,246,0.03)]">
            {/* Decorative left label */}
            <div className="absolute top-0 left-0 bg-violet-600/90 text-white text-[8px] font-black px-2.5 py-0.8 rounded-br-lg tracking-widest uppercase border-r border-b border-violet-500/20 shadow-md">
              My Position
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="relative">
                <AvatarRenderer 
                  avatar={currentUser.avatar} 
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-violet-500/30 ring-offset-2 ring-offset-white dark:ring-offset-[#0F0F13]" 
                  colorClass="from-emerald-400 to-emerald-600"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-600 text-white-force text-[9px] font-black flex items-center justify-center rounded-full border border-violet-500/40">
                  #{currentUser.rank}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-zinc-800 dark:text-white">
                    {currentUser.username || currentUser.name}
                  </span>
                  {currentUser.plan?.toLowerCase() === "pro" && (
                    <span className="bg-violet-500/25 border border-violet-500/30 text-violet-650 dark:text-violet-300 text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                      PRO
                    </span>
                  )}
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded font-black uppercase">
                    YOU
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Keep updating your streak to secure payouts!</p>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-8 text-right mt-2">
              <div>
                <div className="text-[9px] font-black text-zinc-555 dark:text-zinc-500 uppercase tracking-wider">Current Streak</div>
                <div className="text-xs font-extrabold text-zinc-850 dark:text-white flex items-center gap-1 mt-0.5 justify-end">
                  <Flame className="w-3.5 h-3.5 text-orange-450" />
                  <span>{currentUser.streak} days</span>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-black text-zinc-555 dark:text-zinc-500 uppercase tracking-wider">Value</div>
                <div className="text-xs font-black text-violet-600 dark:text-violet-300 mt-0.5">{getValue(currentUser)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs & Search Bar integrated Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.04] pb-2.5 sm:pb-0 mb-5 gap-3">
          {/* Tabs */}
          <div className="flex gap-6">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 sm:pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer
                  ${activeTab === key ? "text-violet-400 font-extrabold" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {label}
                {activeTab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-48 md:w-64 mb-1.5 sm:mb-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/[0.04] rounded-lg text-xs text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/10 transition-all animate-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Leaderboard Table Container */}
        <div className="relative bg-white dark:bg-[#0F0F13] border border-zinc-200 dark:border-white/[0.04] rounded-2xl overflow-hidden shadow-md dark:shadow-2xl flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-3 sm:px-6 py-3 border-b border-zinc-200 dark:border-white/[0.04] text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-50/50 dark:bg-white/[0.01]">
            <div className="col-span-2">Rank</div>
            <div className="col-span-5">Developer</div>
            <div className="col-span-3">Streak</div>
            <div className="col-span-2 text-right">Value</div>
          </div>

          {/* Scrollable Rows */}
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-zinc-200 dark:divide-white/[0.02]">
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
                    className={`grid grid-cols-12 items-center px-3 sm:px-6 py-3.5 transition-all
                      ${user.isCurrentUser
                        ? "bg-violet-500/[0.04] dark:bg-violet-500/[0.08] border-l-2 border-l-violet-500 shadow-sm"
                        : "hover:bg-zinc-50/50 dark:hover:bg-white/[0.01]"
                      }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2">
                      <div className={`w-5.5 h-5.5 sm:w-6 sm:h-6 flex items-center justify-center font-black text-[10px] rounded-lg border
                        ${user.rank === 1 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-550 dark:text-yellow-400" : ""}
                        ${user.rank === 2 ? "bg-zinc-400/10 border-zinc-400/20 text-zinc-600 dark:text-zinc-305" : ""}
                        ${user.rank === 3 ? "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400" : ""}
                        ${user.rank > 3 ? "bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/[0.04] text-zinc-500" : ""}
                      `}>
                        {user.rank}
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="col-span-5 flex items-center gap-1.5 sm:gap-3 min-w-0">
                      <AvatarRenderer 
                        avatar={user.avatar} 
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0" 
                        colorClass={user.isCurrentUser ? "from-emerald-400 to-emerald-600" : avatarColors[index % avatarColors.length]}
                      />
                      <div className="truncate pr-1">
                        <div className="flex items-center gap-1">
                          <span className={`font-semibold text-xs truncate ${user.isCurrentUser ? "text-violet-605 dark:text-violet-300" : "text-zinc-700 dark:text-zinc-205"}`}>
                            {user.username || user.name}
                          </span>
                          {user.plan?.toLowerCase() === "pro" && (
                            <span className="bg-violet-500/10 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-300 text-[7px] sm:text-[8px] font-black px-1 py-0.2 rounded uppercase shrink-0">
                              PRO
                            </span>
                          )}
                          {user.isCurrentUser && (
                            <span className="text-[7px] sm:text-[8px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-305 border border-emerald-200 dark:border-emerald-500/20 px-1 py-0.2 rounded font-bold shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="col-span-3 flex items-center gap-1">
                      <Flame className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${user.streak > 0 ? "text-orange-500 animate-pulse" : "text-zinc-400 dark:text-zinc-600"}`} />
                      <span className={`text-[11px] sm:text-xs ${user.streak > 0 ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-400 dark:text-zinc-550 font-medium"}`}>
                        {user.streak || 0}d
                      </span>
                    </div>

                    {/* Value */}
                    <div className="col-span-2 text-right">
                      <div className={`font-bold text-[11px] sm:text-xs ${isTopThree ? "text-zinc-800 dark:text-white" : "text-zinc-650 dark:text-zinc-300"}`}>
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
            <div className="border-t border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-[#121217]/95 backdrop-blur-md px-3 sm:px-6 py-3 flex items-center justify-between z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.3)] gap-2">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest hidden sm:inline-block">Your Position</span>
                <div className="bg-violet-500/10 border border-violet-500/20 text-violet-605 dark:text-violet-300 font-extrabold px-2 py-0.5 rounded-lg text-xs shrink-0">
                  #{currentUser.rank}
                </div>
                <AvatarRenderer 
                  avatar={currentUser.avatar} 
                  className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[10px]" 
                  colorClass="from-emerald-400 to-emerald-600"
                />
                <span className="text-xs font-semibold text-zinc-850 dark:text-white">You</span>
                {currentUser.plan?.toLowerCase() === "pro" && (
                  <span className="bg-violet-500/10 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-300 text-[8px] font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                    PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 sm:gap-5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-455" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">{currentUser.streak}d</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-violet-600 dark:text-violet-300">{getValue(currentUser)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}