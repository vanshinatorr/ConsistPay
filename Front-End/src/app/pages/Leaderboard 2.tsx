import { Code2, ArrowLeft, TrendingUp, Award, Flame, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type Tab = "streak" | "consistency" | "completed";

const allUsers = [
  { rank: 1, name: "Sarah Chen", avatar: "SC", streak: 156, consistency: 98, completed: 312, isCurrentUser: false },
  { rank: 2, name: "Alex Kumar", avatar: "AK", streak: 134, consistency: 96, completed: 289, isCurrentUser: false },
  { rank: 3, name: "Jordan Smith", avatar: "JS", streak: 98, consistency: 94, completed: 241, isCurrentUser: false },
  { rank: 4, name: "Priya Patel", avatar: "PP", streak: 91, consistency: 92, completed: 198, isCurrentUser: false },
  { rank: 5, name: "Dev Sharma", avatar: "DS", streak: 87, consistency: 90, completed: 187, isCurrentUser: false },
  { rank: 6, name: "Rahul Gupta", avatar: "RG", streak: 76, consistency: 88, completed: 165, isCurrentUser: false },
  { rank: 7, name: "Ananya Rao", avatar: "AR", streak: 68, consistency: 85, completed: 154, isCurrentUser: false },
  { rank: 8, name: "You", avatar: "YU", streak: 47, consistency: 82, completed: 98, isCurrentUser: true },
  { rank: 9, name: "Kabir Singh", avatar: "KS", streak: 43, consistency: 79, completed: 91, isCurrentUser: false },
  { rank: 10, name: "Neha Joshi", avatar: "NJ", streak: 38, consistency: 75, completed: 84, isCurrentUser: false },
];

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

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>("streak");

  const sorted = [...allUsers].sort((a, b) => {
    if (activeTab === "streak") return b.streak - a.streak;
    if (activeTab === "consistency") return b.consistency - a.consistency;
    return b.completed - a.completed;
  }).map((u, i) => ({ ...u, rank: i + 1 }));

  const currentUser = sorted.find(u => u.isCurrentUser)!;

  const tabs: { key: Tab; label: string; icon: typeof Flame }[] = [
    { key: "streak", label: "Streak", icon: Flame },
    { key: "consistency", label: "Consistency", icon: TrendingUp },
    { key: "completed", label: "Completed", icon: Target },
  ];

  const getValue = (user: typeof allUsers[0]) => {
    if (activeTab === "streak") return `${user.streak} days`;
    if (activeTab === "consistency") return `${user.consistency}/100`;
    return `${user.completed} days`;
  };

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
          <div className="relative bg-violet-500/10 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs mb-3 uppercase tracking-wider">Your Position</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-bold text-violet-300">
                  #{currentUser.rank}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold">
                  YU
                </div>
                <div>
                  <div className="font-bold text-violet-300">You</div>
                  <div className="text-xs text-zinc-400">🔥 {currentUser.streak} day streak</div>
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
            <div className="relative bg-white/5 border border-zinc-400/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🥈</div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">
                {sorted[1]?.avatar}
              </div>
              <div className="font-semibold text-sm truncate">{sorted[1]?.name}</div>
              <div className="text-xs text-zinc-400 mt-1">{getValue(sorted[1])}</div>
            </div>
          </div>

          {/* 1st */}
          <div className="relative -mt-2">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">🥇</div>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                {sorted[0]?.avatar}
              </div>
              <div className="font-bold truncate">{sorted[0]?.name}</div>
              <div className="text-xs text-yellow-400 mt-1 font-semibold">{getValue(sorted[0])}</div>
            </div>
          </div>

          {/* 3rd */}
          <div className="relative mt-6">
            <div className="absolute inset-0 bg-orange-500/10 rounded-2xl blur-lg opacity-60" />
            <div className="relative bg-white/5 border border-orange-500/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🥉</div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">
                {sorted[2]?.avatar}
              </div>
              <div className="font-semibold text-sm truncate">{sorted[2]?.name}</div>
              <div className="text-xs text-zinc-400 mt-1">{getValue(sorted[2])}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
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
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {sorted.map((user, index) => (
              <div
                key={user.name}
                className={`flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-0 transition-all
                  ${user.isCurrentUser
                    ? "bg-violet-500/10 border-l-2 border-l-violet-500"
                    : "hover:bg-white/3"
                  }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-lg
                    ${user.rank === 1 ? "bg-yellow-500/20 text-yellow-400" : ""}
                    ${user.rank === 2 ? "bg-zinc-400/20 text-zinc-300" : ""}
                    ${user.rank === 3 ? "bg-orange-500/20 text-orange-400" : ""}
                    ${user.rank > 3 ? "bg-white/10 text-zinc-400" : ""}
                  `}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-br
                    ${user.isCurrentUser ? "from-emerald-400 to-emerald-600" : avatarColors[index % avatarColors.length]}
                  `}>
                    {user.avatar}
                  </div>

                  {/* Name */}
                  <div>
                    <div className={`font-semibold ${user.isCurrentUser ? "text-violet-300" : ""}`}>
                      {user.name}
                      {user.isCurrentUser && <span className="ml-2 text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">You</span>}
                    </div>
                    <div className="text-xs text-zinc-500">🔥 {user.streak} day streak</div>
                  </div>
                </div>

                {/* Value */}
                <div className="text-right">
                  <div className={`font-bold ${user.rank <= 3 ? "text-white" : "text-zinc-300"}`}>
                    {getValue(user)}
                  </div>
                  {user.rank <= 3 && (
                    <div className="text-xs text-zinc-500">
                      {user.rank === 1 ? "👑 Leader" : `#${user.rank}`}
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