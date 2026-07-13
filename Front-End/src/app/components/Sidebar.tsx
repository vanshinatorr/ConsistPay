import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, LogOut, Sparkles,
  Menu, X, Loader2, PanelLeftOpen, PanelLeftClose
} from "lucide-react";

// 1. Dashboard Custom Icon
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

// 2. Coding Custom Icon (Prism/SaaS Code Brackets </>)
const CodingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 3. Fitness Custom Icon (Classic bold Dumbbell)
const FitnessIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 12H17.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="3" y="7" width="3.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
    <rect x="17.5" y="7" width="3.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
  </svg>
);

// 4. Study Custom Icon (Clean Open Book)
const StudyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 8.5 18.5 3 18.5V4C8.5 4 12 6.5 12 6.5C12 6.5 15.5 4 21 4V18.5C15.5 18.5 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08" />
    <path d="M12 6.5V21" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// 5. Running Custom Icon (Running Man Silhouette)
const RunningIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="5" r="1.5" fill="currentColor" />
    <path d="M6 18l5 1l.75 -2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 21v-4l-4.5 -3l1 -5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 13v-3l5 -1l3 3l3 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 6. Cycling Custom Icon (Sleek Cycling Figure)
const CyclingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6.5" cy="15.5" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <circle cx="17.5" cy="15.5" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <path d="M12 16.5v-4.5l-3 -3l5 -3.5l2.5 3H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16.5" cy="4.5" r="1" fill="currentColor" />
  </svg>
);

// 7. Meditation Custom Icon (Lotus Meditation Pose)
const MeditationIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <path d="M5 20l4 -1l1.5 -3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 20l-4 -1l-1.5 -3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11.5l1 -3.5l-2 -1l-2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 16.5l3.5 -1l3.5 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 8. Skill Learning Custom Icon (Classic Graduation Cap)
const SkillLearningIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 10v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08" />
    <path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 9. Wallet Custom Icon (Aesthetic Payment Card)
const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
    <path d="M3 10H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="15" y="12" width="4" height="3" rx="1" stroke="currentColor" strokeWidth="1.8" fill="white" />
  </svg>
);

