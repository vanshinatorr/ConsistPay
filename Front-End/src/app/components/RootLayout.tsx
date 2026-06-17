import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Toaster } from "sonner";
import { LayoutDashboard, Swords, Trophy, User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const path = location.pathname;
        const isPublicPage = path === "/" || path === "/login" || path === "/signup" || path === "/auth" || path === "/faq" || path === "/pricing";

        if (!token) {
          setIsAuth(false);
          if (!isPublicPage) {
            navigate("/login");
          } else {
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          setIsAuth(true);
          const data = await res.json();
          const isLandingOrAuthPage = path === "/" || path === "/login" || path === "/signup" || path === "/auth";
          
          if (isLandingOrAuthPage) {
            if (data.onboardingComplete === false) {
              navigate("/onboarding");
            } else {
              navigate("/dashboard");
            }
          } else {
            if (data.onboardingComplete === true && path === "/onboarding") {
              navigate("/dashboard");
            } else if (data.onboardingComplete === false && path !== "/onboarding" && path !== "/payment") {
              navigate("/onboarding");
            }
          }
        } else {
          setIsAuth(false);
          localStorage.removeItem("token");
          if (!isPublicPage) {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const path = location.pathname;
  const isPublicPage = path === "/" || path === "/login" || path === "/signup" || path === "/auth" || path === "/faq" || path === "/pricing";
  const showBottomNav = isAuth && !isPublicPage && path !== "/onboarding" && path !== "/payment";

  const tabs = [
    { label: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
    { label: "Battles", path: "/create-challenge", Icon: Swords },
    { label: "Leaderboard", path: "/leaderboard", Icon: Trophy },
    { label: "Profile", path: "/profile", Icon: User }
  ];

  return (
    <div className={`min-h-screen bg-[#0D0D0F] text-white flex flex-col ${showBottomNav ? "pb-20 md:pb-0" : ""}`}>
      <Toaster theme="dark" position="bottom-center" />
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Sticky Bottom Tab Bar for Mobile SaaS Feel */}
      {showBottomNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0F]/80 backdrop-blur-xl border-t border-white/10 pb-6 pt-3 px-6 flex justify-around items-center shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
          {tabs.map((tab) => {
            const isActive = path === tab.path || (tab.path !== "/dashboard" && path.startsWith(tab.path.substring(0, 5)));
            const IconComponent = tab.Icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center gap-1 group relative py-1 px-3 cursor-pointer"
              >
                <div className={`p-1 rounded-xl transition-all duration-200 ${isActive ? "text-violet-400 scale-110" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                  <IconComponent className="w-5.5 h-5.5" />
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-all ${isActive ? "text-white font-black" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-5 h-1 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

