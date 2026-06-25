import { Logo } from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.onboardingComplete === false) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/dashboard";
    }

  } catch (err) {
    alert("Server error. Try again.");
  }
};

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#08080B' }}>
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-500/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px]" />
      
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Logo className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay
          </span>
        </Link>

        <div className="relative">
          <div className="relative bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Create your account</h1>
              <p className="text-zinc-400 text-sm">Build coding consistency that actually lasts.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/[0.02] border-white/10 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/[0.02] border-white/10 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/[0.02] border-white/10 text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all duration-200 mt-6 text-sm"
              >
                Sign Up
              </button>
            </form>

            <p className="text-[10px] text-zinc-500 text-center mt-5 leading-normal">
              By registering, you agree to our{" "}
              <a href="#" className="text-violet-400 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>.
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