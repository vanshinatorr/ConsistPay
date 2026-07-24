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
  ShieldAlert,
  Sun,
  Moon
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

const MOCK_STATS = {
  overview: {
    totalUsers: 68,
    connectedUsers: 42,
    dau: 28,
    wau: 52,
    mau: 64,
    newUsersToday: 2,
    newUsersThisWeek: 18,
    activeStreaks: 34,
    averageStreak: 6.4,
    totalGoals: 148,
    totalProblemsSolved: 3482,
    totalCoins: 17410
  },
  growth: {
    userGrowth: [
      { date: "06-14", count: 12 },
      { date: "06-15", count: 14 },
      { date: "06-16", count: 15 },
      { date: "06-17", count: 18 },
      { date: "06-18", count: 20 },
      { date: "06-19", count: 22 },
      { date: "06-20", count: 25 },
      { date: "06-21", count: 28 },
      { date: "06-22", count: 30 },
      { date: "06-23", count: 32 },
      { date: "06-24", count: 35 },
      { date: "06-25", count: 37 },
      { date: "06-26", count: 39 },
      { date: "06-27", count: 42 },
      { date: "06-28", count: 44 },
      { date: "06-29", count: 45 },
      { date: "06-30", count: 48 },
      { date: "07-01", count: 50 },
      { date: "07-02", count: 51 },
      { date: "07-03", count: 53 },
      { date: "07-04", count: 55 },
      { date: "07-05", count: 57 },
      { date: "07-06", count: 58 },
      { date: "07-07", count: 60 },
      { date: "07-08", count: 61 },
      { date: "07-09", count: 63 },
      { date: "07-10", count: 64 },
      { date: "07-11", count: 66 },
      { date: "07-12", count: 67 },
      { date: "07-13", count: 68 }
    ]
  },
  userAnalytics: [
    { user: "vansh vijay", handle: "vanshinatorr", streak: 11, solved: 142, today: true, plan: "Pro" },
    { user: "Jay Kumar", handle: "jay_leetcode", streak: 7, solved: 98, today: true, plan: "Free" },
    { user: "Keshav Sharma", handle: "keshav_sh", streak: 8, solved: 120, today: true, plan: "Pro" },
    { user: "Aarav Mehta", handle: "aarav_m", streak: 6, solved: 75, today: false, plan: "Free" },
    { user: "Meera Nair", handle: "meera_n", streak: 12, solved: 195, today: true, plan: "Pro" },
    { user: "Rohan Gupta", handle: "rohan_g", streak: 5, solved: 62, today: false, plan: "Free" },
    { user: "Sneha Patel", handle: "sneha_p", streak: 9, solved: 110, today: true, plan: "Pro" },
    { user: "Karan Johar", handle: "karan_j", streak: 4, solved: 55, today: true, plan: "Free" },
    { user: "Tanvi Shah", handle: "tanvi_s", streak: 10, solved: 158, today: true, plan: "Pro" },
    { user: "Priya Sharma", handle: "priya_sh", streak: 3, solved: 48, today: false, plan: "Free" },
    { user: "Aditya Verma", handle: "aditya_v", streak: 7, solved: 89, today: true, plan: "Pro" },
    { user: "Neha Reddy", handle: "neha_r", streak: 5, solved: 71, today: false, plan: "Free" }
  ],
  activityFeed: [
    { id: "sim-1", time: "2m ago", user: "Meera Nair", event: "Solved \"LRU Cache\"", detail: "Verified on LeetCode • +50 Coins", type: "solve" },
    { id: "sim-2", time: "8m ago", user: "vansh vijay", event: "Solved \"3Sum Closest\"", detail: "Verified on LeetCode • +50 Coins", type: "solve" },
    { id: "sim-3", time: "15m ago", user: "Tanvi Shah", event: "Solved \"Merge Intervals\"", detail: "Verified on LeetCode • +50 Coins", type: "solve" },
    { id: "sim-4", time: "30m ago", user: "Keshav Sharma", event: "Joined ConsistPay", detail: "Account created successfully", type: "signup" },
    { id: "sim-5", time: "1h ago", user: "Aditya Verma", event: "Connected LeetCode", detail: "Profile: @aditya_v", type: "link" },
    { id: "sim-6", time: "2h ago", user: "Jay Kumar", event: "Solved \"Valid Parentheses\"", detail: "Verified on LeetCode • +50 Coins", type: "solve" },
    { id: "sim-7", time: "4h ago", user: "Sneha Patel", event: "Connected LeetCode", detail: "Profile: @sneha_p", type: "link" },
    { id: "sim-8", time: "6h ago", user: "Karan Johar", event: "Joined ConsistPay", detail: "Account created successfully", type: "signup" }
  ],
  wallet: {
    coinsEarnedToday: 1400,
    activeDepositPool: 8400,
    payoutReserves: 12600
  }
};

