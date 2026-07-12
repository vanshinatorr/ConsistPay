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
        className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group relative ${
          active 
            ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]" 
            : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
        }`}
        title={isCollapsed ? item.label : undefined}
      >
        <IconComponent className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105 ${active ? "text-violet-400" : "text-zinc-400 group-hover:text-zinc-300"}`} />
        
        <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
          isCollapsed ? "opacity-0 w-0 invisible" : "opacity-100 w-auto visible"
        }`}>
          {item.label}
        </span>

        {/* Collapsed Tooltip fallback */}
        {isCollapsed && (
          <div className="absolute left-16 bg-[#16161F] border border-white/[0.08] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-xl whitespace-nowrap">
            {item.label}
          </div>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#0F0F13] border-r border-white/[0.04] p-4 text-white relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none" />

      <div className="flex flex-col gap-6 relative z-10">
        {/* Brand Header */}
        <div className={`flex items-center justify-between border-b border-white/[0.04] pb-4 min-h-[48px] ${isCollapsed ? "justify-center" : ""}`}>
          <Link to="/dashboard" className="flex items-center gap-3.5 shrink-0">
            <img
              src="/logo/brand-logo.png"
              alt="ConsistPay Logo"
              className="h-7 w-auto object-contain select-none"
            />
            <span className={`text-base font-extrabold tracking-tight text-white transition-all duration-300 ${
              isCollapsed ? "opacity-0 w-0 invisible overflow-hidden" : "opacity-100 w-auto visible"
            }`}>
              Consist<span className="text-emerald-400">Pay</span>
            </span>
          </Link>

          {/* Close button for Mobile drawer only */}
          {isMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Main Categories Navigation */}
        <div className="flex flex-col gap-1.5">
          {mainItems.map(renderNavItem)}
        </div>

        {/* Coming Soon Categories Navigation */}
        <div className="flex flex-col gap-1.5">
          <h4 className={`text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-white/[0.03] pb-1.5 px-3 mb-1 select-none transition-all duration-300 ${
            isCollapsed ? "opacity-0 w-0 h-0 overflow-hidden py-0 border-none" : "opacity-100 w-auto"
          }`}>
            Coming Soon
          </h4>
          {comingSoonItems.map(renderNavItem)}
        </div>
      </div>

      {/* Bottom Actions section */}
      <div className="flex flex-col gap-5 relative z-10">
        <div className="flex flex-col gap-1.5 border-t border-white/[0.04] pt-4">
          {bottomItems.map(renderNavItem)}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 border border-transparent w-full text-left cursor-pointer group"
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
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
