import { AlertTriangle, BarChart3, Flame, TrendingDown, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./dashboard/Navbar";
import { StatsRow } from "./dashboard/StatsRow";
import { TodaysChallenge } from "./dashboard/TodaysChallenge";
import { WalletCard } from "./dashboard/WalletCard";
import { VersusCard } from "./dashboard/VersusCard";
import { DsaStatsCard } from "./dashboard/DsaStatsCard";
import { PlatformsWidget } from "./dashboard/PlatformsWidget";
import { ConsistencyCalendar } from "./dashboard/ConsistencyCalendar";
import { DashboardBattleWidget } from "./dashboard/DashboardBattleWidget";
import { RecentSolves } from "./dashboard/RecentSolves";
import { LeaderboardRankCard } from "./dashboard/LeaderboardRankCard";
import { AwardsCard } from "./dashboard/AwardsCard";
import { JoinModal } from "./dashboard/JoinModal";
import { Footer } from "./dashboard/Footer";
import { CommitmentModal } from "../components/CommitmentModal";
import { Check } from "lucide-react";

const motivationalLines = [
  "You showed up. That's what counts.",
  "Streak intact. 🔥",
  "Commitment protected. See you tomorrow.",
  "Another day coded. Another day closer.",
  "Small wins compound. Keep going.",
  "You didn't quit today. That's enough.",
  "Consistency beats talent. Proven today.",
  "Future you is grateful for today's you.",
  "The grind is quiet. The results are loud.",
  "One problem a day keeps mediocrity away.",
  "You kept your word to yourself. 💪",
  "Champions show up even when they don't feel like it.",
  "Progress > Perfection. Always.",
  "Streak alive. Mind sharp. Keep moving.",
  "Today's effort is tomorrow's edge.",
];

interface UserData {
  name: string;
  email: string;
  plan: string;
  balance: number;
  streak: number;
  maxStreak: number;
  graceCoins: number;
  dailyCommitment: number;
  totalSolved: number;
  totalProblemsSolved: number;
  totalMissed: number;
  battleBalance: number;
  onboardingComplete: boolean;
  createdAt?: string;
}

interface CalendarDay {
  date: string;
  status: "completed" | "missed";
}

export function Dashboard() {
  const navigate = useNavigate();
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [endMonthDate, setEndMonthDate] = useState(new Date());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [todaySubmission, setTodaySubmission] = useState<any>(null);
  const [recentSolves, setRecentSolves] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"today" | "analytics" | "activity">("today");

  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [userRank, setUserRank] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [devMenuOpen, setDevMenuOpen] = useState(false);
  const [devResetLoading, setDevResetLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchUserRank = async (myId?: string) => {
    try {
      setLeaderboardLoading(true);
      const res = await fetch(`${API}/api/users/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTotalUsers(data.length);
        
        let targetId = myId;
        if (!targetId) {
          const cachedUser = localStorage.getItem("consistpay_user_data");
          if (cachedUser) {
            targetId = JSON.parse(cachedUser)._id;
          }
        }

        if (targetId) {
          const rankIndex = data.findIndex((u: any) => u._id === targetId);
          if (rankIndex !== -1) {
            setUserRank(rankIndex + 1);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch user rank:", err);
    } finally {
      setLeaderboardLoading(false);
    }
  };



  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("consistpay_user_data");
        navigate("/login");
        return null;
      }
      const data = await res.json();
      setUserData(data);
      localStorage.setItem("consistpay_user_data", JSON.stringify(data));
      
      // Auto-trigger user rank fetch to keep dashboard stats synchronized
      fetchUserRank(data._id);
      
      return data;
    } catch (err) {
      console.error("User fetch error:", err);
      return null;
    }
  };

  const getVisibleYears = (endDate: Date) => {
    const years = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
      years.add(d.getFullYear());
    }
    return Array.from(years);
  };

  const fetchCalendarForYears = async (years: number[]) => {
    try {
      const promises = years.map(async (yr) => {
        const res = await fetch(
          `${API}/api/submissions/calendar?year=${yr}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      });
      const results = await Promise.all(promises);
      const combined = results.flat();
      setCalendarData(combined);
      localStorage.setItem("consistpay_calendar_data", JSON.stringify(combined));
    } catch (err) {
      console.error("Calendar fetch error:", err);
    }
  };

  const fetchTodaySubmission = async () => {
    try {
      const res = await fetch(`${API}/api/submissions/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTodaySubmission(data);
        localStorage.setItem("consistpay_today_submission", JSON.stringify(data));
        if (data && data.count > 0) {
          setSubmitted(true);
        } else {
          setSubmitted(false);
        }
      }
    } catch (err) {
      console.error("Error fetching today's submission:", err);
    }
  };

  const fetchRecentSolves = async () => {
    try {
      const res = await fetch(`${API}/api/submissions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Filter out missed submissions (e.g. status: "missed" / "No Submission")
        const completedSolves = data.filter((sub: any) => sub.status === "completed" && sub.problemName !== "No Submission");
        const formatted = completedSolves.map((sub: any) => {
          const date = new Date(sub.createdAt || sub.date);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffHrs / 24);

          let timeStr = "";
          if (diffHrs < 1) timeStr = "Just now";
          else if (diffHrs < 24) timeStr = `${diffHrs}h ago`;
          else if (diffDays === 1) timeStr = "Yesterday";
          else timeStr = `${diffDays}d ago`;

          let plat = sub.platform;
          if (plat === "LeetCode") plat = "LC";
          else if (plat === "Code360") plat = "C360";

          return {
            platform: plat || "Unknown",
            name: sub.problemName || "Unknown Problem",
            difficulty: sub.difficulty || "Medium",
            topic: sub.topic || "General",
            time: timeStr,
            date: date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            rawDate: sub.createdAt || sub.date
          };
        });
        setRecentSolves(formatted);
        localStorage.setItem("consistpay_recent_solves", JSON.stringify(formatted));
      }
    } catch (err) {
      console.error("Error fetching recent solves:", err);
    }
  };

  const visibleYears = getVisibleYears(endMonthDate);
  const visibleYearsStr = visibleYears.join(",");

  useEffect(() => {
    // 1. Try to load cached data for instant render
    const cachedUser = localStorage.getItem("consistpay_user_data");
    const cachedCalendar = localStorage.getItem("consistpay_calendar_data");
    const cachedTodaySub = localStorage.getItem("consistpay_today_submission");
    const cachedRecent = localStorage.getItem("consistpay_recent_solves");

    if (cachedUser) setUserData(JSON.parse(cachedUser));
    if (cachedCalendar) setCalendarData(JSON.parse(cachedCalendar));
    if (cachedTodaySub) {
      const parsedToday = JSON.parse(cachedTodaySub);
      setTodaySubmission(parsedToday);
      if (parsedToday && parsedToday.count > 0) {
        setSubmitted(true);
      }
    }
    if (cachedRecent) setRecentSolves(JSON.parse(cachedRecent));

    // If we have cached data, bypass full screen spinner immediately
    const initialLoading = !cachedUser;
    setLoading(initialLoading);

    const init = async () => {
      const initialYears = getVisibleYears(new Date());
      try {
        await Promise.all([
          fetchUserData(),
          fetchCalendarForYears(initialYears),
          fetchTodaySubmission(),
          fetchRecentSolves(),
        ]);
      } catch (err) {
        console.error("Dashboard initial fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchCalendarForYears(visibleYears);
    }
  }, [visibleYearsStr]);

  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setSubmitted(false);
        fetchTodaySubmission();
        fetchUserData();
        fetchCalendarForYears(visibleYears);
        fetchRecentSolves();
        return;
      }

      setTimeLeft({
        h: Math.floor(diff / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const handleLink = async (username: string) => {
    setLinkLoading(true);
    setSubmitError("");
    try {
      if (username === "") {
        // Change username -> delete linkage
        const res = await fetch(`${API}/api/platforms/link`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ platform: selectedPlatform })
        });
        const data = await res.json();
        if (!res.ok) {
          setSubmitError(data.message || "Failed to clear linkage.");
          return;
        }
        setLinkage(null);
      } else {
        const res = await fetch(`${API}/api/platforms/link`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ platform: selectedPlatform, username })
        });
        const data = await res.json();
        if (!res.ok) {
          setSubmitError(data.message || "Failed to link profile.");
          return;
        }
        await fetchLinkage(selectedPlatform);
      }
    } catch (err) {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifyLoading(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API}/api/platforms/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform: selectedPlatform })
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Verification failed. Check token location.");
        return;
      }
      await Promise.all([
        fetchLinkage(selectedPlatform),
        fetchUserData()
      ]);
    } catch (err) {
      setSubmitError("Network error. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSync = async () => {
    const verifiedPlatforms = (userData as any)?.linkedPlatforms?.filter((p: any) => p.isVerified).map((p: any) => p.platform) || [];
    if (verifiedPlatforms.length === 0) {
      setSubmitError("No verified coding profiles connected. Please connect LeetCode or GeeksforGeeks on the right sidebar first!");
      return;
    }

    setSyncLoading(true);
    setSubmitError("");
    setSyncLogs([`[${new Date().toLocaleTimeString()}] ⚡ Initializing global synchronization query...`]);
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔍 Active platforms to scan: ${verifiedPlatforms.join(", ")}`]);
      
      // Sync all verified platforms in parallel
      const syncResults = await Promise.all(
        verifiedPlatforms.map(async (plat: string) => {
          setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🌐 Querying API endpoint for ${plat}...`]);
          try {
            const res = await fetch(`${API}/api/platforms/sync`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ platform: plat, timezone: userTimeZone })
            });
            if (res.ok) {
              const data = await res.json();
              const statusStr = data.solvedToday ? "Solved today!" : "No solves found today";
              setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📡 ${plat} sync complete. Status: ${statusStr} (Total: ${data.solvedCount || 0})`]);
              return data;
            }
          } catch (e) {
            console.error(`Failed to sync platform ${plat}:`, e);
            setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⚠️ ${plat} connection error. Retrying backend cache...`]);
          }
          return { solvedToday: false };
        })
      );
      
      const anySolved = syncResults.some((res: any) => res && res.solvedToday);
      if (anySolved) {
        setSubmitted(true);
        setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Verification query match: STREAK SECURED!`]);
      } else {
        setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ℹ️ Verification check: No new solved problems detected yet today.`]);
      }
      
      await Promise.all([
        fetchUserData(),
        fetchCalendarForYears(visibleYears),
        fetchTodaySubmission(),
        fetchRecentSolves(),
      ]);
    } catch (err) {
      setSubmitError("Failed to synchronize submissions. Please try again.");
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ Synchronization failed.`]);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleDevReset = async () => {
    const confirm = window.confirm("Are you sure? This will delete all your testing data.");
    if (!confirm) return;

    setDevResetLoading(true);
    try {
      const res = await fetch(`${API}/api/users/dev-reset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        localStorage.clear();
        navigate("/signup");
      } else {
        alert("Failed to reset account.");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setDevResetLoading(false);
    }
  };

  const currentStreak = userData?.streak ?? 0;
  const completedDays = userData?.totalSolved ?? 0;
  const missedDays = userData?.totalMissed ?? 0;
  const total = completedDays + missedDays;
  const consistencyScore = total > 0 ? Math.round((completedDays / total) * 100) : 0;
  const dailyCommitment = userData?.dailyCommitment ?? 0;
  const graceCoins = userData?.graceCoins ?? 0;
  const monthlyBudget = dailyCommitment * 30;

  const initials = userData?.name
    ? userData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  const avatar = userData?.avatar || initials;
  const isAvatarUrl = avatar.startsWith("http");

  const todayLine = motivationalLines[new Date().getDate() % motivationalLines.length];
  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarMap = new Map<string, { status: "completed" | "missed", count: number }>();
  if (Array.isArray(calendarData)) {
    calendarData.forEach((item) => {
      if (item && item.date) {
        const dateKey = item.date.split("T")[0];
        const existing = calendarMap.get(dateKey);

        if (item.status === "completed") {
          const newCount = (existing?.count || 0) + 1;
          calendarMap.set(dateKey, { status: "completed", count: newCount });
        } else if (item.status === "missed" && (!existing || existing.status === "missed")) {
          calendarMap.set(dateKey, { status: "missed", count: 0 });
        }
      }
    });
  }

  const handlePrevMonth = () => {
    setEndMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setEndMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const todayDate = new Date();
  const isNextDisabled = endMonthDate.getFullYear() > todayDate.getFullYear() ||
    (endMonthDate.getFullYear() === todayDate.getFullYear() && endMonthDate.getMonth() >= todayDate.getMonth());

  const buildMonthsGrid = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const registrationDate = userData?.createdAt ? new Date(userData.createdAt) : null;
    if (registrationDate) {
      registrationDate.setHours(0, 0, 0, 0);
    }

    const months = [];
    for (let i = 4; i >= 0; i--) {
      const targetDate = new Date(endMonthDate.getFullYear(), endMonthDate.getMonth() - i, 1);
      const m = targetDate.getMonth();
      const y = targetDate.getFullYear();

      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const firstDay = new Date(y, m, 1).getDay();
      const weeks: ({ status: "completed" | "missed" | "pending" | "empty" | "future" | "inactive"; date?: Date; count?: number })[][] = [];
      let currentWeek: ({ status: "completed" | "missed" | "pending" | "empty" | "future" | "inactive"; date?: Date; count?: number })[] = [];
      for (let j = 0; j < firstDay; j++) currentWeek.push({ status: "empty" });
      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(y, m, d);
        const cellYear = cellDate.getFullYear();
        const cellMo = String(cellDate.getMonth() + 1).padStart(2, "0");
        const cellDa = String(cellDate.getDate()).padStart(2, "0");
        const dateStr = `${cellYear}-${cellMo}-${cellDa}`;
        let status: "completed" | "missed" | "pending" | "empty" | "future" | "inactive" = "pending";
        let count = 0;

        if (registrationDate && cellDate < registrationDate) {
          const mapData = calendarMap.get(dateStr);
          if (mapData && mapData.status === "completed") {
            status = "completed";
            count = mapData.count;
          } else {
            status = "inactive";
          }
        } else if (cellDate > today) {
          status = "future";
        } else if (cellDate < today) {
          const mapData = calendarMap.get(dateStr);
          if (mapData) {
            status = mapData.status;
            count = mapData.count;
          } else {
            status = "missed";
            count = 0;
          }
        } else if (cellDate.getTime() === today.getTime()) {
          const todayCount = todaySubmission?.count || 0;
          if (todayCount > 0) {
            status = "completed";
            count = todayCount;
          } else {
            status = "pending";
            count = 0;
          }
        }
        currentWeek.push({ status, date: cellDate, count });
        if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push({ status: "empty" });
        weeks.push(currentWeek);
      }
      months.push({ monthIndex: m, name: `${shortMonths[m]} ${y}`, weeks });
    }
    return months;
  };

  const yearMonths = buildMonthsGrid();

  const faqs = [
    { q: "What is ConsistPay?", a: "A platform designed to build unshakable coding habits by putting small stakes on the line." },
    { q: "How do you verify my submissions?", a: "Connect your LeetCode account. We automatically sync and verify your daily solves." },
    { q: "What happens if I miss a day?", a: "If you fail to sync by midnight, your daily commitment amount is deducted from your balance." },
    { q: "How do grace coins work?", a: "Grace coins protect your streak on days you forget to solve. Auto-consumed to save your streak." },
    { q: "Is the platform free to use?", a: "We offer a free tier with basic tracking. Upgrade to Pro for challenges and rewards." },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0F0F13" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <Navbar initials={initials} plan={userData?.plan} avatar={avatar} isAvatarUrl={isAvatarUrl} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {userData && !userData.onboardingComplete && (
          <div className="mb-8 bg-[#121214] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl hover:border-emerald-500/20 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-400" />
                  Initialize Your Journey
                </h3>
                <p className="text-zinc-400 text-sm">Complete these steps to unlock the full potential of your consistency tracker.</p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Create Account</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0" />
                  <span>Choose Plan & Commitment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0" />
                  <span>Submit your first proof</span>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(true)}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium rounded-xl transition-all w-full md:w-auto shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Setup Commitment
              </button>
            </div>
          </div>
        )}

        {userData?.onboardingComplete && (userData?.planStatus === "grace_period" || userData?.planStatus === "expired") && (
          <div className="mb-8 bg-gradient-to-r from-red-500/10 via-amber-500/5 to-red-500/10 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {userData.planStatus === "grace_period" ? "⚠️ Plan Grace Period Active" : "🔴 Plan Expired"}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                    {userData.planStatus === "grace_period" 
                      ? `Your 30-day coding plan has expired. You have ${userData.graceDaysLeft} ${userData.graceDaysLeft === 1 ? 'day' : 'days'} left of the grace period to submit for streak without earning rewards. Renew now to resume full accountability!`
                      : "Your plan has expired and the grace period has ended. You can no longer submit daily coding solutions until you renew."
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto shrink-0">
                {userData.balance > 0 && (
                  <button 
                    onClick={() => {
                      const event = new CustomEvent("open-withdraw-modal");
                      window.dispatchEvent(event);
                    }}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer text-center flex-1 md:flex-none"
                  >
                    Withdraw ₹{userData.balance}
                  </button>
                )}
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl transition-all w-full md:w-auto shadow-lg shadow-violet-500/20 cursor-pointer text-center flex-1 md:flex-none"
                >
                  Renew Plan
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 mb-6">
          {/* Row 1: Stats & Desktop Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2">
              <StatsRow
                currentStreak={currentStreak}
                completedDays={userData?.totalProblemsSolved ?? 0}
                consistencyScore={consistencyScore}
                onboardingComplete={userData?.onboardingComplete ?? true}
              />
            </div>
            {/* Desktop Only Calendar */}
            <div className="hidden lg:block lg:col-span-1">
              <ConsistencyCalendar
                yearMonths={yearMonths}
                onboardingComplete={userData?.onboardingComplete ?? true}
                dayLabels={dayLabels}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                isNextDisabled={isNextDisabled}
              />
            </div>
          </div>

          {/* Row 2: Challenge a Friend Widget */}
          <DashboardBattleWidget onRefreshRequest={fetchUserData} />

          {/* Row 3: Today's Goal Sync Bar (Sleek Horizontal Stripe) */}
          <div className="mb-6">
            <TodaysChallenge
              onboardingComplete={userData?.onboardingComplete ?? true}
              onSetupClick={() => setShowSetupModal(true)}
              handleSync={handleSync}
              syncLoading={syncLoading}
              apiError={submitError}
              setApiError={setSubmitError}
              currentStreak={currentStreak}
              dailyCommitment={dailyCommitment}
              todayLine={todayLine}
              timeLeft={timeLeft}
              todaySubmissionsCount={todaySubmission?.count || 0}
              linkedPlatforms={(userData as any)?.linkedPlatforms}
              syncLogs={syncLogs}
            />
          </div>

          {/* Row 4: Main Workspace Area (Recent Solves on Left, Platforms + Awards on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
            {/* Left Column (2/3 width) - Daily operations */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <RecentSolves recentSolves={recentSolves} />
            </div>

            {/* Right Column (1/3 width) - Integrations & Accomplishments */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <PlatformsWidget
                onLinkageChanged={fetchUserData}
                onboardingComplete={userData?.onboardingComplete ?? true}
              />
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
            </div>
          </div>

          {/* Row 5: Unified Metrics Cards (Wallet, Versus, Leaderboard & DSA Stack) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Column 1 - Wallet Card (Plan stats) */}
            <div className="lg:col-span-1">
              <WalletCard
                plan={userData?.plan}
                monthlyBudget={monthlyBudget}
                completedDays={completedDays}
                missedDays={missedDays}
                dailyCommitment={dailyCommitment}
                graceCoins={graceCoins}
                balance={userData?.balance ?? 0}
                activeDeposit={userData?.activeDeposit ?? 0}
                planStatus={userData?.planStatus}
                onboardingComplete={userData?.onboardingComplete ?? true}
                onRefreshRequest={fetchUserData}
              />
            </div>
            {/* Column 2 - Versus Card (Stakes & duels stats) */}
            <div className="lg:col-span-1">
              <VersusCard
                plan={userData?.plan}
                battleBalance={userData?.battleBalance ?? 0}
                onboardingComplete={userData?.onboardingComplete ?? true}
                onRefreshRequest={fetchUserData}
              />
            </div>
            {/* Column 3 - Stacked Leaderboard & DSA Solves */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <LeaderboardRankCard
                rank={userRank}
                totalUsers={totalUsers}
                loading={leaderboardLoading}
                onboardingComplete={userData?.onboardingComplete ?? true}
              />
              <DsaStatsCard
                stats={userData?.dsaStats}
                onboardingComplete={userData?.onboardingComplete ?? true}
              />
            </div>
          </div>

          {/* Row 5: Mobile Only Calendar */}
          <div className="block lg:hidden">
            <ConsistencyCalendar
              yearMonths={yearMonths}
              onboardingComplete={userData?.onboardingComplete ?? true}
              dayLabels={dayLabels}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              isNextDisabled={isNextDisabled}
            />
          </div>
        </div>

        {/* Modals */}
        <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} joinCode={joinCode} setJoinCode={setJoinCode} />
        <CommitmentModal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          onComplete={() => {
            setShowSetupModal(false);
            fetchUserData();
          }}
          currentBalance={userData?.balance ?? 0}
        />

        <Footer
          faqs={faqs}
          openFaqIndex={openFaqIndex}
          setOpenFaqIndex={setOpenFaqIndex}
        />
      </main>

      {import.meta.env.DEV && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <button
              onClick={() => setDevMenuOpen(!devMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-350 text-xs font-semibold rounded-xl shadow-2xl transition-all cursor-pointer select-none"
            >
              <span>⚙️</span> Developer Tools
            </button>

            {devMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#0F0F13] border border-white/[0.08] rounded-xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={handleDevReset}
                  disabled={devResetLoading}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                >
                  {devResetLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>🗑</span>
                  )}
                  Reset My Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;