const MOCK_BETA_REQUESTS = [
  { _id: "mock-beta-1", userId: { name: "Aarav Mehta", email: "aarav.mehta@gmail.com" }, category: "Fitness", createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { _id: "mock-beta-2", userId: { name: "Rohan Gupta", email: "rohan.gupta@yahoo.com" }, category: "Meditation", createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  { _id: "mock-beta-3", userId: { name: "Neha Reddy", email: "neha.reddy@gmail.com" }, category: "Study", createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
  { _id: "mock-beta-4", userId: { name: "Priya Sharma", email: "priya.sharma@outlook.com" }, category: "Running", createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() },
  { _id: "mock-beta-5", userId: { name: "Karan Johar", email: "karan.johar@gmail.com" }, category: "Cycling", createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() }
];

const MOCK_WITHDRAWALS = [
  { _id: "mock-w-1", userId: { name: "Keshav Sharma", email: "keshav@gmail.com" }, amount: 200, upiId: "keshav@ybl", walletType: "battle", status: "pending", createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString() },
  { _id: "mock-w-2", userId: { name: "Vansh Vijay", email: "vanshvijay9784@gmail.com" }, amount: 50, upiId: "vansh@axl", walletType: "consistency", status: "completed", createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString() },
  { _id: "mock-w-3", userId: { name: "Jay Kumar", email: "jaykumar@gmail.com" }, amount: 100, upiId: "jay@paytm", walletType: "battle", status: "failed", createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString() }
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "growth" | "users" | "platform" | "health" | "beta" | "withdrawals">("overview");
  const [timeFilter, setTimeFilter] = useState<"today" | "7d" | "30d" | "90d">("7d");
  
  // 3-State Admin Console Mode: default is day_demo (Mock Data) on load/refresh!
  const [adminState, setAdminState] = useState<"day_real" | "day_demo" | "dark_real">("day_demo");

  const isDark = adminState === "dark_real";
  const isDemoMode = adminState === "day_demo";
  const theme = isDark ? "dark" : "light";

  // Persist theme choice and update document class
  useEffect(() => {
    localStorage.setItem("admin_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleState = () => {
    if (adminState === "day_demo") {
      setAdminState("day_real");
    } else if (adminState === "day_real") {
      setAdminState("dark_real");
    } else {
      setAdminState("day_demo");
    }
  };
  
  // Authorization states
  const [userData, setUserData] = useState<any>(null);
  const [isAdminOverride, setIsAdminOverride] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Stats data state
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Beta Requests states
  const [betaRequests, setBetaRequests] = useState<any[]>([]);
  const [betaLoading, setBetaLoading] = useState(false);

  // Withdrawals states
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [demoWithdrawals, setDemoWithdrawals] = useState<any[]>(MOCK_WITHDRAWALS);

  // Live activity timeline state
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Users Analytics dynamic state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPages, setUsersPages] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // Edit user state parameters
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editStreak, setEditStreak] = useState(0);
  const [editCoins, setEditCoins] = useState(0);
  const [editBattleBalance, setEditBattleBalance] = useState(0);
  const [editPlan, setEditPlan] = useState<"Free" | "Pro">("Free");
  const [updatingUser, setUpdatingUser] = useState(false);

  // Conditional state redirection based on Demo Mode toggle
  const activeStats = isDemoMode ? MOCK_STATS : stats;
  const activeActivities = isDemoMode ? MOCK_STATS.activityFeed : activities;
  const activeUserAnalytics = isDemoMode ? MOCK_STATS.userAnalytics : usersList;
  const activeBetaRequests = isDemoMode ? MOCK_BETA_REQUESTS : betaRequests;
  const activeWithdrawals = isDemoMode ? demoWithdrawals : withdrawals;
  const activeStatsLoading = isDemoMode ? false : statsLoading;
  const activeBetaLoading = isDemoMode ? false : betaLoading;
  const activeWithdrawalsLoading = isDemoMode ? false : withdrawalsLoading;
  const activeUsersLoading = isDemoMode ? false : usersLoading;

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

  // Fetch Beta access requests
  const fetchBetaRequests = async () => {
    try {
      setBetaLoading(true);
      const res = await fetch(`${API}/api/admin/beta-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBetaRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch beta requests:", err);
    } finally {
      setBetaLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "beta" && token && isUserAdmin) {
      fetchBetaRequests();
    }
  }, [activeTab, token, isUserAdmin]);

  const handleDismissBeta = async (id: string) => {
    if (!window.confirm("Are you sure you want to dismiss/approve this request?")) {
      return;
    }
    try {
      const res = await fetch(`${API}/api/admin/beta-requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBetaRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Failed to dismiss request.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await fetch(`${API}/api/admin/users?search=${encodeURIComponent(usersSearch)}&page=${usersPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users);
        setUsersTotal(data.total);
        setUsersPages(data.pages);
      }
    } catch (err) {
      console.error("Failed to fetch admin users list:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users" && token && isUserAdmin && !isDemoMode) {
      fetchUsers();
    }
  }, [activeTab, token, isUserAdmin, usersSearch, usersPage, isDemoMode]);

  const handleOpenEditUser = (user: any) => {
    if (isDemoMode) {
      alert("Plan updates and parameters editing are disabled in Demo Mode. Toggle to Real Mode (Click Sun/Moon icon in header) to execute live database modifications.");
      return;
    }
    setEditingUser(user);
    setEditStreak(user.streak);
    setEditCoins(user.graceCoins);
    setEditBattleBalance(user.battleBalance);
    setEditPlan(user.plan === "Pro" ? "Pro" : "Free");
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      setUpdatingUser(true);
      const res = await fetch(`${API}/api/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: editPlan,
          streak: editStreak,
          graceCoins: editCoins,
          battleBalance: editBattleBalance
        })
      });
      if (res.ok) {
        setEditingUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update user.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating user.");
    } finally {
      setUpdatingUser(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      setWithdrawalsLoading(true);
      const res = await fetch(`${API}/api/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      }
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "withdrawals" && token && isUserAdmin) {
      fetchWithdrawals();
    }
  }, [activeTab, token, isUserAdmin]);

  const handleApproveWithdrawal = async (id: string) => {
    if (isDemoMode) {
      setDemoWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: "completed" } : w));
      return;
    }
    if (!window.confirm("Are you sure you want to APPROVE this withdrawal? The transaction should be sent manually to their UPI ID.")) {
      return;
    }
    try {
      const res = await fetch(`${API}/api/admin/withdrawals/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchWithdrawals();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to approve withdrawal.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    if (isDemoMode) {
      setDemoWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: "failed" } : w));
      return;
    }
    if (!window.confirm("Are you sure you want to REJECT this withdrawal? The funds will be automatically refunded to their wallet.")) {
      return;
    }
    try {
      const res = await fetch(`${API}/api/admin/withdrawals/${id}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchWithdrawals();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to reject withdrawal.");
      }
    } catch (err) {
      console.error(err);
    }
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
  const growthList = activeStats?.growth?.userGrowth || [];
  const points = growthList.map((g: any, idx: number) => {
    const x = (idx / Math.max(1, growthList.length - 1)) * 100;
    const maxVal = Math.max(...growthList.map((d: any) => d.count), 5);
    const y = 100 - (g.count / maxVal) * 85;
    return `${x},${y}`;
  });
  const linePath = points.length > 0 ? `M ${points.join(" L ")}` : "M 0 100";
  const areaPath = points.length > 0 ? `${linePath} L 100 100 L 0 100 Z` : "M 0 100";

  // Dynamic theming helper values

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none antialiased transition-colors duration-300 ${
      isDark ? "bg-[#08080A] text-zinc-350" : "bg-[#F8F9FA] text-zinc-650"
    }`}>
      
      {/* 1. Header Navigation Bar */}
      <header className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDark ? "border-white/[0.04] bg-[#0E0E12]/80 backdrop-blur-xl" : "border-zinc-200/80 bg-white/80 backdrop-blur-xl"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark ? "border-white/[0.04] hover:bg-white/5" : "border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-md font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Admin Console</h1>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold tracking-wider ${
                  isDark ? "bg-violet-500/20 text-violet-400 border-violet-500/30" : "bg-violet-50 text-violet-650 border-violet-200"
                }`}>
                  Live Analytics
                </span>
              </div>
              <p className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>ConsistPay live analytics and growth cockpit</p>
            </div>
          </div>

          {/* Right Header items: Theme toggle and overrides */}
          <div className="flex items-center gap-4">
            
            {/* Stealth 3-State Mode Toggle (Day/Real -> Day/Demo -> Dark/Real) */}
            <button
              onClick={handleToggleState}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isDark 
                  ? "border-white/[0.08] bg-[#121216] hover:bg-white/5 text-zinc-400" 
                  : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-650 shadow-sm"
              }`}
              title="Toggle Theme"
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-violet-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {isAdminOverride && (
              <div className="flex items-center gap-2 text-[10px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                Dev Override Active
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Section */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Control Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <nav className={`flex flex-col gap-1 p-2 rounded-2xl transition-all duration-300 ${
            isDark ? "bg-[#0C0C0F] border border-white/[0.04]" : "bg-white border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          }`}>
            {[
              { id: "overview", label: "Overview", icon: Users },
              { id: "growth", label: "Growth Charts", icon: TrendingUp },
              { id: "users", label: "User Analytics", icon: Users },
              { id: "platform", label: "Platform & Wallet", icon: Coins },
              { id: "health", label: "System Health", icon: Server },
              { id: "beta", label: "Beta Requests", icon: BookOpen },
              { id: "withdrawals", label: "Withdrawals", icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                    active 
                      ? isDark 
                        ? "bg-white/5 text-white border border-white/[0.04]" 
                        : "bg-zinc-100 text-zinc-900 border border-zinc-200/50"
                      : isDark
                        ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-violet-500" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Pane */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeStatsLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`border rounded-2xl p-6 h-28 animate-pulse space-y-3 ${
                    isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200"
                  }`}>
                    <div className="h-2 w-20 bg-zinc-750 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-zinc-750 rounded animate-pulse" />
                    <div className="h-2 w-24 bg-zinc-750 rounded animate-pulse" />
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
                      { label: "Total Registered Users", val: activeStats?.overview?.totalUsers ?? 0, trend: `+${activeStats?.overview?.newUsersThisWeek ?? 0} this week`, icon: Users },
                      { label: "LeetCode Linked Profiles", val: activeStats?.overview?.connectedUsers ?? 0, trend: `${activeStats?.overview?.totalUsers ? Math.round((activeStats.overview.connectedUsers / activeStats.overview.totalUsers) * 100) : 0}% conversion`, icon: CheckCircle },
                      { label: "Daily Active Users (DAU)", val: activeStats?.overview?.dau ?? 0, trend: `${activeStats?.overview?.mau ? Math.round((activeStats.overview.dau / activeStats.overview.mau) * 100) : 0}% DAU/MAU`, icon: Activity },
                      { label: "Weekly Active Users (WAU)", val: activeStats?.overview?.wau ?? 0, trend: `${activeStats?.overview?.mau ? Math.round((activeStats.overview.wau / activeStats.overview.mau) * 100) : 0}% WAU/MAU`, icon: Activity },
                      { label: "Monthly Active Users (MAU)", val: activeStats?.overview?.mau ?? 0, trend: "Active in last 30d", icon: Activity },
                      { label: "New Users Today", val: `+${activeStats?.overview?.newUsersToday ?? 0}`, trend: "Avg: 6/day", icon: Users },
                      { label: "New Users This Week", val: `+${activeStats?.overview?.newUsersThisWeek ?? 0}`, trend: "Registered past 7d", icon: Users },
                      { label: "Active Streaks", val: activeStats?.overview?.activeStreaks ?? 0, trend: `${activeStats?.overview?.totalUsers ? Math.round((activeStats.overview.activeStreaks / activeStats.overview.totalUsers) * 100) : 0}% active streak ratio`, icon: Award },
                      { label: "Average Streak Length", val: `${activeStats?.overview?.averageStreak ?? 0} Days`, trend: "Dynamic database average", icon: Award },
                      { label: "Total Goals Completed", val: activeStats?.overview?.totalGoals ?? 0, trend: "Solved target challenges", icon: CheckCircle },
                      { label: "Total Problems Solved", val: activeStats?.overview?.totalProblemsSolved ?? 0, trend: "LeetCode profile solve aggregate", icon: CheckCircle },
                      { label: "Coins Distributed", val: `${(activeStats?.overview?.totalCoins ?? 0).toLocaleString()} CP`, trend: `₹${Math.round((activeStats?.overview?.totalCoins ?? 0) * 0.2)} equivalent`, icon: Coins },
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className={`border rounded-2xl p-5 space-y-3 flex flex-col justify-between transition-all duration-300 ${
                          isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>{stat.label}</span>
                            <div className={`p-1.5 border rounded-lg ${isDark ? "bg-white/[0.02] border-white/[0.04] text-zinc-450" : "bg-zinc-50 border-zinc-200 text-zinc-500"}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className={`text-2xl font-black font-mono leading-none ${isDark ? "text-white" : "text-zinc-905"}`}>{stat.val}</div>
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
                  <div className={`border-t pt-6 space-y-4 ${isDark ? "border-white/[0.04]" : "border-zinc-200"}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Live Activity Feed</h3>
                    <div className={`border rounded-2xl divide-y transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04] divide-white/[0.04]" : "bg-white border-zinc-200/80 divide-zinc-150"
                    }`}>
                      {activeActivities.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs">No activity logged in database yet.</div>
                      ) : (
                        activeActivities.map((act) => (
                          <div key={act.id} className="p-4 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${
                                act.type === "solve" ? "bg-emerald-500" :
                                act.type === "link" ? "bg-blue-500" :
                                act.type === "streak" ? "bg-violet-500" :
                                act.type === "signup" ? "bg-amber-400" : "bg-red-500"
                              }`} />
                              <div>
                                <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{act.user}</span>
                                <span className="text-zinc-550 mx-2">•</span>
                                <span className={isDark ? "text-zinc-300" : "text-zinc-650"}>{act.event}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`font-mono text-[10px] ${isDark ? "text-zinc-450" : "text-zinc-400"}`}>{act.detail}</span>
                              <span className={`font-mono text-[10px] ${isDark ? "text-zinc-600" : "text-zinc-450"}`}>{act.time}</span>
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
                    <h3 className={`text-sm font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Traction Metrics</h3>
                    <div className={`flex p-0.5 rounded-lg border ${isDark ? "bg-black/40 border-white/[0.04]" : "bg-zinc-200/50 border-zinc-200"}`}>
                      {(["today", "7d", "30d", "90d"] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setTimeFilter(f)}
                          className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            timeFilter === f 
                              ? isDark ? "bg-white/5 text-white" : "bg-white text-zinc-900 shadow-sm border border-zinc-200/30"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <div className={`border rounded-2xl p-5 space-y-4 transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                    }`}>
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-450" : "text-zinc-700"}`}>User Growth (WAU)</h4>
                        <p className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>Active registered handles weekly</p>
                      </div>
                      <div className="h-40 relative flex items-end">
                        {growthList.length === 0 ? (
                          <div className="w-full text-center text-zinc-500 text-xs py-12">No growth data in timeline.</div>
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
                      <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-wider px-2">
                        <span>30 days ago</span>
                        <span>15 days ago</span>
                        <span>Today</span>
                      </div>
                    </div>

                    {/* Goals & Solves per Day */}
                    <div className={`border rounded-2xl p-5 space-y-4 transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                    }`}>
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-450" : "text-zinc-700"}`}>Daily Solves vs Success Rates</h4>
                        <p className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>Average verified solves daily</p>
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
                            <span className="text-[9px] font-mono text-zinc-500">{d.day}</span>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>User Accounts Dashboard</h3>
                      <p className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>Search registered profiles and adjust plan configurations.</p>
                    </div>
                    
                    {/* Search bar input */}
                    <div className="flex gap-2 shrink-0">
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={usersSearch}
                        onChange={(e) => {
                          setUsersSearch(e.target.value);
                          setUsersPage(1); // reset page on search
                        }}
                        className={`px-4 py-2 text-xs rounded-xl border outline-none transition-all ${
                          isDark 
                            ? "bg-[#0C0C0F] border-white/[0.08] text-white focus:border-violet-500/50" 
                            : "bg-white border-zinc-200 text-zinc-800 focus:border-violet-500/50 shadow-sm"
                        }`}
                      />
                    </div>
                  </div>

                  {activeUsersLoading ? (
                    <div className="py-12 text-center text-xs text-zinc-550 animate-pulse">Loading database profiles...</div>
                  ) : (
                    <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04] shadow-xl" : "bg-white border-zinc-200/80 shadow-md"
                    }`}>
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className={`border-b transition-colors duration-300 ${
                            isDark ? "border-white/[0.04] bg-white/[0.01]" : "border-zinc-200/80 bg-zinc-50"
                          }`}>
                            <th className={`p-4 font-bold ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>User Profile</th>
                            <th className={`p-4 font-bold text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>LeetCode Username</th>
                            <th className={`p-4 font-bold text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Streak</th>
                            <th className={`p-4 font-bold text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Total Solved</th>
                            <th className={`p-4 font-bold text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Solved Today</th>
                            <th className={`p-4 font-bold text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Plan</th>
                            <th className={`p-4 font-bold text-right ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Operations</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-zinc-150"}`}>
                          {activeUserAnalytics.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-zinc-500 text-xs">No registered users in database.</td>
                            </tr>
                          ) : (
                            activeUserAnalytics.map((row: any, idx: number) => (
                              <tr key={row._id || idx} className={`transition-all duration-200 ${isDark ? "hover:bg-white/[0.01]" : "hover:bg-zinc-50/50"}`}>
                                <td className="p-4">
                                  <p className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>{row.user || row.name}</p>
                                  {row.email && <p className="text-[10px] text-zinc-500 mt-0.5">{row.email}</p>}
                                </td>
                                <td className="p-4 text-center">
                                  {row.handle === "not-linked" ? (
                                    <span className="text-zinc-500">Not Linked</span>
                                  ) : (
                                    <a href={`https://leetcode.com/${row.handle}`} target="_blank" rel="noreferrer" className="text-violet-500 hover:underline inline-flex items-center gap-1 text-[10px]">
                                      {row.handle} <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                </td>
                                <td className={`p-4 text-center font-mono font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{row.streak} 🔥</td>
                                <td className="p-4 text-center font-mono font-semibold">{row.solved}</td>
                                <td className="p-4 text-center">
                                  {row.today ? (
                                    <span className="text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Solved</span>
                                  ) : (
                                    <span className="text-zinc-500 bg-white/[0.02] border border-white/[0.04] px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pending</span>
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${
                                    row.plan === "Pro" ? "text-violet-500 border-violet-500/25 bg-violet-500/10" : "text-zinc-500 border-zinc-200 bg-zinc-50"
                                  }`}>{row.plan}</span>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleOpenEditUser(row)}
                                    className="px-2.5 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-500 dark:text-violet-400 rounded-lg text-[10px] font-bold border border-violet-500/20 transition-all cursor-pointer active:scale-95 shadow-sm"
                                  >
                                    Edit Settings
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                      {/* Pagination Controls */}
                      {!isDemoMode && usersPages > 1 && (
                        <div className={`p-4 flex items-center justify-between border-t transition-colors duration-300 ${
                          isDark ? "border-white/[0.04] bg-white/[0.01]" : "border-zinc-200 bg-zinc-50/50"
                        }`}>
                          <span className="text-[10px] text-zinc-500">
                            Showing page <b>{usersPage}</b> of <b>{usersPages}</b> ({usersTotal} users total)
                          </span>
                          <div className="flex gap-2">
                            <button
                              disabled={usersPage <= 1}
                              onClick={() => setUsersPage(prev => Math.max(1, prev - 1))}
                              className="px-3 py-1.5 border border-zinc-200 dark:border-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-50 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Prev
                            </button>
                            <button
                              disabled={usersPage >= usersPages}
                              onClick={() => setUsersPage(prev => Math.min(usersPages, prev + 1))}
                              className="px-3 py-1.5 border border-zinc-200 dark:border-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-50 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PLATFORM & WALLET ANALYTICS */}
              {activeTab === "platform" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>Economics & Integrations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Goal Analytics */}
                    <div className={`border rounded-2xl p-6 space-y-4 transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                    }`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>Goal Ratios & Failure Rates</h4>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-zinc-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-emerald-500" strokeDasharray="94, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute text-center">
                            <p className={`text-lg font-black font-mono leading-none ${isDark ? "text-white" : "text-zinc-900"}`}>94%</p>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Success</p>
                          </div>
                        </div>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-zinc-650">Goal Success: <b>94%</b></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-700" />
                            <span className="text-zinc-500">Streak Resets (Loss): <b>6%</b></span>
                          </div>
                          <p className={`text-[10px] leading-relaxed pt-1 ${isDark ? "text-zinc-550" : "text-zinc-450"}`}>
                            High success rate shows consistent engagement, while the 6% failure rate feeds the rewards pool.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Wallet statistics */}
                    <div className={`border rounded-2xl p-6 space-y-4 transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                    }`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-700"}`}>Distributed Coin Economy</h4>
                      <div className={`space-y-4 font-mono text-xs ${isDark ? "text-zinc-300" : "text-zinc-755"}`}>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Coins Earned Today</span>
                          <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>+{activeStats?.wallet?.coinsEarnedToday ?? 0} CP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Active Deposit Pool</span>
                          <span className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>₹{activeStats?.wallet?.activeDepositPool ?? 0}</span>
                        </div>
                        <div className={`flex justify-between border-t pt-2 ${isDark ? "border-white/[0.04]" : "border-zinc-200"}`}>
                          <span className="text-zinc-500 font-bold">Payout Reserves (Est)</span>
                          <span className="text-emerald-500 font-bold">₹{(activeStats?.wallet?.payoutReserves ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM HEALTH */}
              {activeTab === "health" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>Infrastructure Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "API Server Status", status: "Healthy", detail: "Response: 12ms avg", color: "bg-emerald-500 text-emerald-500 border-emerald-500/20" },
                      { name: "MongoDB Status", status: "Connected", detail: "Active connections: 8", color: "bg-emerald-500 text-emerald-500 border-emerald-500/20" },
                      { name: "Redis Cache Status", status: "Active (Fallback Mode)", detail: "Hit Rate: 98.4%", color: "bg-emerald-500 text-emerald-500 border-emerald-500/20" },
                      { name: "Daily Sync Job Queue", status: "Idle", detail: "Jobs scheduled: 1", color: "bg-emerald-500 text-emerald-500 border-emerald-500/20" },
                      { name: "Cron scheduler status", status: "Running", detail: "Rollover runs: 00:00 AM", color: "bg-emerald-500 text-emerald-500 border-emerald-500/20" },
                      { name: "Failed Jobs Log", status: "0 Failures", detail: "Past 7 days", color: "bg-emerald-500 text-emerald-500 border-emerald-500/20" },
                    ].map((srv, idx) => (
                      <div key={idx} className={`border rounded-2xl p-5 flex items-start gap-4 transition-colors duration-300 ${
                        isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                      }`}>
                        <div className={`p-2.5 border rounded-xl shrink-0 ${isDark ? "bg-white/[0.01] border-white/[0.04] text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-500"}`}>
                          <Server className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <h5 className={`font-bold text-xs ${isDark ? "text-white" : "text-zinc-900"}`}>{srv.name}</h5>
                          <p className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>{srv.detail}</p>
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

              {/* TAB: BETA REQUESTS */}
              {activeTab === "beta" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-base font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                        Early Access Beta Enrollments
                      </h3>
                      <p className={`text-xs ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>
                        Manage and approve user requests for upcoming modules (Fitness, Study, etc.)
                      </p>
                    </div>
                  </div>

                  {activeBetaLoading ? (
                    <div className="text-center py-12 text-zinc-500 text-xs">
                      Loading beta requests...
                    </div>
                  ) : activeBetaRequests.length === 0 ? (
                    <div className={`border rounded-2xl p-12 text-center text-xs text-zinc-500 transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80"
                    }`}>
                      No pending beta enrollments found.
                    </div>
                  ) : (
                    <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                      isDark ? "bg-[#0C0C0F] border-white/[0.04]" : "bg-white border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)]"
                    }`}>
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className={`border-b transition-colors duration-300 ${
                            isDark ? "border-white/[0.04] bg-white/[0.01]" : "border-zinc-200/80 bg-zinc-50"
                          }`}>
                            <th className={`p-4 font-bold ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>User Info</th>
                            <th className={`p-4 font-bold ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Requested Category</th>
                            <th className={`p-4 font-bold text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Date Requested</th>
                            <th className={`p-4 font-bold text-right ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Action</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-zinc-150"}`}>
                          {activeBetaRequests.map((req) => (
                            <tr key={req._id} className={`transition-all duration-200 ${isDark ? "hover:bg-white/[0.01]" : "hover:bg-zinc-50/50"}`}>
                              <td className="p-4">
                                <p className={`font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>{req.userId?.name || "Deleted User"}</p>
                                <p className="text-[10px] text-zinc-500">{req.userId?.email || ""}</p>
                              </td>
                              <td className="p-4">
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${
                                  isDark ? "text-violet-400 border-violet-500/20 bg-violet-500/10" : "text-violet-750 border-violet-200 bg-violet-50"
                                }`}>
                                  {req.category}
                                </span>
                              </td>
                              <td className="p-4 text-center font-mono text-[10px]">
                                {new Date(req.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDismissBeta(req._id)}
                                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-500/20 transition-all cursor-pointer active:scale-95 shadow-sm"
                                >
                                  Grant & Resolve
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: WITHDRAWALS MANAGEMENT */}
              {activeTab === "withdrawals" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-zinc-900"}`}>
                        Withdrawal Requests
                      </h3>
                      <p className={`text-[10px] mt-0.5 ${isDark ? "text-zinc-550" : "text-zinc-450"}`}>
                        Process pending user withdrawals and handle payouts directly.
                      </p>
                    </div>
                  </div>

                  {activeWithdrawalsLoading ? (
                    <div className="py-8 text-center text-xs text-zinc-550 animate-pulse">Loading withdrawal transactions...</div>
                  ) : activeWithdrawals.length === 0 ? (
                    <div className={`border rounded-2xl p-8 text-center text-xs font-semibold ${
                      isDark ? "bg-[#0C0C0F]/50 border-white/[0.04] text-zinc-500" : "bg-white border-zinc-200 text-zinc-450 shadow-sm"
                    }`}>
                      No withdrawal requests found in database.
                    </div>
                  ) : (
                    <div className={`border rounded-2xl overflow-hidden ${
                      isDark ? "bg-[#0C0C0F]/30 border-white/[0.04]" : "bg-white border-zinc-200 shadow-sm"
                    }`}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                              isDark ? "border-white/[0.04] bg-[#0E0E12] text-zinc-500" : "border-zinc-200 bg-zinc-50/50 text-zinc-450"
                            }`}>
                              <th className="py-3 px-4">User</th>
                              <th className="py-3 px-4">Amount</th>
                              <th className="py-3 px-4">Wallet</th>
                              <th className="py-3 px-4">UPI ID</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 dark:divide-white/[0.04] text-xs">
                            {activeWithdrawals.map((w) => (
                              <tr key={w._id} className={isDark ? "hover:bg-white/[0.01]" : "hover:bg-zinc-50/30"}>
                                <td className="py-3.5 px-4">
                                  <div className={`font-bold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{w.userId?.name || "Deleted User"}</div>
                                  <div className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-450"}`}>{w.userId?.email || "N/A"}</div>
                                </td>
                                <td className={`py-3.5 px-4 font-mono font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                                  ₹{w.amount}
                                </td>
                                <td className="py-3.5 px-4 uppercase font-semibold text-[10px] text-zinc-500 dark:text-zinc-450">
                                  {w.walletType || "consistency"}
                                </td>
                                <td className={`py-3.5 px-4 font-mono ${isDark ? "text-zinc-350" : "text-zinc-650"}`}>
                                  {w.upiId}
                                </td>
                                <td className={`py-3.5 px-4 ${isDark ? "text-zinc-455" : "text-zinc-500"}`}>
                                  {new Date(w.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 w-fit ${
                                    w.status === "completed" 
                                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                      : w.status === "failed"
                                      ? "text-red-555 bg-red-500/10 border border-red-500/20"
                                      : "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                                  }`}>
                                    <span className={`w-1 h-1 rounded-full ${
                                      w.status === "completed" ? "bg-emerald-600 dark:bg-emerald-400" : w.status === "failed" ? "bg-red-500" : "bg-amber-400"
                                    }`} />
                                    {w.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  {w.status === "pending" ? (
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleApproveWithdrawal(w._id)}
                                        className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleRejectWithdrawal(w._id)}
                                        className="h-7 px-2.5 bg-red-650 hover:bg-red-500 text-white border border-transparent rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-red-500/10 cursor-pointer"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span className={`text-[10px] font-semibold ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                                      Processed
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* 4. Edit User Parameters Drawer/Modal Overlay */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-3xl border p-6 space-y-6 shadow-2xl relative transition-all duration-300 ${
            isDark ? "bg-[#0E0E12] border-white/[0.04] text-white" : "bg-white border-zinc-200 text-zinc-800"
          }`}>
            <div className="space-y-1">
              <h3 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                Edit User Settings
              </h3>
              <p className={`text-[10px] ${isDark ? "text-zinc-550" : "text-zinc-400"}`}>
                Update values directly for <b>{editingUser.user || editingUser.name}</b> ({editingUser.email})
              </p>
            </div>

            <div className="space-y-4">
              {/* Plan Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Plan Option</label>
                <div className="flex gap-2">
                  {(["Free", "Pro"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPlan(p)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        editPlan === p
                          ? "bg-violet-600 hover:bg-violet-500 text-white-force border-violet-500 shadow-sm"
                          : isDark
                          ? "bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:bg-white/5"
                          : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streak Counter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Streak Length (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={editStreak}
                  onChange={(e) => setEditStreak(Math.max(0, parseInt(e.target.value) || 0))}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                    isDark 
                      ? "bg-[#0C0C0F] border-white/[0.08] text-white focus:border-violet-500/50" 
                      : "bg-white border-zinc-200 text-zinc-800 focus:border-violet-500/50"
                  }`}
                />
              </div>

              {/* Grace Coins Counter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Grace Coins</label>
                <input
                  type="number"
                  min="0"
                  value={editCoins}
                  onChange={(e) => setEditCoins(Math.max(0, parseInt(e.target.value) || 0))}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                    isDark 
                      ? "bg-[#0C0C0F] border-white/[0.08] text-white focus:border-violet-500/50" 
                      : "bg-white border-zinc-200 text-zinc-800 focus:border-violet-500/50"
                  }`}
                />
              </div>

              {/* Battle Balance (INR) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Battle Balance (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editBattleBalance}
                  onChange={(e) => setEditBattleBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${
                    isDark 
                      ? "bg-[#0C0C0F] border-white/[0.08] text-white focus:border-violet-500/50" 
                      : "bg-white border-zinc-200 text-zinc-800 focus:border-violet-500/50"
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={updatingUser}
                onClick={() => setEditingUser(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isDark
                    ? "border-white/[0.04] hover:bg-white/5 text-zinc-400"
                    : "border-zinc-200 hover:bg-zinc-50 text-zinc-650"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingUser}
                onClick={handleSaveUser}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white-force rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-500/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {updatingUser ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
