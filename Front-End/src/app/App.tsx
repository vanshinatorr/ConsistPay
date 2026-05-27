import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const API_URL = import.meta.env.VITE_API_URL ;

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const path = window.location.pathname;

        if (!token || path === "/login" || path === "/signup" || path === "/") {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          // Onboarding checks have been moved to components directly.
          if (data.onboardingComplete === true && path === "/onboarding") {
            window.location.href = "/dashboard";
          }
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}