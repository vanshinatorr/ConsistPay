import { useState } from "react";
import { Code2, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { BattleHubModal } from "../../components/battle/BattleHubModal";

interface NavbarProps {
  initials: string;
  plan?: string;
}

export function Navbar({ initials, plan = "free" }: NavbarProps) {
  const location = useLocation();
  const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);

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

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              </div>

              <Link
                to="/profile"
                className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-semibold text-sm"
              >
                {initials}
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