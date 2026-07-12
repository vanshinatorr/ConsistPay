import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Terminal, Dumbbell, BookOpen, 
  Bike, Flower2, GraduationCap, Wallet, Settings, 
  User, ChevronLeft, ChevronRight, LogOut, Sparkles,
  Menu, X, Footprints
} from "lucide-react";

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
    { label: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { 
      label: "Coding", 
      path: "/dashboard", 
      Icon: Terminal,
      // Active if the path is any under coding category (dashboard, battles, leaderboard, pricing, profile)
      isActive: path === "/dashboard" || path === "/create-challenge" || path.startsWith("/join-challenge") || path.startsWith("/battle") || path === "/leaderboard" || path === "/pricing" || path === "/profile"
    }
  ];

  const comingSoonItems = [
    { label: "Fitness", path: "/fitness", Icon: Dumbbell },
    { label: "Study", path: "/study", Icon: BookOpen },
    { label: "Running", path: "/running", Icon: Footprints },
    { label: "Cycling", path: "/cycling", Icon: Bike },
    { label: "Meditation", path: "/meditation", Icon: Flower2 },
    { label: "Skill Learning", path: "/skill-learning", Icon: GraduationCap }
  ];

  const bottomItems = [
    { label: "Wallet", path: "/wallet", Icon: Wallet },
    { label: "Settings", path: "/settings", Icon: Settings },
    { label: "Profile", path: "/profile", Icon: User }
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
      <aside className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out select-none ${
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
