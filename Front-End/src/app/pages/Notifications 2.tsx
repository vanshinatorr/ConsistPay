import { Code2, ArrowLeft, Bell, CheckCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type NotifType = "streak" | "challenge" | "coin" | "leaderboard" | "grace" | "system";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "streak",
    title: "🔥 Streak Milestone!",
    message: "You've reached a 47-day streak! Keep it up — 3 more days for a Grace Coin!",
    time: "Just now",
    read: false,
    icon: "🔥",
  },
  {
    id: 2,
    type: "challenge",
    title: "⚔️ Challenge Update",
    message: "Alex Kumar submitted today's proof. You're now behind by 87 days. Submit before 11:59 PM!",
    time: "2 hours ago",
    read: false,
    icon: "⚔️",
  },
  {
    id: 3,
    type: "coin",
    title: "🪙 Daily Reminder",
    message: "Don't forget to submit your coding proof today! 5 coins are at stake.",
    time: "5 hours ago",
    read: false,
    icon: "🪙",
  },
  {
    id: 4,
    type: "grace",
    title: "🛡️ Grace Coin Earned!",
    message: "You hit a 15-day streak milestone! +1 Grace Coin added to your balance.",
    time: "Yesterday",
    read: true,
    icon: "🛡️",
  },
  {
    id: 5,
    type: "leaderboard",
    title: "📈 Leaderboard Move",
    message: "You moved up to #8 on the global leaderboard! Keep coding to climb higher.",
    time: "2 days ago",
    read: true,
    icon: "📈",
  },
  {
    id: 6,
    type: "challenge",
    title: "🎉 Challenge Won!",
    message: "You won the 7-day challenge against Rahul Gupta! ₹1000 has been credited.",
    time: "3 days ago",
    read: true,
    icon: "🎉",
  },
  {
    id: 7,
    type: "system",
    title: "⚡ Pro Plan Active",
    message: "Your Pro plan has been activated. Friend challenges and advanced analytics are now unlocked!",
    time: "5 days ago",
    read: true,
    icon: "⚡",
  },
  {
    id: 8,
    type: "streak",
    title: "💔 Streak Lost",
    message: "You missed yesterday's submission. Your streak has been reset. Start fresh today!",
    time: "1 week ago",
    read: true,
    icon: "💔",
  },
];

const typeColors: Record<NotifType, string> = {
  streak: "from-orange-500/20 to-red-500/20 border-orange-500/20",
  challenge: "from-violet-500/20 to-purple-500/20 border-violet-500/20",
  coin: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20",
  leaderboard: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20",
  grace: "from-blue-500/20 to-cyan-500/20 border-blue-500/20",
  system: "from-zinc-500/20 to-zinc-600/20 border-zinc-500/20",
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 text-violet-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm bg-violet-500 text-white px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up! 🎉"}
            </p>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs text-zinc-400"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all text-xs text-zinc-400"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { key: "all", label: `All (${notifications.length})` },
            { key: "unread", label: `Unread (${unreadCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as "all" | "unread")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${filter === key
                  ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">All caught up!</h2>
            <p className="text-zinc-400 text-sm">No {filter === "unread" ? "unread " : ""}notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`relative group cursor-pointer bg-gradient-to-br ${typeColors[notif.type]} backdrop-blur-xl border rounded-2xl p-5 transition-all hover:scale-[1.01]
                  ${!notif.read ? "border-l-4 border-l-violet-500" : ""}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0 mt-0.5">{notif.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-bold text-sm ${!notif.read ? "text-white" : "text-zinc-300"}`}>
                        {notif.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notif.read && (
                          <div className="w-2 h-2 bg-violet-500 rounded-full" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-zinc-500 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${!notif.read ? "text-zinc-300" : "text-zinc-500"}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-zinc-600 mt-2">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}