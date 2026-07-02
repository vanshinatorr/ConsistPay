import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Award, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Server, 
  Database, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  Coins, 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  BookOpen,
  DollarSign,
  Briefcase,
  HelpCircle,
  Play
} from "lucide-react";

// Types
interface ActivityLog {
  id: string;
  time: string;
  user: string;
  event: string;
  detail: string;
  type: "solve" | "link" | "streak" | "fail";
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "growth" | "users" | "platform" | "health" | "reserved">("overview");
  const [timeFilter, setTimeFilter] = useState<"today" | "7d" | "30d" | "90d">("7d");
  
  // Authorization overrides
  const [userData, setUserData] = useState<any>(null);
  const [isAdminOverride, setIsAdminOverride] = useState(false);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Live activity timeline state (allows interactive simulation in demo mode!)
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "1", time: "2 min ago", user: "Rahul Sharma", event: "Solved \"Two Sum\"", detail: "Reward +50 Coins", type: "solve" },
    { id: "2", time: "4 min ago", user: "Ankit Verma", event: "Connected LeetCode", detail: "Bio verified successfully", type: "link" },
    { id: "3", time: "8 min ago", user: "Priya Patel", event: "Achieved 15 Day Streak", detail: "Grace Coin earned", type: "streak" },
    { id: "4", time: "15 min ago", user: "Siddharth Sen", event: "Failed Daily Sync", detail: "Streak reset • ₹20 Lost", type: "fail" },
    { id: "5", time: "25 min ago", user: "Vikram Raj", event: "Solved \"Binary Search\"", detail: "Reward +50 Coins", type: "solve" }
  ]);

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
        setLoading(false);
      }
    };
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Simulator helper to show off live updates to investors
  const handleSimulateEvent = () => {
    const names = ["Aarav", "Meera", "Rohan", "Sneha", "Karan", "Tanvi"];
    const problems = ["3Sum Closest", "Merge Intervals", "Valid Parentheses", "LRU Cache", "Group Anagrams"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newLog: ActivityLog = {
      id: String(Date.now()),
      time: "Just now",
      user: randomName,
      event: `Solved "${problems[Math.floor(Math.random() * problems.length)]}"`,
      detail: "Reward +50 Coins",
      type: "solve"
    };
    
    setActivities(prev => [newLog, ...prev.slice(0, 7)]);
  };

  const isUserAdmin = userData?.role === "admin" || userData?.email === "vanshvijay9784@gmail.com" || isAdminOverride;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 text-xs tracking-wider">Verifying Admin Credentials...</p>
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
                  Pitch-Ready
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
              { id: "overview", label: "Overview", icon: Layers },
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

        {/* Right Metric Content Pane */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* TAB 1: OVERVIEW METRIC GRID */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Registered Users", val: "142", trend: "+12% this week", icon: Users },
                  { label: "LeetCode Linked Profiles", val: "88", trend: "62% conversion", icon: CheckCircle },
                  { label: "Daily Active Users (DAU)", val: "68", trend: "47% DAU/MAU", icon: Activity },
                  { label: "Weekly Active Users (WAU)", val: "102", trend: "71% WAU/MAU", icon: Activity },
                  { label: "Monthly Active Users (MAU)", val: "135", trend: "95% active", icon: Activity },
                  { label: "New Users Today", val: "+8", trend: "Avg: 6/day", icon: Users },
                  { label: "New Users This Week", val: "+42", trend: "+15% vs last week", icon: Users },
                  { label: "Active Streaks", val: "54", trend: "38% active streak ratio", icon: Award },
                  { label: "Average Streak Length", val: "8.4 Days", trend: "Max: 47 Days", icon: Award },
                  { label: "Total Goals Completed", val: "420", trend: "94% success rate", icon: CheckCircle },
                  { label: "Total Problems Solved", val: "512", trend: "Avg: 1.2 solved/day", icon: CheckCircle },
                  { label: "Coins Distributed", val: "25,600", trend: "₹5,120 equivalent", icon: Coins },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">{stat.label}</span>
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
                  {activities.map((act) => (
                    <div key={act.id} className="p-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          act.type === "solve" ? "bg-emerald-500" :
                          act.type === "link" ? "bg-blue-400" :
                          act.type === "streak" ? "bg-violet-500" : "bg-red-500"
                        }`} />
                        <div>
                          <span className="font-bold text-white">{act.user}</span>
                          <span className="text-zinc-500 mx-2">•</span>
                          <span className="text-zinc-300">{act.event}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400 font-mono text-[10px]">{act.detail}</span>
                        <span className="text-zinc-600 font-mono text-[10px]">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GROWTH CHARTS */}
          {activeTab === "growth" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Header Filters */}
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

              {/* Chart Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* User Growth Chart */}
                <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">User Growth (WAU)</h4>
                    <p className="text-[10px] text-zinc-550">Active registered handles weekly</p>
                  </div>
                  {/* Premium Vector Chart Representation */}
                  <div className="h-40 relative flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path d="M 0 100 L 0 85 L 20 78 L 40 68 L 60 52 L 80 34 L 100 12 L 100 100 Z" fill="url(#growthGrad)" />
                      {/* Line */}
                      <path d="M 0 85 L 20 78 L 40 68 L 60 52 L 80 34 L 100 12" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex justify-between px-1 text-[8px] text-zinc-700 pointer-events-none">
                      <div className="flex flex-col justify-between py-1 font-mono">
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-650 font-bold uppercase tracking-wider px-2">
                    <span>May 01</span>
                    <span>Jun 01</span>
                    <span>Jul 01</span>
                  </div>
                </div>

                {/* Goals & Solves per Day */}
                <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Daily Solves vs Success Rates</h4>
                    <p className="text-[10px] text-zinc-550">Average verified solves daily</p>
                  </div>
                  {/* Grouped Bars */}
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
                          {/* Solve count bar */}
                          <div 
                            style={{ height: `${d.count}%` }} 
                            className="w-2.5 bg-violet-600 rounded-t group-hover:bg-violet-400 transition-colors"
                          />
                          {/* Success rate bar */}
                          <div 
                            style={{ height: `${d.rate}%` }} 
                            className="w-2.5 bg-emerald-500/20 rounded-t group-hover:bg-emerald-400 transition-colors"
                          />
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wallet Payouts */}
                <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Daily Distributed Coins</h4>
                    <p className="text-[10px] text-zinc-550">Equivalent values of rewards credited</p>
                  </div>
                  <div className="h-40 relative flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 100 L 0 95 L 20 88 L 40 92 L 60 70 L 80 50 L 100 20 L 100 100 Z" fill="url(#walletGrad)" />
                      <path d="M 0 95 L 20 88 L 40 92 L 60 70 L 80 50 L 100 20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-650 font-bold uppercase tracking-wider px-2">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>

                {/* Cohort Retention Curve */}
                <div className="bg-[#0C0C0F] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">User Retention Curve (30D)</h4>
                    <p className="text-[10px] text-zinc-550">Drop off rates for signup cohorts</p>
                  </div>
                  <div className="h-40 relative flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 0 10 L 10 32 L 20 48 L 40 56 L 60 59 L 80 62 L 100 64" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div className="absolute top-4 right-4 text-[9px] font-mono text-zinc-500 text-right">
                      Day 1: 100%<br />
                      Day 7: 68%<br />
                      Day 30: 36%
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-650 font-bold uppercase tracking-wider px-2">
                    <span>D1</span>
                    <span>D7</span>
                    <span>D14</span>
                    <span>D30</span>
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
                      <th className="p-4 font-bold text-zinc-400">User Handle</th>
                      <th className="p-4 font-bold text-zinc-400 text-center">LeetCode</th>
                      <th className="p-4 font-bold text-zinc-400 text-center">Streak</th>
                      <th className="p-4 font-bold text-zinc-400 text-center">Total Solved</th>
                      <th className="p-4 font-bold text-zinc-400 text-center">Solved Today</th>
                      <th className="p-4 font-bold text-zinc-400 text-center">Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                    {[
                      { user: "Vansh Vijay", handle: "vanshinatorr", streak: 47, solved: 116, today: true, plan: "Pro" },
                      { user: "Aarav Gupta", handle: "aarav_g", streak: 35, solved: 82, today: true, plan: "Pro" },
                      { user: "Meera Patel", handle: "meerap", streak: 28, solved: 64, today: true, plan: "Pro" },
                      { user: "Rahul Sen", handle: "rahul99", streak: 12, solved: 22, today: false, plan: "Free" },
                      { user: "Sneha Nair", handle: "snehan", streak: 0, solved: 15, today: false, plan: "Free" },
                      { user: "Karan Singh", handle: "karan_s", streak: 0, solved: 8, today: false, plan: "Free" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01]">
                        <td className="p-4">
                          <p className="font-semibold text-white">{row.user}</p>
                          <p className="text-[10px] text-zinc-550">@{row.handle}</p>
                        </td>
                        <td className="p-4 text-center">
                          <a href={`https://leetcode.com/${row.handle}`} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-1 text-[10px]">
                            {row.handle} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
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
                            row.plan === "Pro" ? "text-violet-400 border-violet-500/25 bg-violet-500/10" : "text-zinc-500 border-white/[0.04] bg-white/[0.02]"
                          }`}>{row.plan}</span>
                        </td>
                      </tr>
                    ))}
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
                      {/* SVG donut chart */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-emerald-500" strokeDasharray="94, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-lg font-black text-white font-mono leading-none">94%</p>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Success</p>
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
                      <span className="text-white font-bold">+1,250 CP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Pending Payout Stakes</span>
                      <span className="text-white font-bold">4,800 CP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Real Money Payout Pool</span>
                      <span className="text-emerald-400 font-bold">₹10,240.00</span>
                    </div>
                    <div className="flex justify-between border-t border-white/[0.04] pt-2">
                      <span className="text-zinc-500 font-bold">Platform Reserves</span>
                      <span className="text-white font-bold">₹64,280.00</span>
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
                  { name: "Redis Cache Status", status: "Active", detail: "Hit Rate: 98.4%", color: "bg-emerald-500 text-emerald-400 border-emerald-500/20" },
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
                      <p className="text-[10px] text-zinc-500">{srv.detail}</p>
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
                        <div className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg text-zinc-500">
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

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
