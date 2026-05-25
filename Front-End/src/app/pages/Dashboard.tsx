import {
  Code2, Bell, Calendar, TrendingUp, Target, Award, Users,
  ChevronRight, ChevronLeft, CheckCircle, Lock, Bot,
  ChevronDown, HelpCircle, Linkedin,
  AlertTriangle, BarChart3, Flame, TrendingDown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";

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

// ── Types ──
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
}

interface CalendarDay {
  date: string;
  status: "completed" | "missed";
}

export function Dashboard() {
  const location = useLocation();
  const [solutionLink, setSolutionLink] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // ── REAL DATA STATE ──
  const [userData, setUserData] = useState<UserData | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // ── Fetch user data ──
  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        // Token expired → login pe bhejo
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

  // ── Fetch calendar data ──
const fetchCalendar = async () => {
  try {
    const month = String(new Date().getMonth() + 1); // current month
    const year = String(calendarYear);
    
    const res = await fetch(
      `${API}/api/submissions/calendar?month=${month}&year=${year}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setCalendarData(data); // array of { date, status }
  } catch (err) {
    console.error("Calendar fetch error:", err);
  }
};

  // ── On mount: fetch everything ──
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchCalendar()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
  if (!loading) fetchCalendar();
}, [calendarYear]);

  // ── Midnight countdown (after submit) ──
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

  // ── Real Submit Handler ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionLink) return;
    setSubmitError("");

    try {
      const res = await fetch(`${API}/api/submissions/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ link: solutionLink }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || "Submission failed.");
        return;
      }

      setSubmitted(true);
      // Refresh user data (streak update ke liye)
      await fetchUserData();
      await fetchCalendar();
    } catch (err) {
      setSubmitError("Network error. Try again.");
    }
  };

  // ── Derived values from real data ──
  const currentStreak = userData?.streak ?? 0;
  const completedDays = userData?.totalSolved ?? 0;
  const missedDays = userData?.totalMissed ?? 0;
  const total = completedDays + missedDays;
  const consistencyScore = total > 0 ? Math.round((completedDays / total) * 100) : 0;
  const balance = userData?.balance ?? 0;
  const dailyCommitment = userData?.dailyCommitment ?? 0;
  const graceCoins = userData?.graceCoins ?? 0;
  const monthlyBudget = dailyCommitment * 30;
  const balanceUsed = monthlyBudget - balance;

  // ── User initials for avatar ──
  const initials = userData?.name
    ? userData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const todayLine = motivationalLines[new Date().getDate() % motivationalLines.length];

  // ── Calendar logic — real data integrated ──
  const shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // calendarData ko map mein convert karo for O(1) lookup
  const calendarMap = new Map<string, "completed" | "missed">();
  calendarData.forEach((item) => {
    calendarMap.set(item.date.split("T")[0], item.status);
  });

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
        const dateStr = cellDate.toISOString().split("T")[0];
        let status: "completed" | "missed" | "pending" = "pending";

        if (cellDate < today) {
          // Real data se status lo, nahi mila toh "missed"
          status = calendarMap.get(dateStr) ?? "missed";
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

  // ── Static data (baad mein real banayenge) ──
  const recentSolves = [
    { platform: "LC", name: "Two Sum", difficulty: "Easy", topic: "Arrays", time: "2h ago" },
    { platform: "GFG", name: "Binary Search", difficulty: "Easy", topic: "Searching", time: "Yesterday" },
    { platform: "LC", name: "LRU Cache", difficulty: "Hard", topic: "Design", time: "3d ago" },
    { platform: "LC", name: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", time: "4d ago" },
    { platform: "GFG", name: "Merge Sort", difficulty: "Medium", topic: "Sorting", time: "5d ago" },
  ];

  const aiInsights = [
    { icon: AlertTriangle, text: "High streak-break risk this weekend", color: "text-yellow-400" },
    { icon: Target, text: "Recommended Focus: Medium Binary Search", color: "text-violet-400" },
    { icon: BarChart3, text: "Consistency improved this week", color: "text-emerald-400" },
    { icon: Flame, text: "Strongest Topic: Arrays", color: "text-orange-400" },
    { icon: TrendingDown, text: "Weakest Topic: Dynamic Programming", color: "text-red-400" },
  ];

  const faqs = [
    { q: "What is ConsistPay?", a: "A platform designed to build unshakable coding habits by putting small stakes on the line." },
    { q: "How do you verify my submissions?", a: "Paste your daily problem-solving link. We support LeetCode, GeeksforGeeks, Code360, and GitHub commits." },
    { q: "What happens if I miss a day?", a: "If you fail to submit by midnight, your daily commitment amount is deducted from your balance." },
    { q: "How do grace coins work?", a: "Grace coins protect your streak on days you forget to submit. Auto-consumed to save your streak." },
    { q: "Is the platform free to use?", a: "We offer a free tier with basic tracking. Upgrade to Pro for challenges and rewards." },
  ];

  const getDifficultyColor = (d: string) => {
    if (d === "Easy") return "text-emerald-400";
    if (d === "Medium") return "text-orange-400";
    if (d === "Hard") return "text-red-400";
    return "text-zinc-400";
  };

  const getPlatformStyle = (p: string) => {
    if (p === "LC") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (p === "GFG") return "bg-green-500/20 text-green-400 border-green-500/30";
    return "bg-white/10 text-zinc-400 border-white/20";
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Challenges", path: "/create-challenge" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Pricing", path: "/pricing" },
    { label: "Profile", path: "/profile" },
  ];

  // ── Loading screen ──
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
      {/* Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link key={path} to={path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? "text-violet-300" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-violet-500 rounded-full" />}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
              </div>
              {/* Real user initials */}
              <Link to="/profile"
                className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm"
              >
                {initials}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Row — REAL DATA */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-orange-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">🔥</div>
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{currentStreak}</div>
              <div className="text-sm text-zinc-400">Current Streak</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">✅</div>
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{completedDays}</div>
              <div className="text-sm text-zinc-400">Completed</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-red-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">❌</div>
              </div>
              <div className="text-3xl font-bold mb-1">{missedDays}</div>
              <div className="text-sm text-zinc-400">Missed Days</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">📊</div>
                <Award className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{consistencyScore}</div>
              <div className="text-sm text-zinc-400">Score / 100</div>
            </div>
          </div>
        </div>

        {/* Today's Challenge + Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${submitted ? "from-emerald-500/20 to-teal-500/20" : "from-violet-500/20 to-purple-500/20"} rounded-2xl blur-xl opacity-50`} />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Today's Challenge</h2>
                  <span className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${submitted ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-zinc-400 bg-white/5 border-white/10"}`}>
                    {submitted ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-zinc-500" />}
                    {submitted ? "Completed" : "Pending"}
                  </span>
                </div>

                {!submitted && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-2">Solved a coding problem today?</h3>
                      <p className="text-zinc-400 text-sm">Paste your solution link from LeetCode, Code360 or any platform</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="solution" className="block text-sm text-zinc-400 mb-2">Paste your solution link</label>
                        <Input
                          id="solution"
                          type="url"
                          placeholder="https://leetcode.com/submissions/detail/..."
                          value={solutionLink}
                          onChange={(e) => setSolutionLink(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20"
                        />
                      </div>
                      {submitError && (
                        <p className="text-sm text-red-400">{submitError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={!solutionLink}
                        className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
                          solutionLink
                            ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30"
                            : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/10"
                        }`}
                      >
                        Submit Solution
                      </button>
                    </form>
                  </>
                )}

                {submitted && (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Proof Submitted!</h3>
                    <p className="text-zinc-400 text-sm mb-5">Today's coding session is locked in.</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <div className="text-2xl font-black text-emerald-400">{currentStreak}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">🔥 Day Streak</div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                        <div className="text-2xl font-black text-yellow-400">₹{dailyCommitment}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">🪙 Secured today</div>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
                      <p className="text-sm text-zinc-300 italic">"{todayLine}"</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-3">
                        <Lock className="w-3.5 h-3.5" />
                        Next submission unlocks in
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        {[{ val: timeLeft.h, label: "hrs" }, { val: timeLeft.m, label: "min" }, { val: timeLeft.s, label: "sec" }].map(({ val, label }) => (
                          <div key={label} className="text-center">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                              {String(val).padStart(2, "0")}
                            </div>
                            <div className="text-xs text-zinc-500 mt-1">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


{/* Wallet Balance Card */}
<div>
  <div className="relative h-full">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Wallet</h2>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
          userData?.plan === "pro" 
            ? "text-violet-400 bg-violet-500/10 border-violet-500/20" 
            : "text-zinc-400 bg-white/5 border-white/10"
        }`}>
          {userData?.plan === "pro" ? "⚡ Pro" : "Free"}
        </span>
      </div>

      {/* Deposited */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="text-xs text-zinc-500 mb-1">Total Deposited</div>
        <div className="text-2xl font-bold text-white">₹{monthlyBudget}</div>
        <div className="text-xs text-zinc-500 mt-0.5">held securely this month</div>
      </div>

      {/* Secured vs Lost */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-zinc-400 mb-1">🔒 Secured</div>
          <div className="text-xl font-bold text-emerald-400">
            ₹{completedDays * dailyCommitment}
          </div>
          <div className="text-xs text-zinc-500">{completedDays} days</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-zinc-400 mb-1">💸 Lost</div>
          <div className="text-xl font-bold text-red-400">
            ₹{missedDays * dailyCommitment}
          </div>
          <div className="text-xs text-zinc-500">{missedDays} days</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-zinc-400">Monthly Progress</span>
          <span className="text-zinc-400">{completedDays}/30 days</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedDays / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Month end payout */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="text-xs text-zinc-400 mb-1">💰 Month-end Payout</div>
        <div className="text-2xl font-bold text-yellow-400">
          ₹{completedDays * dailyCommitment}
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          {30 - completedDays - missedDays > 0 
            ? `${30 - completedDays - missedDays} days left — keep submitting!`
            : "Month complete! 🎉"}
        </div>
      </div>

      {/* Grace coins */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <span className="text-sm text-zinc-400">🛡️ Grace Coins</span>
        <span className="text-sm font-semibold text-emerald-400">{graceCoins} available</span>
      </div>

    </div>
  </div>
</div>


</div>

        {/* Calendar — REAL DATA */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Consistency Calendar
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCalendarYear(calendarYear - 1)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium min-w-[60px] text-center">{calendarYear}</span>
                  <button onClick={() => setCalendarYear(calendarYear + 1)} className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  <div className="flex flex-col gap-[3px] mt-[20px] shrink-0">
                    {dayLabels.map((d) => (
                      <div key={d} className="h-[13px] flex items-center">
                        <span className="text-[10px] text-zinc-500 w-6 text-right">{d}</span>
                      </div>
                    ))}
                  </div>
                  {yearMonths.map((month) => (
                    <div key={month.name} className="flex flex-col gap-1">
                      <div className="text-xs text-zinc-500 font-medium ml-1">{month.name}</div>
                      <div className="flex gap-[3px]">
                        {month.weeks.map((week, weekIdx) => (
                          <div key={weekIdx} className="flex flex-col gap-[3px]">
                            {week.map((cell, dayIdx) => (
                              <div
                                key={dayIdx}
                                className={`w-[13px] h-[13px] rounded-[3px] transition-colors ${
                                  cell.status === "completed" ? "bg-[#10B981]/25 border border-[#10B981]/40" :
                                  cell.status === "missed" ? "bg-[#EF4444]/25 border border-[#EF4444]/40" :
                                  cell.status === "pending" ? "bg-[#374151]" : "bg-transparent"
                                }`}
                                title={cell.date ? `${cell.date.toLocaleDateString()} — ${cell.status}` : ""}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-white/10">
                {[["completed","#10B981"], ["missed","#EF4444"], ["pending","#374151"]].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: `${color}40`, border: `1px solid ${color}66` }} />
                    <span className="text-xs text-zinc-400 capitalize">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Solves + AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-7">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                <h2 className="text-xl font-bold mb-5">Recent Solves</h2>
                <div className="space-y-3">
                  {recentSolves.map((solve, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                      <span className={`shrink-0 px-2.5 py-1 text-xs font-bold rounded border ${getPlatformStyle(solve.platform)}`}>{solve.platform}</span>
                      <span className="font-semibold text-sm">{solve.name}</span>
                      <span className={`text-xs font-medium ${getDifficultyColor(solve.difficulty)}`}>{solve.difficulty}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">{solve.topic}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500 ml-auto shrink-0">{solve.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-400" /> AI Performance Insights
                </h2>
                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-zinc-400">Placement Readiness</span>
                    <span className="font-bold text-emerald-400">{consistencyScore}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${consistencyScore}%` }} />
                  </div>
                </div>
                <div className="space-y-3">
                  {aiInsights.map(({ icon: Icon, text, color }, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                      <span className="text-sm text-zinc-300">{text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 mt-4 text-center">Powered by Gemini AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJoinModal(false)} />
            <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h2 className="text-xl font-bold mb-2">Join a Challenge</h2>
              <p className="text-zinc-400 text-sm mb-6">Enter the invite code shared by your friend</p>
              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">Invite Code</label>
                <input
                  type="text"
                  placeholder="e.g. CP-X7K2M"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 font-mono tracking-widest text-center text-lg uppercase"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowJoinModal(false)} className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">Cancel</button>
                <Link to={`/join-challenge/${joinCode}`} className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm text-center ${joinCode.length >= 5 ? "bg-gradient-to-r from-violet-500 to-purple-600" : "bg-white/5 text-zinc-600 pointer-events-none"}`}>
                  Join Challenge
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-16 pt-16 border-t border-white/10">
          <div className="mb-16 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
                <HelpCircle className="w-6 h-6 text-violet-400" /> Frequently Asked Questions
              </h2>
              <p className="text-sm text-zinc-400">Everything you need to know about building your coding habit.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
                  <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-medium text-zinc-200">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${openFaqIndex === idx ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="p-4 pt-0 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link to="/dashboard" className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">ConsistPay</span>
              </Link>
              <p className="text-sm text-zinc-400 mb-6 max-w-xs">Building the 1% of developers who show up every day.</p>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/in/vansh-vijay/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="https://www.linkedin.com/in/prateekpatidar1008/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/create-challenge" className="text-sm text-zinc-400 hover:text-white transition-colors">Challenges</Link></li>
                <li><Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
            <p>© 2026 ConsistPay. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Built with persistence.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}


// imporcd t {
//   Code2, Bell, Calendar, TrendingUp, Target, Award, Users,
//   ChevronRight, ChevronLeft, CheckCircle, Lock, Bot,
//   ChevronDown, HelpCircle, Linkedin,
//   AlertTriangle, BarChart3, Flame, TrendingDown
// } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { Input } from "../components/ui/input";

// const motivationalLines = [
//   "You showed up. That's what counts.",
//   "₹5 secured. Streak intact. 🔥",
//   "Commitment protected. See you tomorrow.",
//   "Another day coded. Another day closer.",
//   "Small wins compound. Keep going.",
//   "You didn't quit today. That's enough.",
//   "Consistency beats talent. Proven today.",
//   "Future you is grateful for today's you.",
//   "The grind is quiet. The results are loud.",
//   "One problem a day keeps mediocrity away.",
//   "You kept your word to yourself. 💪",
//   "Champions show up even when they don't feel like it.",
//   "Progress > Perfection. Always.",
//   "Streak alive. Mind sharp. Keep moving.",
//   "Today's effort is tomorrow's edge.",
// ];

// export function Dashboard() {
//   const location = useLocation();
//   const [solutionLink, setSolutionLink] = useState("");
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [joinCode, setJoinCode] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
//   const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

//   // ── FAQ Data ──
//   const faqs = [
//     {
//       q: "What is ConsistPay?",
//       a: "A platform designed to build unshakable coding habits by putting small stakes on the line. Show up, code, and keep your stake. Miss a day, and you lose it."
//     },
//     {
//       q: "How do you verify my submissions?",
//       a: "Simply paste your daily problem-solving link. We support LeetCode, GeeksforGeeks, Code360, and GitHub commits to verify your daily consistency."
//     },
//     {
//       q: "What happens if I miss a day?",
//       a: "If you fail to submit proof by midnight, you lose your daily commitment stake, which is distributed to the community or burned."
//     },
//     {
//       q: "How do grace coins work?",
//       a: "Life happens. Grace coins act as a safety net. If you forget to submit one day, a grace coin is automatically consumed to protect your streak and your stake."
//     },
//     {
//       q: "Is the platform free to use?",
//       a: "We offer a free tier with basic habit tracking. To join real-stakes challenges and earn rewards, you can upgrade or join specific premium challenges."
//     }
//   ];

//   // Calendar year state
//   const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

//   // Daily motivational line — same all day, changes next day
//   const todayLine = motivationalLines[new Date().getDate() % motivationalLines.length];

//   // Midnight countdown timer
//   useEffect(() => {
//     if (!submitted) return;
//     const interval = setInterval(() => {
//       const now = new Date();
//       const midnight = new Date();
//       midnight.setHours(24, 0, 0, 0);
//       const diff = midnight.getTime() - now.getTime();
//       const h = Math.floor(diff / (1000 * 60 * 60));
//       const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const s = Math.floor((diff % (1000 * 60)) / 1000);
//       setTimeLeft({ h, m, s });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [submitted]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!solutionLink) return;
//     setSubmitted(true);
//   };

//   // ── Nav links ──
//   const navLinks = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "Challenges", path: "/create-challenge" },
//     { label: "Leaderboard", path: "/leaderboard" },
//     { label: "Pricing", path: "/pricing" },
//     { label: "Profile", path: "/profile" },
//   ];

//   // ── Mock data ──
//   const currentStreak = 47;
//   const completedDays = 38;
//   const missedDays = 9;
//   const consistencyScore = 82;
//   const coins = 235;
//   const dailyCommitment = 5;
//   const graceCoins = 2;
//   const monthlyCoins = 150;
//   const coinsUsed = monthlyCoins - coins;

//   // ── Calendar logic — GitHub-style yearly heatmap ──
//   const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   // Group by month to add space between them
//   const buildMonthsGrid = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const months = [];

//     for (let m = 0; m < 12; m++) {
//       const daysInMonth = new Date(calendarYear, m + 1, 0).getDate();
//       const firstDay = new Date(calendarYear, m, 1).getDay(); // 0=Sun

//       const weeks: ({ status: "completed" | "missed" | "pending" | "empty"; date?: Date })[][] = [];
//       let currentWeek: ({ status: "completed" | "missed" | "pending" | "empty"; date?: Date })[] = [];

//       // Fill empty cells before 1st
//       for (let i = 0; i < firstDay; i++) {
//         currentWeek.push({ status: "empty" });
//       }

//       for (let d = 1; d <= daysInMonth; d++) {
//         const cellDate = new Date(calendarYear, m, d);
//         let status: "completed" | "missed" | "pending" = "pending";
//         if (cellDate < today) {
//           status = d % 5 === 0 ? "missed" : "completed";
//         }
//         currentWeek.push({ status, date: cellDate });
//         if (currentWeek.length === 7) {
//           weeks.push(currentWeek);
//           currentWeek = [];
//         }
//       }
      
//       // Fill remaining empty to complete the week
//       if (currentWeek.length > 0) {
//         while (currentWeek.length < 7) {
//           currentWeek.push({ status: "empty" });
//         }
//         weeks.push(currentWeek);
//       }
      
//       months.push({ monthIndex: m, name: shortMonths[m], weeks });
//     }
//     return months;
//   };

//   const yearMonths = buildMonthsGrid();

//   // ── Recent Solves (hardcoded) ──
//   const recentSolves = [
//     { platform: "LC", name: "Two Sum", difficulty: "Easy", topic: "Arrays", time: "2h ago" },
//     { platform: "GFG", name: "Binary Search", difficulty: "Easy", topic: "Searching", time: "Yesterday" },
//     { platform: "LC", name: "LRU Cache", difficulty: "Hard", topic: "Design", time: "3d ago" },
//     { platform: "LC", name: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", time: "4d ago" },
//     { platform: "GFG", name: "Merge Sort", difficulty: "Medium", topic: "Sorting", time: "5d ago" },
//   ];

//   // ── AI Insights (hardcoded) ──
//   const aiInsights = [
//     { icon: AlertTriangle, text: "High streak-break risk this weekend", color: "text-yellow-400" },
//     { icon: Target, text: "Recommended Focus: Medium Binary Search", color: "text-violet-400" },
//     { icon: BarChart3, text: "Consistency improved by 12% this week", color: "text-emerald-400" },
//     { icon: Flame, text: "Strongest Topic: Arrays", color: "text-orange-400" },
//     { icon: TrendingDown, text: "Weakest Topic: Dynamic Programming", color: "text-red-400" },
//   ];

//   // ── Helpers ──
//   const getDifficultyColor = (d: string) => {
//     if (d === "Easy") return "text-emerald-400";
//     if (d === "Medium") return "text-orange-400";
//     if (d === "Hard") return "text-red-400";
//     return "text-zinc-400";
//   };

//   const getPlatformStyle = (p: string) => {
//     if (p === "LC") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
//     if (p === "GFG") return "bg-green-500/20 text-green-400 border-green-500/30";
//     return "bg-white/10 text-zinc-400 border-white/20";
//   };

//   return (
//     <div className="min-h-screen text-white" style={{ backgroundColor: "#0D0D0F" }}>
//       {/* Background Gradient */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
//         <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
//       </div>

//       {/* ════════════════ NAVBAR ════════════════ */}
//       <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
//               <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
//                 <Code2 className="w-6 h-6 text-white" />
//               </div>
//               <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
//                 ConsistPay
//               </span>
//             </Link>

//             {/* Nav Links */}
//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map(({ label, path }) => {
//                 const isActive = location.pathname === path;
//                 return (
//                   <Link
//                     key={path}
//                     to={path}
//                     className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                       isActive
//                         ? "text-violet-300"
//                         : "text-zinc-400 hover:text-white hover:bg-white/5"
//                     }`}
//                   >
//                     {label}
//                     {isActive && (
//                       <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-violet-500 rounded-full" />
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* User Controls */}
//             <div className="flex items-center gap-3 shrink-0">
//               {/* Bell — decoration only */}
//               <div className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
//               </div>
//               {/* YU Avatar */}
//               <Link
//                 to="/profile"
//                 className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm"
//               >
//                 YU
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* ════════════════ MAIN CONTENT ════════════════ */}
//       <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* ──── Stats Row ──── */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {/* Current Streak */}
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-orange-500/30 transition-all">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="text-3xl">🔥</div>
//                 <TrendingUp className="w-4 h-4 text-orange-400" />
//               </div>
//               <div className="text-3xl font-bold mb-1">{currentStreak}</div>
//               <div className="text-sm text-zinc-400">Current Streak</div>
//             </div>
//           </div>

//           {/* Completed */}
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-all">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="text-3xl">✅</div>
//                 <Target className="w-4 h-4 text-emerald-400" />
//               </div>
//               <div className="text-3xl font-bold mb-1">{completedDays}</div>
//               <div className="text-sm text-zinc-400">Completed</div>
//             </div>
//           </div>

//           {/* Missed */}
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-red-500/30 transition-all">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="text-3xl">❌</div>
//               </div>
//               <div className="text-3xl font-bold mb-1">{missedDays}</div>
//               <div className="text-sm text-zinc-400">Missed Days</div>
//             </div>
//           </div>

//           {/* Consistency Score */}
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-violet-500/30 transition-all">
//               <div className="flex items-start justify-between mb-3">
//                 <div className="text-3xl">📊</div>
//                 <Award className="w-4 h-4 text-violet-400" />
//               </div>
//               <div className="text-3xl font-bold mb-1">{consistencyScore}</div>
//               <div className="text-sm text-zinc-400">Score / 100</div>
//             </div>
//           </div>
//         </div>

//         {/* ──── Today's Challenge (left) + Coin Balance (right) ──── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Today's Challenge — 2/3 */}
//           <div className="lg:col-span-2">
//             <div className="relative">
//               <div
//                 className={`absolute inset-0 bg-gradient-to-br ${
//                   submitted
//                     ? "from-emerald-500/20 to-teal-500/20"
//                     : "from-violet-500/20 to-purple-500/20"
//                 } rounded-2xl blur-xl opacity-50`}
//               />
//               <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold">Today's Challenge</h2>
//                   <span
//                     className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${
//                       submitted
//                         ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
//                         : "text-zinc-400 bg-white/5 border-white/10"
//                     }`}
//                   >
//                     {submitted ? (
//                       <CheckCircle className="w-3.5 h-3.5" />
//                     ) : (
//                       <div className="w-2 h-2 rounded-full bg-zinc-500" />
//                     )}
//                     {submitted ? "Completed" : "Pending"}
//                   </span>
//                 </div>

//                 {/* STATE 1 — Pending */}
//                 {!submitted && (
//                   <>
//                     <div className="mb-6">
//                       <h3 className="text-2xl font-semibold mb-2">
//                         Solved a coding problem today?
//                       </h3>
//                       <p className="text-zinc-400 text-sm">
//                         Paste your solution link from LeetCode, Code360 or any platform
//                       </p>
//                     </div>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                       <div>
//                         <label htmlFor="solution" className="block text-sm text-zinc-400 mb-2">
//                           Paste your solution link
//                         </label>
//                         <Input
//                           id="solution"
//                           type="url"
//                           placeholder="https://leetcode.com/submissions/detail/..."
//                           value={solutionLink}
//                           onChange={(e) => setSolutionLink(e.target.value)}
//                           className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20"
//                         />
//                       </div>
//                       <button
//                         type="submit"
//                         disabled={!solutionLink}
//                         className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
//                           solutionLink
//                             ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
//                             : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/10"
//                         }`}
//                       >
//                         Submit Solution
//                       </button>
//                     </form>
//                   </>
//                 )}

//                 {/* STATE 2 — Success */}
//                 {submitted && (
//                   <div className="text-center py-4">
//                     <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
//                       <CheckCircle className="w-8 h-8 text-white" />
//                     </div>
//                     <h3 className="text-xl font-bold mb-1">Proof Submitted!</h3>
//                     <p className="text-zinc-400 text-sm mb-5">
//                       Today's coding session is locked in.
//                     </p>
//                     <div className="grid grid-cols-2 gap-3 mb-5">
//                       <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
//                         <div className="text-2xl font-black text-emerald-400">48</div>
//                         <div className="text-xs text-zinc-400 mt-0.5">🔥 Day Streak</div>
//                       </div>
//                       <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
//                         <div className="text-2xl font-black text-yellow-400">₹5</div>
//                         <div className="text-xs text-zinc-400 mt-0.5">🪙 Secured today</div>
//                       </div>
//                     </div>
//                     <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5">
//                       <p className="text-sm text-zinc-300 italic">"{todayLine}"</p>
//                     </div>
//                     <div className="bg-white/5 border border-white/10 rounded-xl p-4">
//                       <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-3">
//                         <Lock className="w-3.5 h-3.5" />
//                         Next submission unlocks in
//                       </div>
//                       <div className="flex items-center justify-center gap-3">
//                         {[
//                           { val: timeLeft.h, label: "hrs" },
//                           { val: timeLeft.m, label: "min" },
//                           { val: timeLeft.s, label: "sec" },
//                         ].map(({ val, label }) => (
//                           <div key={label} className="text-center">
//                             <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white">
//                               {String(val).padStart(2, "0")}
//                             </div>
//                             <div className="text-xs text-zinc-500 mt-1">{label}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Coin Balance — 1/3 */}
//           <div>
//             <div className="relative h-full">
//               <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />
//               <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
//                 <h2 className="text-xl font-bold mb-6">Coin Balance</h2>
//                 <div className="text-center mb-6">
//                   <div className="text-5xl mb-2">🪙</div>
//                   <div className="text-4xl font-bold mb-1">{coins}</div>
//                   <div className="text-sm text-zinc-400">coins remaining</div>
//                 </div>
//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-zinc-400">Daily commitment:</span>
//                     <span className="font-semibold">{dailyCommitment} coins</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-zinc-400">Grace coins:</span>
//                     <span className="font-semibold text-emerald-400">{graceCoins} available</span>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-2">
//                     <span className="text-zinc-400">Monthly usage</span>
//                     <span className="text-xs text-zinc-500">
//                       {coinsUsed} / {monthlyCoins}
//                     </span>
//                   </div>
//                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
//                       style={{ width: `${Math.max(0, (coinsUsed / monthlyCoins) * 100)}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ──── Consistency Calendar — GitHub-style Heatmap ──── */}
//         <div className="mb-6">
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
//             <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
//               {/* Header */}
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold flex items-center gap-2">
//                   <Calendar className="w-5 h-5" />
//                   Consistency Calendar
//                 </h2>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setCalendarYear(calendarYear - 1)}
//                     className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   <span className="text-sm font-medium min-w-[60px] text-center">
//                     {calendarYear}
//                   </span>
//                   <button
//                     onClick={() => setCalendarYear(calendarYear + 1)}
//                     className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Heatmap */}
//               <div className="overflow-x-auto pb-4">
//                 <div className="flex gap-4 min-w-max">
//                   {/* Day labels */}
//                   <div className="flex flex-col gap-[3px] mt-[20px] shrink-0">
//                     {dayLabels.map((d) => (
//                       <div key={d} className="h-[13px] flex items-center">
//                         <span className="text-[10px] text-zinc-500 w-6 text-right">
//                           {d}
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Months */}
//                   {yearMonths.map((month) => (
//                     <div key={month.name} className="flex flex-col gap-1">
//                       {/* Month label */}
//                       <div className="text-xs text-zinc-500 font-medium ml-1">
//                         {month.name}
//                       </div>
//                       {/* Month grid */}
//                       <div className="flex gap-[3px]">
//                         {month.weeks.map((week, weekIdx) => (
//                           <div key={weekIdx} className="flex flex-col gap-[3px]">
//                             {week.map((cell, dayIdx) => (
//                               <div
//                                 key={dayIdx}
//                                 className={`w-[13px] h-[13px] rounded-[3px] transition-colors ${
//                                   cell.status === "completed" ? "bg-[#10B981]/25 border border-[#10B981]/40" :
//                                   cell.status === "missed" ? "bg-[#EF4444]/25 border border-[#EF4444]/40" :
//                                   cell.status === "pending" ? "bg-[#374151]" :
//                                   "bg-transparent"
//                                 }`}
//                                 title={
//                                   cell.date
//                                     ? `${cell.date.toLocaleDateString()} — ${cell.status}`
//                                     : ""
//                                 }
//                               />
//                             ))}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Legend */}
//               <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-white/10">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-[3px] bg-[#10B981]/25 border border-[#10B981]/40" />
//                   <span className="text-xs text-zinc-400">Completed</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-[3px] bg-[#EF4444]/25 border border-[#EF4444]/40" />
//                   <span className="text-xs text-zinc-400">Missed</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-[3px] bg-[#374151]" />
//                   <span className="text-xs text-zinc-400">Pending</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ──── Recent Solves (55%) + AI Insights (45%) ──── */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
//           {/* Recent Solves — Left */}
//           <div className="lg:col-span-7">
//             <div className="relative h-full">
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-50" />
//               <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
//                 <h2 className="text-xl font-bold mb-5">Recent Solves</h2>
//                 <div className="space-y-3">
//                   {recentSolves.map((solve, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
//                     >
//                       {/* Platform Badge */}
//                       <span
//                         className={`shrink-0 px-2.5 py-1 text-xs font-bold rounded border ${getPlatformStyle(
//                           solve.platform
//                         )}`}
//                       >
//                         {solve.platform}
//                       </span>
//                       {/* Problem Name */}
//                       <span className="font-semibold text-sm">{solve.name}</span>
//                       {/* Difficulty */}
//                       <span className={`text-xs font-medium ${getDifficultyColor(solve.difficulty)}`}>
//                         {solve.difficulty}
//                       </span>
//                       <span className="text-zinc-600">•</span>
//                       {/* Topic */}
//                       <span className="text-xs text-zinc-500">{solve.topic}</span>
//                       <span className="text-zinc-600">•</span>
//                       {/* Time */}
//                       <span className="text-xs text-zinc-500 ml-auto shrink-0">{solve.time}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* AI Performance Insights — Right */}
//           <div className="lg:col-span-5">
//             <div className="relative h-full">
//               <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
//               <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
//                 <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
//                   <Bot className="w-5 h-5 text-violet-400" />
//                   AI Performance Insights
//                 </h2>

