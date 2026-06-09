import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      <Toaster theme="dark" position="bottom-center" />
      <Outlet />
    </div>
  );
}
