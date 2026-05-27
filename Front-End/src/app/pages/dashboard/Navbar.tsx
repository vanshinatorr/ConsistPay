import { useState, useEffect } from "react";
import { Code2, Bell } from "lucide-react";
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
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 shrink-0"
            >
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
                const isBattles = label === "Battles";

                if (isBattles) {
                  return (
                    <button
                      key={path}
                      onClick={() => setIsBattleModalOpen(true)}
                      className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      {label}
                    </button>
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
                      : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#0D0D0F]" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {showNotifs && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onMouseDown={(e) => { e.preventDefault(); handleMarkAsRead(); }}
                          className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id || n.id} className={`p-4 border-b border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-violet-500/[0.02]' : ''}`}>
                            <div className="mt-1 shrink-0">
                              <div className={`w-2 h-2 rounded-full ${!n.read ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]' : 'bg-transparent'}`} />
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-zinc-300'}`}>{n.title}</p>
                              <p className="text-xs text-zinc-400 mt-1">{n.desc}</p>
                              <p className="text-xs font-medium text-zinc-500 mt-2">{timeAgo(n.createdAt)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 text-center border-t border-white/10 bg-white/[0.02]">
                      <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">View all activity</button>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${isAvatarUrl ? 'bg-white/5 border border-white/10' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}
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