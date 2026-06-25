import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Swords, Trophy, Flame, Sparkles, X } from "lucide-react";
import { Logo } from "../../components/Logo";
import { Link, useLocation } from "react-router-dom";
import { BattleHubModal } from "../../components/battle/BattleHubModal";

interface NavbarProps {
  initials: string;
  plan?: string;
  avatar?: string;
  isAvatarUrl?: boolean;
}

export function Navbar({ initials, plan = "free", avatar, isAvatarUrl }: NavbarProps) {
  const location = useLocation();
  const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await fetch(`${API_URL}/api/notifications/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state to show all as read instantly
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic UI update for maximum satisfaction feel
    setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
    
    try {
      await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const timeAgo = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Battles", path: "/create-challenge" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Pricing", path: "/pricing" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0F0F13]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Logo className="w-6 h-6 text-white" />
              </div>

              <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ConsistPay
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, path }) => {
                const isActive = location.pathname === path;
                const isBattles = label === "Battles";

                if (isBattles) {
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-violet-300"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-violet-400 to-purple-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                      )}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-violet-300"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}

                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-violet-400 to-purple-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifs(!showNotifs);
                    if (!showNotifs) fetchNotifications(); // fetch when opened
                  }}
                  onBlur={() => setTimeout(() => setShowNotifs(false), 200)}
                  className={`relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    showNotifs 
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]" 
                      : "bg-white/5 border border-white/[0.04] text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#0F0F13]" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {showNotifs && (
                  <div className="absolute right-0 mt-3 w-[380px] bg-[#0F0F13] border border-white/[0.04] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    
                    <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.02] backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-violet-500/20 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} NEW
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onMouseDown={(e) => { e.preventDefault(); handleMarkAsRead(); }}
                          className="text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                            <Bell className="w-5 h-5 text-zinc-500" />
                          </div>
                          <p className="text-zinc-300 font-medium text-sm">All caught up!</p>
                          <p className="text-zinc-500 text-xs mt-1">No new notifications right now.</p>
                        </div>
                      ) : (
                        notifications.map(n => {
                          // Determine icon and color based on title
                          let Icon = Sparkles;
                          let iconColor = "text-violet-400";
                          let iconBg = "bg-violet-500/10";
                          
                          const titleLower = n.title.toLowerCase();
                          if (titleLower.includes("submission") || titleLower.includes("recorded") || titleLower.includes("verified")) {
                            Icon = CheckCircle2;
                            iconColor = "text-emerald-400";
                            iconBg = "bg-emerald-500/10";
                          } else if (titleLower.includes("battle") || titleLower.includes("versus")) {
                            Icon = Swords;
                            iconColor = "text-rose-400";
                            iconBg = "bg-rose-500/10";
                          } else if (titleLower.includes("streak") || titleLower.includes("fire")) {
                            Icon = Flame;
                            iconColor = "text-orange-400";
                            iconBg = "bg-orange-500/10";
                          } else if (titleLower.includes("won") || titleLower.includes("leaderboard") || titleLower.includes("rank")) {
                            Icon = Trophy;
                            iconColor = "text-amber-400";
                            iconBg = "bg-amber-500/10";
                          }

                          return (
                            <div key={n._id || n.id} className={`group relative p-4 border-b border-white/[0.04] hover:bg-white/[0.04] transition-all cursor-pointer flex gap-4 ${!n.read ? 'bg-violet-500/[0.03]' : ''}`}>
                              
                              {/* Unread Indicator Bar */}
                              {!n.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-violet-500 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                              )}

                              {/* Dynamic Icon */}
                              <div className={`mt-0.5 shrink-0 w-9 h-9 rounded-full ${iconBg} border border-white/5 flex items-center justify-center transition-transform group-hover:scale-105`}>
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                              </div>
                              
                              <div className="flex-1 pr-4">
                                <div className="flex items-start justify-between gap-2">
                                  <p className={`text-[13px] font-semibold leading-tight ${!n.read ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                    {n.title}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-medium text-zinc-500 shrink-0 whitespace-nowrap mt-0.5">
                                      {timeAgo(n.createdAt)}
                                    </span>
                                    <button 
                                      onClick={(e) => handleDeleteNotification(n._id || n.id, e)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-500 hover:text-white"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-[12px] text-zinc-400 leading-relaxed mt-1.5 line-clamp-2">
                                  {n.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${isAvatarUrl ? 'bg-white/5 border border-white/[0.04]' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}
              >
                {isAvatarUrl ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  initials
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Battle Gateway Gateway Modal */}
      <BattleHubModal 
        isOpen={isBattleModalOpen} 
        onClose={() => setIsBattleModalOpen(false)} 
        plan={plan}
      />
    </>
  );
}