import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      <Toaster theme="dark" position="bottom-center" />
      <Outlet />
    </div>
  );
}
