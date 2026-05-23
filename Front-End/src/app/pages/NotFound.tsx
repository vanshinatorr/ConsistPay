import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const [seconds, setSeconds] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { navigate("/"); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4" style={{ backgroundColor: '#0D0D0F' }}>
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay
          </span>
        </Link>

        {/* 404 Text */}
        <div className="text-8xl font-black mb-4 bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
          404
        </div>

        <div className="text-4xl mb-4">😵</div>

        <h1 className="text-2xl font-bold mb-3">Streak Broken!</h1>
        <p className="text-zinc-400 mb-2">
          Looks like this page doesn't exist. Don't let your coding streak break too!
        </p>

        <p className="text-zinc-500 text-sm mb-8">
          Redirecting to home in {seconds}s...
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
            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}