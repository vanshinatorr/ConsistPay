import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auth check logic based on user's exact instructions
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const path = window.location.pathname;
        
        // Skip check on public routes
        if (!token || path === "/login" || path === "/signup" || path === "/") {
          setLoading(false);
          return;
        }

        // Hit /api/users/me
        try {
          const res = await fetch("/api/users/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            
            // Redirect logic from real API
            if (data.onboardingComplete === false && path !== "/onboarding") {
              window.location.href = "/onboarding";
            } else if (data.onboardingComplete === true && path === "/onboarding") {
              window.location.href = "/dashboard";
            }
          } else {
            throw new Error("API not ready");
          }
        } catch (error) {
          // 🛑 FALLBACK FOR TESTING (No Backend Yet)
          // Agar backend API fail ho jaye, toh maan lo user naya hai (onboardingComplete: false)
          console.log("No backend detected. Running in test mode for Onboarding.");
          if (path !== "/onboarding") {
            window.location.href = "/onboarding";
          }
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