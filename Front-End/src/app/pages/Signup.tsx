import { Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", { name, email, password });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0D0D0F' }}>
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        <Link to="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay
          </span>
        </Link>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 rounded-2xl blur-xl" />
          
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Start Your Streak 🚀</h1>
              <p className="text-zinc-400 text-sm">Join developers building consistent habits</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-zinc-300">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-zinc-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-zinc-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 mt-6"
              >
                Create Account
              </button>
            </form>

            <p className="text-xs text-zinc-500 text-center mt-4">
              By signing up, you agree to our{" "}
              <a href="#" className="text-violet-400 hover:text-violet-300">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0D0D0F] px-3 text-zinc-500">OR</span>
              </div>
            </div>

            <p className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}