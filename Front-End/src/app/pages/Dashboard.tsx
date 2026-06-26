import { AlertTriangle, BarChart3, Flame, TrendingDown, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./dashboard/Navbar";
import { StatsRow } from "./dashboard/StatsRow";
import { TodaysChallenge } from "./dashboard/TodaysChallenge";
import { WalletCard } from "./dashboard/WalletCard";
import { ConsistencyCalendar } from "./dashboard/ConsistencyCalendar";
import { DashboardBattleWidget } from "./dashboard/DashboardBattleWidget";
import { RecentSolves } from "./dashboard/RecentSolves";
import { AiInsights } from "./dashboard/AiInsights";
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
  // ✅ UPDATED: problemName + screenshot instead of solutionLink
  const [problemName, setProblemName] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

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

  // ✅ UPDATED: screenshot base64 convert karke bhejo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName || !screenshot) return;
    setSubmitError("");
    setAiLoading(true);

    try {
      // Screenshot → base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = () => reject("File read failed");
        reader.readAsDataURL(screenshot);
      });

      const res = await fetch(`${API}/api/submissions/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problemName, screenshot: base64 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Submission failed.");
        return;
      }

      setSubmitted(true);
      setProblemName("");
      setScreenshot(null);
      await Promise.all([
        fetchUserData(),
        fetchCalendarForYears(visibleYears),
        fetchTodaySubmission(),
        fetchRecentSolves(),
      ]);
    } catch (err) {
      setSubmitError("Network error. Try again.");
    } finally {
      setAiLoading(false);
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
          status = "inactive";
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
    { q: "How do you verify my submissions?", a: "Upload your accepted submission screenshot. We support LeetCode, GFG, and Code360." },
    { q: "What happens if I miss a day?", a: "If you fail to submit by midnight, your daily commitment amount is deducted from your balance." },
    { q: "How do grace coins work?", a: "Grace coins protect your streak on days you forget to submit. Auto-consumed to save your streak." },
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

          {/* Row 2: Today's Proof Challenge & Wallet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2">
              {/* ✅ UPDATED props */}
              <TodaysChallenge
                submitted={submitted}
                handleSubmit={handleSubmit}
                problemName={problemName}
                setProblemName={setProblemName}
                screenshot={screenshot}
                setScreenshot={setScreenshot}
                submitError={submitError}
                currentStreak={currentStreak}
                dailyCommitment={dailyCommitment}
                todayLine={todayLine}
                timeLeft={timeLeft}
                aiLoading={aiLoading}
                onboardingComplete={userData?.onboardingComplete ?? true}
                onSetupClick={() => setShowSetupModal(true)}
                todaySubmissionsCount={todaySubmission?.count || 0}
              />
            </div>
            <div className="lg:col-span-1">
              <WalletCard
                plan={userData?.plan}
                monthlyBudget={monthlyBudget}
                completedDays={completedDays}
                missedDays={missedDays}
                dailyCommitment={dailyCommitment}
                graceCoins={graceCoins}
                battleBalance={userData?.battleBalance ?? 0}
                balance={userData?.balance ?? 0}
                onboardingComplete={userData?.onboardingComplete ?? true}
                onRefreshRequest={fetchUserData}
              />
            </div>
          </div>

          {/* Row 3: Mobile Only Calendar */}
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

        <DashboardBattleWidget onRefreshRequest={fetchUserData} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
          {/* Left Column: Rank, Awards, and Recent Solves */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leaderboard Rank Card */}
              <LeaderboardRankCard
                rank={userRank}
                totalUsers={totalUsers}
                loading={leaderboardLoading}
                onboardingComplete={userData?.onboardingComplete ?? true}
              />
              {/* Awards Card */}
              <AwardsCard
                streak={userData?.streak ?? 0}
                consistencyScore={consistencyScore}
                battleBalance={userData?.battleBalance ?? 0}
                graceCoins={userData?.graceCoins ?? 0}
                plan={userData?.plan ?? "free"}
                onboardingComplete={userData?.onboardingComplete ?? true}
              />
            </div>
            {/* Recent Solves */}
            <RecentSolves recentSolves={recentSolves} />
          </div>

          {/* Right Column: AI Insights */}
          <div className="lg:col-span-4">
            <AiInsights
              isUnlocked={!!(todaySubmission && todaySubmission.count > 0)}
              aiLoading={aiLoading}
              aiData={todaySubmission?.submission || undefined}
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
        />

        <Footer
          faqs={faqs}
          openFaqIndex={openFaqIndex}
          setOpenFaqIndex={setOpenFaqIndex}
        />
      </main>
    </div>
  );
}

export default Dashboard;