// 10. Settings Custom Icon (Sleek Mechanical Gear)
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 11. Profile Custom Icon (Clean Avatar Profile Silhouette)
const ProfileIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
  </svg>
);

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Collapse state on Desktop (stored in localStorage)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  // Open drawer state on Mobile
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Listen to mobile menu toggle event dispatched by top Navbar
  useEffect(() => {
    const handleToggle = () => {
      setIsMobileOpen(prev => !prev);
    };
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [path]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("consistpay_user_data");
      navigate("/login");
    }, 850);
  };

  // Nav Items Definitions
  const mainItems = [
    { label: "Dashboard", path: "/dashboard", Icon: DashboardIcon },
    { 
      label: "Coding", 
      path: "/dashboard", 
      Icon: CodingIcon,
      // Active if the path is any under coding category (dashboard, battles, leaderboard, pricing, profile)
      isActive: path === "/dashboard" || path === "/create-challenge" || path.startsWith("/join-challenge") || path.startsWith("/battle") || path === "/leaderboard" || path === "/pricing" || path === "/profile"
    }
  ];

  const comingSoonItems = [
    { label: "Fitness", path: "/fitness", Icon: FitnessIcon },
    { label: "Study", path: "/study", Icon: StudyIcon },
    { label: "Running", path: "/running", Icon: RunningIcon },
    { label: "Cycling", path: "/cycling", Icon: CyclingIcon },
    { label: "Meditation", path: "/meditation", Icon: MeditationIcon },
    { label: "Skill Learning", path: "/skill-learning", Icon: SkillLearningIcon }
  ];

  const bottomItems = [
    { label: "Wallet", path: "/wallet", Icon: WalletIcon },
    { label: "Settings", path: "/settings", Icon: SettingsIcon },
    { label: "Profile", path: "/profile", Icon: ProfileIcon }
  ];

  const renderNavItem = (item: typeof mainItems[0] & { isActive?: boolean }) => {
    const active = item.isActive !== undefined ? item.isActive : path === item.path;
    const IconComponent = item.Icon;

    return (
      <Link
        key={item.label}
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11.5px] font-semibold tracking-wide transition-all duration-150 group relative ${
          active 
            ? "bg-zinc-200/55 dark:bg-white/[0.035] text-zinc-900 dark:text-white" 
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 dark:hover:text-zinc-200 dark:hover:bg-white/[0.015]"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-violet-500 dark:bg-violet-400 rounded-r shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
        )}

        <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-violet-600 dark:text-violet-400" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"}`} />
        
        <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
          isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 w-auto visible"
        }`}>
          {item.label}
        </span>

        {/* Collapsed Tooltip fallback */}
        {isCollapsed && (
          <div className="absolute left-16 bg-white dark:bg-[#16161F] border border-zinc-200 dark:border-white/[0.08] text-zinc-800 dark:text-zinc-200 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md dark:shadow-xl whitespace-nowrap">
            {item.label}
          </div>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-zinc-50 dark:bg-[#0F0F13] border-r border-zinc-200/80 dark:border-white/[0.04] p-4 text-zinc-900 dark:text-white relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none" />

      <div className="flex flex-col gap-5.5 relative z-10">
        {/* Brand Header */}
        <div className={`flex items-center border-b border-zinc-250 dark:border-white/[0.04] pb-4.5 min-h-[48px] ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}>
          {isCollapsed ? (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg bg-transparent hover:bg-zinc-150 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          ) : (
            <>
              <Link to="/dashboard" className="flex items-center gap-3 shrink-0 group/brand animate-in fade-in duration-200">
                <div className="w-7.5 h-7.5 rounded-xl bg-gradient-to-tr from-violet-500/10 to-emerald-500/10 border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover/brand:border-violet-500/30">
                  <img
                    src="/logo/brand-logo.png"
                    alt="ConsistPay Logo"
                    className="h-4 w-auto object-contain select-none transition-transform duration-300 group-hover/brand:scale-105"
                  />
                </div>
                
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                    Consist<span className="text-emerald-400">Pay</span>
                  </span>
                </div>
              </Link>

              <button 
                onClick={() => setIsCollapsed(true)}
                className="hidden md:block p-1.5 rounded-lg bg-transparent hover:bg-zinc-150 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Close button for Mobile drawer only */}
          {isMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-zinc-450 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Categories Navigation */}
        <div className="flex flex-col gap-1">
          {mainItems.map(renderNavItem)}
        </div>

        {/* Coming Soon Categories Navigation */}
        <div className="flex flex-col gap-1">
          {!isCollapsed && (
            <h4 className="text-[9px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mt-4 mb-2 select-none">
              Habit Categories
            </h4>
          )}
          {comingSoonItems.map((item) => {
            const active = path === item.path;
            const IconComponent = item.Icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[11.5px] font-semibold tracking-wide transition-all duration-150 group relative ${
                  active 
                    ? "bg-zinc-200/55 dark:bg-white/[0.035] text-zinc-900 dark:text-white" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 dark:hover:text-zinc-200 dark:hover:bg-white/[0.015]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-violet-500 dark:bg-violet-400 rounded-r shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}

                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-violet-600 dark:text-violet-400" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"}`} />
                  
                  {!isCollapsed && (
                    <span className="transition-all duration-300 whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <span className="text-[8px] font-black text-zinc-500 dark:text-zinc-400 bg-zinc-200/55 dark:bg-[#1A1C2A] border border-zinc-300/80 dark:border-white/[0.04] px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 opacity-70 group-hover:opacity-100 transition-all select-none">
                    Soon
                  </span>
                )}

                {isCollapsed && (
                  <div className="absolute left-16 bg-white dark:bg-[#16161F] border border-zinc-200 dark:border-white/[0.08] text-zinc-800 dark:text-zinc-200 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md dark:shadow-xl whitespace-nowrap">
                    {item.label} (Soon)
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions section */}
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-1 border-t border-white/[0.04] pt-4">
          {bottomItems.map(renderNavItem)}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11.5px] font-semibold tracking-wide text-rose-400/80 hover:text-rose-450 hover:bg-rose-550/5 transition-all duration-150 border border-transparent w-full text-left cursor-pointer group"
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 w-auto visible"
            }`}>
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Panel */}
      <aside className={`hidden md:block shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? "w-18" : "w-60"
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex select-none">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 max-w-[280px] h-full z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal (SaaS Vibe) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0F1018] border border-zinc-200/80 dark:border-white/[0.06] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Sign Out</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider mt-0.5">End active session</p>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              Are you sure you want to sign out of ConsistPay? You will need to log back in to access your dashboard, track streaks, and process streak payouts.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 border border-zinc-200 dark:border-white/[0.06] transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-red-500/15 disabled:opacity-50 active:scale-95"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <span>Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