//                 {/* Placement Readiness */}
//                 <div className="mb-5">
//                   <div className="flex items-center justify-between text-sm mb-2">
//                     <span className="text-zinc-400">Placement Readiness</span>
//                     <span className="font-bold text-emerald-400">82%</span>
//                   </div>
//                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
//                       style={{ width: "82%" }}
//                     />
//                   </div>
//                 </div>

//                 {/* Insight Items */}
//                 <div className="space-y-3">
//                   {aiInsights.map(({ icon: Icon, text, color }, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
//                     >
//                       <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
//                       <span className="text-sm text-zinc-300">{text}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Powered by */}
//                 <p className="text-xs text-zinc-600 mt-4 text-center">Powered by Gemini AI</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ──── Join with Code Modal ──── */}
//         {showJoinModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//             <div
//               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//               onClick={() => setShowJoinModal(false)}
//             />
//             <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
//               <h2 className="text-xl font-bold mb-2">Join a Challenge</h2>
//               <p className="text-zinc-400 text-sm mb-6">
//                 Enter the invite code shared by your friend
//               </p>
//               <div className="mb-4">
//                 <label className="block text-sm text-zinc-400 mb-2">Invite Code</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. CP-X7K2M"
//                   value={joinCode}
//                   onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 font-mono tracking-widest text-center text-lg uppercase"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowJoinModal(false)}
//                   className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <Link
//                   to={`/join-challenge/${joinCode}`}
//                   className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm text-center ${
//                     joinCode.length >= 5
//                       ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/30 pointer-events-auto"
//                       : "bg-white/5 text-zinc-600 pointer-events-none"
//                   }`}
//                 >
//                   Join Challenge
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ════════════════ FOOTER ════════════════ */}
//         <footer className="mt-16 pt-16 border-t border-white/10">
          
