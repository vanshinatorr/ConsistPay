import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, ArrowRight, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder-client-id.apps.googleusercontent.com";

type AuthStep = "identity" | "otp" | "username";

const CustomGoogleButton = ({ onSuccess, onError, loading }: { onSuccess: (tokenResponse: any) => void, onError: () => void, loading: boolean }) => {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-zinc-50 border border-zinc-200/80 text-zinc-900 dark:bg-white dark:text-black dark:border-transparent dark:hover:bg-zinc-200 font-semibold rounded-xl px-4 py-3.5 hover:bg-zinc-100/85 transition-all disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>
      Continue with Google
    </button>
  );
};

export function Auth() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Authentication | ConsistPay";
  }, []);
  
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
      if (data.mockOtp) {
        setOtp(data.mockOtp);
      }
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
      setOtp(""); // Clear OTP on error so user can re-type immediately
      toast.error(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Success
  const handleGoogleSuccess = async (tokenResponse: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: tokenResponse.access_token }),
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
    <div className="auth-page min-h-screen bg-background text-foreground flex relative overflow-hidden font-sans">
      <Toaster position="top-center" toastOptions={{ style: { background: '#18181B', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      
      {/* Subtle Premium Background & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.08] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/[0.06] rounded-full blur-[140px]" />
      </div>

      {/* LEFT SIDE - Motivation Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24 relative z-10 border-r border-white/[0.04] bg-[#0A0B10]">
        <Link to="/" className="flex items-center gap-3 mb-24 w-fit group">
          <img
            src="/logo/brand-logo.png"
            alt="ConsistPay Logo"
            className="h-8 w-auto object-contain select-none"
          />
          <span className="text-xl font-semibold text-white tracking-tight">
            Consist<span className="text-emerald-400">Pay</span>
          </span>
        </Link>
        
        <div>
          <h1 className="text-[3.5rem] xl:text-[4rem] font-bold text-white leading-[1.05] mb-8 tracking-tighter">
            CGPA can't, but <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400 inline-block pb-2 -mb-2">One DSA question daily</span> <br />
            takes you to good placements.
          </h1>
        </div>
        
        <div className="space-y-4 mb-16">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
            <span className="text-[15px] font-medium text-zinc-400">Put your money where your mouth is.</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
            <span className="text-[15px] font-medium text-zinc-400">Build streaks & challenge friends.</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-450/80" />
            <span className="text-[15px] font-medium text-zinc-400">Force yourself to become a top-tier engineer.</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
             {/* Human Avatar */}
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf" alt="User" className="w-10 h-10 rounded-full border-2 border-background" />
             {/* Aesthetic Cat */}
             <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop" alt="User" className="w-10 h-10 rounded-full border-2 border-background object-cover" />
             {/* Male Avatar */}
             <img src="https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=b6e3f4" alt="User" className="w-10 h-10 rounded-full border-2 border-background" />
             
             <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white z-10 shadow-inner">
               30+
             </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Members</p>
            <p className="text-sm font-medium text-zinc-300">Join ConsistPay</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Box */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center items-center py-12 px-4 sm:p-6 relative z-10">
        
        {/* Ambient glow behind card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

        {/* Mobile Logo */}
        <Link to="/" className="flex lg:hidden items-center justify-center gap-3 mb-12 group cursor-pointer relative z-10">
          <img
                src="/logo/brand-logo.png"
                alt="ConsistPay Logo"
                className="h-8 w-auto object-contain select-none"
              />
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Consist<span className="text-emerald-600 dark:text-emerald-400">Pay</span>
              </span>
        </Link>

        <div className="w-full max-w-[420px] relative z-10">
          {/* Auth Card */}
          <div className="bg-[#12131A] border border-white/[0.06] rounded-[24px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* STEP 1: IDENTITY */}
          {step === "identity" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome back</h1>
              <p className="text-zinc-400 text-sm text-center mb-8">Login or create an account to continue</p>
              
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <div className="flex justify-center mb-6">
                  <CustomGoogleButton 
                    onSuccess={handleGoogleSuccess} 
                    onError={() => toast.error("Google Login Failed")} 
                    loading={loading}
                  />
                </div>
              </GoogleOAuthProvider>

              <div className="relative flex items-center gap-4 my-6">
                <div className="h-px bg-white/[0.04] flex-1" />
                <span className="text-zinc-500 text-sm">OR</span>
                <div className="h-px bg-white/[0.04] flex-1" />
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
                    className="w-full bg-[#0A0B10] border border-white/[0.06] rounded-xl px-4 py-3 text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !identifier}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl px-4 py-3 shadow-lg shadow-emerald-950/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="w-full bg-[#0A0B10] border border-white/[0.06] rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] text-white placeholder-zinc-650 focus:outline-none focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl px-4 py-3 shadow-lg shadow-emerald-950/20 mt-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
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
                    className="w-full bg-[#0A0B10] border border-white/[0.06] rounded-xl px-4 py-3 text-white placeholder-zinc-655 focus:outline-none focus:border-emerald-500 transition-all"
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
                      className={`w-full bg-[#0A0B10] border rounded-xl pl-9 pr-10 py-3 text-white placeholder-zinc-655 focus:outline-none transition-all ${
                        usernameAvailable === true ? "border-emerald-500/50 focus:border-emerald-500" :
                        usernameAvailable === false ? "border-red-500/50 focus:border-red-500" :
                        "border-white/[0.06] focus:border-emerald-500"
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl px-4 py-3 mt-4 shadow-lg shadow-emerald-950/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
