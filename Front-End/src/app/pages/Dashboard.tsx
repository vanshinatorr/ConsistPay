import { AlertTriangle, BarChart3, Flame, TrendingDown, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Navbar } from "./dashboard/Navbar";
import { StatsRow } from "./dashboard/StatsRow";
import { TodaysChallenge } from "./dashboard/TodaysChallenge";
import { WalletCard } from "./dashboard/WalletCard";
import { ConsistencyCalendar } from "./dashboard/ConsistencyCalendar";
import { RecentSolves } from "./dashboard/RecentSolves";
import { AiInsights } from "./dashboard/AiInsights";
import { JoinModal } from "./dashboard/JoinModal";
import { Footer } from "./dashboard/Footer";

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
  graceCoins: number;
  dailyCommitment: number;
  totalSolved: number;
  totalMissed: number;
  battleBalance: number;
}

interface CalendarDay {
  date: string;
  status: "completed" | "missed";
}

export function Dashboard() {
  // ✅ UPDATED: problemName + screenshot instead of solutionLink
  const [problemName, setProblemName] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [userData, setUserData] = useState<UserData | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [todaySubmission, setTodaySubmission] = useState<any>(null);
  const [recentSolves, setRecentSolves] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const fetchCalendar = async () => {
    try {
      const month = String(new Date().getMonth() + 1);
      const year = String(calendarYear);
      const res = await fetch(
        `${API}/api/submissions/calendar?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        console.error("Calendar fetch failed:", res.status);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setCalendarData(data);
      } else {
        console.error("Calendar data is not an array:", data);
      }
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
        if (data) {
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
        const formatted = data.slice(0, 5).map((sub: any) => {
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
            time: timeStr
          };
        });
        setRecentSolves(formatted);
      }
    } catch (err) {
      console.error("Error fetching recent solves:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchCalendar(), fetchTodaySubmission(), fetchRecentSolves()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) fetchCalendar();
  }, [calendarYear]);

  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
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
      await fetchUserData();
      await fetchCalendar();
      await fetchTodaySubmission();
      await fetchRecentSolves();
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
  const shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const calendarMap = new Map<string, "completed" | "missed">();
  if (Array.isArray(calendarData)) {
    calendarData.forEach((item) => {
      if (item && item.date) {
        calendarMap.set(item.date.split("T")[0], item.status);
      }
    });
  }

  const buildMonthsGrid = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const months = [];
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(calendarYear, m + 1, 0).getDate();
      const firstDay = new Date(calendarYear, m, 1).getDay();
      const weeks: ({ status: "completed" | "missed" | "pending" | "empty"; date?: Date })[][] = [];
      let currentWeek: ({ status: "completed" | "missed" | "pending" | "empty"; date?: Date })[] = [];
      for (let i = 0; i < firstDay; i++) currentWeek.push({ status: "empty" });
      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(calendarYear, m, d);
        const y = cellDate.getFullYear();
        const mo = String(cellDate.getMonth() + 1).padStart(2, "0");
        const da = String(cellDate.getDate()).padStart(2, "0");
        const dateStr = `${y}-${mo}-${da}`;
        let status: "completed" | "missed" | "pending" | "empty" = "pending";
        if (cellDate < today) {
          status = calendarMap.get(dateStr) ?? "missed";
        } else if (cellDate.getTime() === today.getTime()) {
          status = submitted ? "completed" : "pending";
        }
        currentWeek.push({ status, date: cellDate });
        if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push({ status: "empty" });
        weeks.push(currentWeek);
      }
      months.push({ monthIndex: m, name: shortMonths[m], weeks });
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
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <Navbar initials={initials} plan={userData?.plan} avatar={avatar} isAvatarUrl={isAvatarUrl} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsRow
          currentStreak={currentStreak}
          completedDays={completedDays}
          missedDays={missedDays}
          consistencyScore={consistencyScore}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
          />
          <WalletCard
            plan={userData?.plan}
            monthlyBudget={monthlyBudget}
            completedDays={completedDays}
            missedDays={missedDays}
            dailyCommitment={dailyCommitment}
            graceCoins={graceCoins}
            battleBalance={userData?.battleBalance ?? 0}
          />
        </div>

        <ConsistencyCalendar
          calendarYear={calendarYear}
          setCalendarYear={setCalendarYear}
          dayLabels={dayLabels}
          yearMonths={yearMonths}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <RecentSolves recentSolves={recentSolves} />
          <AiInsights
            isUnlocked={!!todaySubmission}
            aiLoading={aiLoading}
            aiData={todaySubmission || undefined}
          />
        </div>

        <JoinModal
          showJoinModal={showJoinModal}
          setShowJoinModal={setShowJoinModal}
          joinCode={joinCode}
          setJoinCode={setJoinCode}
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