import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, LogOut, Sparkles,
  Menu, X
} from "lucide-react";

// 1. Dashboard Custom Icon
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.15" strokeLinejoin="round" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.15" strokeLinejoin="round" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
  </svg>
);

// 2. Coding Custom Icon (Terminal Window with window controls and carets)
const CodingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
    <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
    <circle cx="8" cy="6.5" r="0.75" fill="currentColor" />
    <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    <path d="M7 12.5L9.5 14.5L7 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 16.5H16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 3. Fitness Custom Icon (Sleek angled dumbbell)
const FitnessIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 17.5L17.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 14.5L9.5 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M5.5 13L11 18.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14.5 4L20 9.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M13 5.5L18.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 4. Study Custom Icon (Clean open book)
const StudyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 8.5 18.5 3 18.5V4C8.5 4 12 6.5 12 6.5C12 6.5 15.5 4 21 4V18.5C15.5 18.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08" />
    <path d="M12 6.5V21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 8H9M6 11H9M6 14H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 8H18M15 11H18M16 14H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 5. Running Custom Icon (Stylized fast shoe profile outline)
const RunningIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 17H16C17.5 17 19 16 19.8 14.5L21.5 11.2C21.8 10.5 21.8 9.5 21.2 9L20 8C19.2 7.2 18 6.8 17 6.8H12L8.5 11H5.5C5.2 11 5 11.2 5 11.5V14.5C5 15.9 5.8 17 6.8 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.08" />
    <path d="M2 11H4M2 14H3.5M2 8H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 6. Cycling Custom Icon (Clean vector bicycle outline)
const CyclingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="15" r="3.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <circle cx="18" cy="15" r="3.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <path d="M6 15L10.5 9.5H15L18 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 9.5L14 15M7.5 9.5H11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 6.5H16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15 6.5V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 7. Meditation Custom Icon (Double-bordered geometric lotus petal)
const MeditationIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21C12 21 16 16.5 16 12C16 7.5 12 3 12 3C12 3 8 7.5 8 12C8 16.5 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
    <path d="M12 21C14.5 19 20 16 20 13C20 10 16.5 9.5 14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21C9.5 19 4 16 4 13C4 10 7.5 9.5 11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 8. Skill Learning Custom Icon (Stylized pathway node with target star flag)
const SkillLearningIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <circle cx="19" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <path d="M7 15L10 9M14 9L17 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 2V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10.5 3H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 9. Wallet Custom Icon (Aesthetic payment card)
const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="15" y="12" width="5" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" fill="white" />
  </svg>
);

// 10. Settings Custom Icon (Sleek mechanical gear)
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 11. Profile Custom Icon (Clean avatar profile silhouette)
const ProfileIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08" />
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("consistpay_user_data");
    navigate("/login");
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

        <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-violet-550 dark:text-violet-400" : "text-zinc-400 dark:text-zinc-450 group-hover:text-zinc-700 dark:group-hover:text-zinc-350"}`} />
        
        <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
          isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 w-auto visible"
        }`}>
          {item.label}
        </span>

        {/* Collapsed Tooltip fallback */}
        {isCollapsed && (
          <div className="absolute left-16 bg-white dark:bg-[#16161F] border border-zinc-200 dark:border-white/[0.08] text-zinc-850 dark:text-zinc-200 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md dark:shadow-xl whitespace-nowrap">
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
        <div className={`flex items-center justify-between border-b border-zinc-250 dark:border-white/[0.04] pb-4.5 min-h-[48px] ${isCollapsed ? "justify-center" : ""}`}>
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0 group/brand">
            <div className="w-7.5 h-7.5 rounded-xl bg-gradient-to-tr from-violet-500/10 to-emerald-500/10 border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover/brand:border-violet-500/30">
              <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-4 w-auto object-contain select-none transition-transform duration-300 group-hover/brand:scale-105"
              />
            </div>
            
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-200">
                <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5 leading-none">
                  Consist<span className="text-emerald-400">Pay</span>
                  <span className="text-[8px] font-black bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded-md border border-violet-500/20 uppercase tracking-widest leading-none">
                    AI
                  </span>
                </span>
                <span className="text-[9px] text-zinc-500 dark:text-zinc-550 font-bold tracking-wider uppercase leading-none mt-1">
                  Accountability Hub
                </span>
              </div>
            )}
          </Link>

          {/* Close button for Mobile drawer only */}
          {isMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
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
                    : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 dark:hover:text-zinc-200 dark:hover:bg-white/[0.015]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-violet-500 dark:bg-violet-400 rounded-r shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}

                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 shrink-0 transition-transform ${active ? "text-violet-550 dark:text-violet-400" : "text-zinc-400 dark:text-zinc-450 group-hover:text-zinc-700 dark:group-hover:text-zinc-350"}`} />
                  
                  {!isCollapsed && (
                    <span className="transition-all duration-300 whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <span className="text-[8px] font-black text-zinc-500 dark:text-zinc-650 bg-zinc-200/55 dark:bg-[#1A1C2A] border border-zinc-300/80 dark:border-white/[0.04] px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 opacity-70 group-hover:opacity-100 transition-all select-none">
                    Soon
                  </span>
                )}

                {isCollapsed && (
                  <div className="absolute left-16 bg-white dark:bg-[#16161F] border border-zinc-200 dark:border-white/[0.08] text-zinc-850 dark:text-zinc-200 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md dark:shadow-xl whitespace-nowrap">
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

        {/* Collapse Toggle Chevron button (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center p-2 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
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
    </>
  );
}
