import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-client-id.apps.googleusercontent.com";

type AuthStep = "identity" | "otp" | "username";

export function Auth() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<AuthStep>("identity");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [tempToken, setTempToken] = useState("");
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep("otp");
      toast.success("Code sent successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      if (data.isNewUser) {
        setTempToken(data.tempToken);
        setStep("username");
      } else {
        localStorage.setItem("token", data.token);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Google Success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      if (data.isNewUser) {
        setTempToken(data.tempToken);
        if (data.suggestedName) setName(data.suggestedName);
        setStep("username");
      } else {
        localStorage.setItem("token", data.token);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Google Auth Failed");
    } finally {
      setLoading(false);
    }
  };

  // Live Username Check
  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/check-username?username=${username}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch (e) {
        setUsernameAvailable(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [username]);

  // Step 3: Complete Signup
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || usernameAvailable === false) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/complete-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, name, username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem("token", data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ style: { background: '#18181B', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay
          </span>
        </Link>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* STEP 1: IDENTITY */}
          {step === "identity" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome back</h1>
              <p className="text-zinc-400 text-sm text-center mb-8">Login or create an account to continue</p>
              
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <div className="flex justify-center mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google Login Failed")}
                    useOneTap
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              </GoogleOAuthProvider>

              <div className="relative flex items-center gap-4 my-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-zinc-500 text-sm">OR</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !identifier}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold rounded-xl px-4 py-3 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue with Code"}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === "otp" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-2xl font-bold text-white text-center mb-2">Check your inbox</h1>
              <p className="text-zinc-400 text-sm text-center mb-8">
                We sent a 6-digit code to <br/><span className="text-white font-medium">{identifier}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                    placeholder="• • • • • •"
                    className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-4 py-3 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("identity")}
                  className="w-full text-center text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Use a different email
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: USERNAME */}
          {step === "username" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h1 className="text-2xl font-bold text-white text-center mb-2">Almost there!</h1>
              <p className="text-zinc-400 text-sm text-center mb-8">What should we call you on the leaderboard?</p>

              <form onSubmit={handleCompleteSignup} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#0D0D0F] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Unique Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="johndoe"
                      className={`w-full bg-[#0D0D0F] border rounded-xl pl-9 pr-10 py-3 text-white placeholder-zinc-600 focus:outline-none transition-all ${
                        usernameAvailable === true ? "border-emerald-500/50 focus:border-emerald-500" :
                        usernameAvailable === false ? "border-red-500/50 focus:border-red-500" :
                        "border-white/10 focus:border-violet-500"
                      }`}
                      required
                      minLength={3}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameAvailable === true && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {usernameAvailable === false && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </div>
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-400 mt-2">This username is already taken.</p>
                  )}
                  {usernameAvailable === true && (
                    <p className="text-xs text-emerald-400 mt-2">Username available!</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !name || !username || usernameAvailable === false}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl px-4 py-3 mt-4 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>Finish Setup <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
        
        <p className="text-center text-xs text-zinc-600 mt-6">
          By continuing, you agree to ConsistPay's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