//           {/* FAQ SECTION */}
//           <div className="mb-16 max-w-3xl mx-auto">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
//                 <HelpCircle className="w-6 h-6 text-violet-400" />
//                 Frequently Asked Questions
//               </h2>
//               <p className="text-sm text-zinc-400">Everything you need to know about building your coding habit.</p>
//             </div>
//             <div className="space-y-3">
//               {faqs.map((faq, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20"
//                 >
//                   <button
//                     onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
//                     className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
//                   >
//                     <span className="font-medium text-zinc-200">{faq.q}</span>
//                     <ChevronDown
//                       className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
//                         openFaqIndex === idx ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ${
//                       openFaqIndex === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
//                     }`}
//                   >
//                     <p className="p-4 pt-0 text-sm text-zinc-400 leading-relaxed">
//                       {faq.a}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//             {/* Brand Column */}
//             <div>
//               <Link to="/dashboard" className="flex items-center gap-3 mb-4">
//                 <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
//                   <Code2 className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
//                   ConsistPay
//                 </span>
//               </Link>
//               <p className="text-sm text-zinc-400 mb-6 max-w-xs">
//                 Building the 1% of developers who show up every day.
//               </p>
//               <div className="flex items-center gap-4">
//                 <a href="https://www.linkedin.com/in/vansh-vijay/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors" title="Vansh Vijay LinkedIn">
//                   <Linkedin className="w-5 h-5" />
//                 </a>
//                 <a href="https://www.linkedin.com/in/prateekpatidar1008/" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors" title="Prateek Patidar LinkedIn">
//                   <Linkedin className="w-5 h-5" />
//                 </a>
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h3 className="font-bold mb-4">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link></li>
//                 <li><Link to="/create-challenge" className="text-sm text-zinc-400 hover:text-white transition-colors">Challenges</Link></li>
//                 <li><Link to="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link></li>
//               </ul>
//             </div>

//             {/* Legal */}
//             <div>
//               <h3 className="font-bold mb-4">Legal</h3>
//               <ul className="space-y-2">
//                 <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link></li>
//                 <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms of Service</Link></li>
//                 <li><Link to="#" className="text-sm text-zinc-400 hover:text-white transition-colors">Refund Policy</Link></li>
//               </ul>
//             </div>
//           </div>
//           <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
//             <p>© 2026 ConsistPay. All rights reserved.</p>
//             <p className="mt-2 md:mt-0">Built with persistence.</p>
//           </div>
//         </footer>
//       </main>
//     </div>
//   );
// }