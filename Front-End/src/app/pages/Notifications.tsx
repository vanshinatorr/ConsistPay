import { Code2, ArrowLeft, Bell, CheckCheck, Trash2, Flame, Sword, Coins, Shield, TrendingUp, Zap, Info, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

type NotifType = "streak" | "challenge" | "coin" | "leaderboard" | "grace" | "system";

interface Notification {
  _id: string;
  id?: string;
  type: NotifType;
  title: string;
  desc: string;
  createdAt: string;
  read: boolean;
}

const typeColors: Record<NotifType, string> = {
  streak: "from-orange-500/20 to-red-500/20 border-orange-500/20 text-orange-400",
  challenge: "from-violet-500/20 to-purple-500/20 border-violet-500/20 text-violet-400",
  coin: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20 text-yellow-400",
  leaderboard: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-emerald-400",
  grace: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400",
  system: "from-zinc-500/20 to-zinc-650/20 border-zinc-500/20 text-zinc-400",
};

const getNotifIcon = (type: NotifType) => {
  switch (type) {
    case "streak": return Flame;
    case "challenge": return Sword;
    case "coin": return Coins;
    case "grace": return Shield;
    case "leaderboard": return TrendingUp;
    case "system": return Zap;
    default: return Info;
  }
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [API_URL, token]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAllRead = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        import("sonner").then(mod => mod.toast.success("All notifications marked as read."));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (notif: Notification) => {
    if (notif.read) return;
    const notifId = notif._id || notif.id;
    if (!notifId) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/${notifId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ read: true })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => (n._id === notifId || n.id === notifId) ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => (n._id !== id && n.id !== id)));
        import("sonner").then(mod => mod.toast.success("Notification deleted."));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      if (diffDays === 1) return "Yesterday";
      return `${diffDays}d ago`;
    } catch (e) {
      return "Some time ago";
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#0D0D0F]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0D0D0F]/80 backdrop-blur-xl">
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
                <span className="text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up"}
            </p>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/[0.04] rounded-lg hover:bg-white/10 transition-all text-xs text-zinc-400"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-[#0F0F13] border border-white/[0.04] rounded-xl p-1 shadow-lg">
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
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-550 text-sm">Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400 mb-4 animate-pulse">
              <Inbox className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">All caught up!</h2>
            <p className="text-zinc-450 text-sm">No {filter === "unread" ? "unread " : ""}notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => {
              const IconComponent = getNotifIcon(notif.type);
              const notifId = notif._id || notif.id || "";
              return (
                <div
                  key={notifId}
                  onClick={() => markRead(notif)}
                  className={`relative group cursor-pointer bg-gradient-to-br ${typeColors[notif.type]} bg-[#0F0F13] border border-white/[0.04] rounded-2xl p-5 transition-all hover:scale-[1.01] shadow-md
                    ${!notif.read ? "border-l-4 border-l-violet-500" : ""}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-black/35 border border-white/[0.02] rounded-xl shrink-0 mt-0.5">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-bold text-sm ${!notif.read ? "text-white" : "text-zinc-300"}`}>
                          {notif.title}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && (
                            <div className="w-2 h-2 bg-violet-500 rounded-full animate-ping" />
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotif(notifId); }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed ${!notif.read ? "text-zinc-300" : "text-zinc-500"}`}>
                        {notif.desc}
                      </p>
                      <p className="text-xs text-zinc-600 mt-2">{formatTime(notif.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}