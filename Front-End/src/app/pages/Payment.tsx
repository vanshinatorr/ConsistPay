import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Payment() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/onboarding", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#08080B] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Redirecting to secure onboarding checkout...</p>
      </div>
    </div>
  );
}
