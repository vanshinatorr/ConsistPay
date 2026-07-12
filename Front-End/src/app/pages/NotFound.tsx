import { Link } from "react-router-dom";
import { Code2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const [seconds, setSeconds] = useState(10);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4 bg-[#0D0D0F]">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-12">
          <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
        </Link>

        {/* 404 Text */}
        <div className="text-8xl font-black mb-4 bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
          404
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400 animate-bounce" style={{ animationDuration: '3s' }}>
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3">Streak Broken!</h1>
        <p className="text-zinc-400 mb-8">
          Looks like this page doesn't exist. Don't let your coding streak break too!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30"
          >
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-white/5 border border-white/[0.04] hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}