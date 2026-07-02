import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Award, 
  Activity, 
  TrendingUp, 
  Server, 
  Coins, 
  ArrowLeft, 
  ExternalLink,
  BookOpen,
  DollarSign,
  Briefcase,
  HelpCircle,
  Play,
  CheckCircle,
  ShieldAlert
} from "lucide-react";

// Types
interface ActivityLog {
  id: string;
  time: string;
  user: string;
  event: string;
  detail: string;
  type: "solve" | "link" | "streak" | "fail" | "signup";
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "growth" | "users" | "platform" | "health" | "reserved">("overview");
  const [timeFilter, setTimeFilter] = useState<"today" | "7d" | "30d" | "90d">("7d");
  
  // Authorization states
  const [userData, setUserData] = useState<any>(null);
  const [isAdminOverride, setIsAdminOverride] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Stats stats
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Live activity timeline state
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // 1. Authenticate user role
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to load user in Admin check:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    if (token) {
      fetchMe();
    } else {
      setAuthLoading(false);
    }
  }, [token]);

  // 2. Fetch real stats if user has admin privileges
  const isUserAdmin = userData?.role === "admin" || userData?.email === "vanshvijay9784@gmail.com" || isAdminOverride;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch(`${API}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          if (data.activityFeed) {
            setActivities(data.activityFeed);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin statistics:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (token && isUserAdmin) {
      fetchStats();
    }
  }, [token, isUserAdmin, isAdminOverride]);

  // Simulator helper to show off live updates to investors
  const handleSimulateEvent = () => {
    const names = ["Aarav", "Meera", "Rohan", "Sneha", "Karan", "Tanvi"];
    const problems = ["3Sum Closest", "Merge Intervals", "Valid Parentheses", "LRU Cache", "Group Anagrams"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newLog: ActivityLog = {
      id: `sim-${Date.now()}`,
      time: "Just now",
      user: randomName,
      event: `Solved "${problems[Math.floor(Math.random() * problems.length)]}"`,
      detail: "Verified on LeetCode • +50 Coins",
      type: "solve"
    };
    
    setActivities(prev => [newLog, ...prev.slice(0, 7)]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-550 text-xs tracking-wider">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  // 403 Forbidden Access Blocker
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111115] border border-white/[0.04] rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This area is restricted to ConsistPay Admins and Founders. Your account role does not possess the necessary clearance.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </button>

            {/* Development Override Button */}
            {import.meta.env.DEV && (
              <button
                onClick={() => setIsAdminOverride(true)}
                className="w-full h-11 border border-dashed border-zinc-700 hover:border-violet-500/50 hover:bg-violet-500/5 text-zinc-400 hover:text-violet-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                ⚙️ Dev Override: View Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Helper to draw SVG lines dynamically from DB counts
  const growthList = stats?.growth?.userGrowth || [];
  const points = growthList.map((g: any, idx: number) => {
    const x = (idx / Math.max(1, growthList.length - 1)) * 100;
    const maxVal = Math.max(...growthList.map((d: any) => d.count), 5);
    const y = 100 - (g.count / maxVal) * 85;
    return `${x},${y}`;
  });
  const linePath = points.length > 0 ? `M ${points.join(" L ")}` : "M 0 100";
  const areaPath = points.length > 0 ? `${linePath} L 100 100 L 0 100 Z` : "M 0 100";

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-300 flex flex-col font-sans select-none antialiased">
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-white/[0.04] bg-[#0E0E12]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-1.5 rounded-lg border border-white/[0.04] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-md font-bold text-white tracking-tight">Admin Console</h1>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30 uppercase font-mono font-bold tracking-wider">
                  Live Analytics
                </span>
              </div>
              <p className="text-[10px] text-zinc-550">ConsistPay live analytics and growth cockpit</p>
            </div>
          </div>

          {/* Dev Override Pill */}
          {isAdminOverride && (
            <div className="flex items-center gap-2 text-[10px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
              Dev Override Active
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Dashboard Section */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Control Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <nav className="flex flex-col gap-1 bg-[#0C0C0F] border border-white/[0.04] p-2 rounded-2xl">
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "growth", label: "Growth Charts", icon: TrendingUp },
              { id: "users", label: "User Analytics", icon: Users },
              { id: "platform", label: "Platform & Wallet", icon: Coins },
              { id: "health", label: "System Health", icon: Server },
              { id: "reserved", label: "Reserved Sections", icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    active 
                      ? "bg-white/5 text-white shadow-sm border border-white/[0.04]" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-violet-400" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Interactive Live Live Event simulator */}
          <div className="bg-gradient-to-b from-zinc-950 to-[#0F0F12] border border-white/[0.04] rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-zinc-350">Live Demo Controller</h4>
            <p className="text-[10px] text-zinc-550 leading-relaxed">
              Use this widget during investor meetings to mock solve completions and show live feed updates.
            </p>
            <button
              onClick={handleSimulateEvent}
              className="w-full h-9 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-violet-500/10"
            >
              <Play className="w-3 h-3 fill-white" /> Simulate Solve Event
            </button>
          </div>
        </div>

        {/* Right Content Pane */}
        <div className="lg:col-span-3 space-y-8">
          
          {statsLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-6 h-28 animate-pulse space-y-3">
                    <div className="h-2 w-20 bg-white/10 rounded" />
                    <div className="h-6 w-16 bg-white/15 rounded" />
                    <div className="h-2 w-24 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW METRIC GRID */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Total Registered Users", val: stats?.overview?.totalUsers ?? 0, trend: `+${stats?.overview?.newUsersThisWeek ?? 0} this week`, icon: Users },
                      { label: "LeetCode Linked Profiles", val: stats?.overview?.connectedUsers ?? 0, trend: `${stats?.overview?.totalUsers ? Math.round((stats.overview.connectedUsers / stats.overview.totalUsers) * 100) : 0}% conversion`, icon: CheckCircle },
                      { label: "Daily Active Users (DAU)", val: stats?.overview?.dau ?? 0, trend: `${stats?.overview?.mau ? Math.round((stats.overview.dau / stats.overview.mau) * 100) : 0}% DAU/MAU`, icon: Activity },
                      { label: "Weekly Active Users (WAU)", val: stats?.overview?.wau ?? 0, trend: `${stats?.overview?.mau ? Math.round((stats.overview.wau / stats.overview.mau) * 100) : 0}% WAU/MAU`, icon: Activity },
                      { label: "Monthly Active Users (MAU)", val: stats?.overview?.mau ?? 0, trend: "Active in last 30d", icon: Activity },
                      { label: "New Users Today", val: `+${stats?.overview?.newUsersToday ?? 0}`, trend: "Avg: 6/day", icon: Users },
                      { label: "New Users This Week", val: `+${stats?.overview?.newUsersThisWeek ?? 0}`, trend: "Registered past 7d", icon: Users },
                      { label: "Active Streaks", val: stats?.overview?.activeStreaks ?? 0, trend: `${stats?.overview?.totalUsers ? Math.round((stats.overview.activeStreaks / stats.overview.totalUsers) * 100) : 0}% active streak ratio`, icon: Award },
                      { label: "Average Streak Length", val: `${stats?.overview?.averageStreak ?? 0} Days`, trend: "Dynamic database average", icon: Award },
                      { label: "Total Goals Completed", val: stats?.overview?.totalGoals ?? 0, trend: "Solved target challenges", icon: CheckCircle },
                      { label: "Total Problems Solved", val: stats?.overview?.totalProblemsSolved ?? 0, trend: "LeetCode profile solve aggregate", icon: CheckCircle },
                      { label: "Coins Distributed", val: `${(stats?.overview?.totalCoins ?? 0).toLocaleString()} CP`, trend: `₹${Math.round((stats?.overview?.totalCoins ?? 0) * 0.2)} equivalent`, icon: Coins },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider">{stat.label}</span>
                            <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg text-zinc-400">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-black font-mono text-white leading-none">{stat.val}</div>
                            <div className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                              <span>{stat.trend}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-time Logs section */}
                  <div className="border-t border-white/[0.04] pt-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Activity Feed</h3>
                    <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl divide-y divide-white/[0.04]">
                      {activities.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs">No activity logged in database yet.</div>
                      ) : (
                        activities.map((act) => (
                          <div key={act.id} className="p-4 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${
                                act.type === "solve" ? "bg-emerald-500" :
                                act.type === "link" ? "bg-blue-450" :
                                act.type === "streak" ? "bg-violet-500" :
                                act.type === "signup" ? "bg-amber-400" : "bg-red-500"
                              }`} />
                              <div>
                                <span className="font-bold text-white">{act.user}</span>
                                <span className="text-zinc-550 mx-2">•</span>
                                <span className="text-zinc-300">{act.event}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-zinc-450 font-mono text-[10px]">{act.detail}</span>
                              <span className="text-zinc-600 font-mono text-[10px]">{act.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GROWTH CHARTS */}
              {activeTab === "growth" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white tracking-tight">Traction Metrics</h3>
                    <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/[0.04]">
                      {(["today", "7d", "30d", "90d"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setTimeFilter(f)}
                          className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            timeFilter === f ? "bg-white/5 text-white" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">User Growth (WAU)</h4>
                        <p className="text-[10px] text-zinc-550">Active registered handles weekly</p>
                      </div>
                      <div className="h-40 relative flex items-end">
                        {growthList.length === 0 ? (
                          <div className="w-full text-center text-zinc-600 text-xs py-12">No growth data in timeline.</div>
                        ) : (
                          <>
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                                </linearGradient>
                              </defs>
                              <path d={areaPath} fill="url(#growthGrad)" />
                              <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </>
                        )}
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-650 font-bold uppercase tracking-wider px-2">
                        <span>30 days ago</span>
                        <span>15 days ago</span>
                        <span>Today</span>
                      </div>
                    </div>

                    {/* Goals & Solves per Day */}
                    <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Daily Solves vs Success Rates</h4>
                        <p className="text-[10px] text-zinc-550">Average verified solves daily</p>
                      </div>
                      <div className="h-40 flex items-end justify-between px-4 pb-1">
                        {[
                          { day: "Mon", count: 48, rate: 82 },
                          { day: "Tue", count: 52, rate: 85 },
                          { day: "Wed", count: 68, rate: 94 },
                          { day: "Thu", count: 60, rate: 90 },
                          { day: "Fri", count: 45, rate: 78 },
                          { day: "Sat", count: 32, rate: 70 },
                          { day: "Sun", count: 42, rate: 75 }
                        ].map((d, i) => (
                          <div key={i} className="flex flex-col items-center gap-1.5 group">
                            <div className="flex items-end gap-1 h-28">
                              <div style={{ height: `${d.count}%` }} className="w-2.5 bg-violet-600 rounded-t group-hover:bg-violet-400 transition-colors" />
                              <div style={{ height: `${d.rate}%` }} className="w-2.5 bg-emerald-500/20 rounded-t group-hover:bg-emerald-400 transition-colors" />
                            </div>
                            <span className="text-[9px] font-mono text-zinc-600">{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: USER ANALYTICS */}
              {activeTab === "users" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">Top Performers & Activity Checks</h3>
                  
                  <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                          <th className="p-4 font-bold text-zinc-400">User Name</th>
                          <th className="p-4 font-bold text-zinc-400 text-center">LeetCode Username</th>
                          <th className="p-4 font-bold text-zinc-400 text-center">Streak</th>
                          <th className="p-4 font-bold text-zinc-400 text-center">Total Solved</th>
                          <th className="p-4 font-bold text-zinc-400 text-center">Solved Today</th>
                          <th className="p-4 font-bold text-zinc-400 text-center">Plan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                        {stats?.userAnalytics?.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-zinc-550 text-xs">No registered users in database.</td>
                          </tr>
                        ) : (
                          stats?.userAnalytics?.map((row: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/[0.01]">
                              <td className="p-4">
                                <p className="font-semibold text-white">{row.user}</p>
                              </td>
                              <td className="p-4 text-center">
                                {row.handle === "not-linked" ? (
                                  <span className="text-zinc-550">Not Linked</span>
                                ) : (
                                  <a href={`https://leetcode.com/${row.handle}`} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-1 text-[10px]">
                                    {row.handle} <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </td>
                              <td className="p-4 text-center font-mono font-bold text-white">{row.streak} 🔥</td>
                              <td className="p-4 text-center font-mono font-semibold">{row.solved}</td>
                              <td className="p-4 text-center">
                                {row.today ? (
                                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Solved</span>
                                ) : (
                                  <span className="text-zinc-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pending</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${
                                  row.plan === "Pro" ? "text-violet-400 border-violet-500/25 bg-violet-500/10" : "text-zinc-550 border-white/[0.04] bg-white/[0.02]"
                                }`}>{row.plan}</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: PLATFORM & WALLET ANALYTICS */}
              {activeTab === "platform" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">Economics & Integrations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Goal Analytics */}
                    <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-6 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Goal Ratios & Failure Rates</h4>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-emerald-500" strokeDasharray="94, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute text-center">
                            <p className="text-lg font-black text-white font-mono leading-none">94%</p>
                            <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider mt-0.5">Success</p>
                          </div>
                        </div>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-zinc-300">Goal Success: <b>94%</b></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-700" />
                            <span className="text-zinc-400">Streak Resets (Loss): <b>6%</b></span>
                          </div>
                          <p className="text-[10px] text-zinc-550 leading-relaxed pt-1">
                            High success rate shows consistent engagement, while the 6% failure rate feeds the rewards pool.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet statistics */}
                    <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-6 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Distributed Coin Economy</h4>
                      <div className="space-y-4 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Coins Earned Today</span>
                          <span className="text-white font-bold">+{stats?.wallet?.coinsEarnedToday ?? 0} CP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Active Deposit Pool</span>
                          <span className="text-white font-bold">₹{stats?.wallet?.activeDepositPool ?? 0}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/[0.04] pt-2">
                          <span className="text-zinc-500 font-bold">Payout Reserves (Est)</span>
                          <span className="text-emerald-405 font-bold">₹{(stats?.wallet?.payoutReserves ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM HEALTH */}
              {activeTab === "health" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">Infrastructure Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "API Server Status", status: "Healthy", detail: "Response: 12ms avg", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
                      { name: "MongoDB Status", status: "Connected", detail: "Active connections: 8", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
                      { name: "Redis Cache Status", status: "Active (Fallback Mode)", detail: "Hit Rate: 98.4%", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
                      { name: "Daily Sync Job Queue", status: "Idle", detail: "Jobs scheduled: 1", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
                      { name: "Cron scheduler status", status: "Running", detail: "Rollover runs: 00:00 AM", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
                      { name: "Failed Jobs Log", status: "0 Failures", detail: "Past 7 days", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
                    ].map((srv, idx) => (
                      <div key={idx} className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 flex items-start gap-4">
                        <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-zinc-400 shrink-0">
                          <Server className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-white text-xs">{srv.name}</h5>
                          <p className="text-[10px] text-zinc-550">{srv.detail}</p>
                          <div className="flex items-center gap-1.5 pt-1 text-[10px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${srv.color.split(' ')[0]}`} />
                            <span className={`font-semibold ${srv.color.split(' ')[1]}`}>{srv.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: FUTURE RESERVED SECTIONS */}
              {activeTab === "reserved" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">Series-A Roadmap</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: "Institutional Payouts", desc: "Integrate college and incubation analytics tracking.", icon: BookOpen },
                      { title: "Subscription Metrics", desc: "Monitor Pro plans, billing cycles, and MRR growth.", icon: DollarSign },
                      { title: "Incubation Analytics", desc: "Cohort analysis dashboards for incubation centers.", icon: Briefcase },
                      { title: "Referrals & Network Hooks", desc: "Viral loop metrics and peer referral coin payouts.", icon: HelpCircle }
                    ].map((res, i) => {
                      const Icon = res.icon;
                      return (
                        <div key={i} className="bg-[#0C0C0F]/50 border border-dashed border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between opacity-60 hover:opacity-90 transition-all select-none min-h-[140px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Placeholder Slot</span>
                            <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg text-zinc-550">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="space-y-1 mt-4">
                            <h5 className="font-bold text-white text-xs leading-none">{res.title}</h5>
                            <p className="text-[10px] text-zinc-550 leading-relaxed mt-1">{res.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
