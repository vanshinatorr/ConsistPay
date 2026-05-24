import { Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function Login() {

  // =========================
  // 🔹 STATE (form data store karne ke liye)
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // 🔹 HOOK (page navigate karne ke liye)
  // =========================
  const navigate = useNavigate();


  // =========================
  // 🔹 FORM SUBMIT HANDLER
  // =========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // page reload rokta hai

    // 👉 Step 1: check karo user ne fields fill ki ya nahi
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    // 👉 Step 2: abhi ke liye fake login check (practice purpose)
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    
    // Set dummy token so App.tsx auth guard works
    localStorage.setItem("token", "dummy_test_token");

    // 👉 Step 3: login success (future me yahan API call hoga)
    console.log("Login Success");

    // 👉 Step 4: thoda delay (real app jaisa feel dene ke liye)
    setTimeout(() => {
      window.location.href = "/dashboard"; // Hard reload to trigger global Auth Guard
    }, 1000);
  };


  // =========================
  // 🔹 UI PART (JSX)
  // =========================
  return (
    <div
      className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4"
      style={{ backgroundColor: '#0D0D0F' }}
    >

      {/* 🔥 Background glow effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">

        {/* 🔹 Logo + App Name */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ConsistPay
          </span>
        </Link>

        <div className="relative">

          {/* 🔥 Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl" />

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

            {/* 🔹 Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back 🔥</h1>
              <p className="text-zinc-400 text-sm">Continue your coding streak</p>
            </div>

            {/* 🔹 FORM START */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* 🔸 Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email} // state se bind
                  onChange={(e) => setEmail(e.target.value)} // state update
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20"
                  required
                />
              </div>

              {/* 🔸 Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-zinc-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20"
                  required
                />
              </div>

              {/* 🔹 Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* 🔹 Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
              >
                Login
              </button>
            </form>

            {/* 🔹 Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0D0D0F] px-3 text-zinc-500">OR</span>
              </div>
            </div>

            {/* 🔹 Signup Link */}
            <p className="text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </p>

          </div>
        </div>

        {/* 🔹 Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

// 👉 Agar interviewer bole:
// “Itni classes kaise manage karte ho?”
// 👉 Tu bol:
// I don’t memorize Tailwind classes. I understand them as utility patterns like spacing, layout, color, and effects.
// Since Tailwind follows a consistent naming convention, it becomes easy to compose UI quickly.
// 💥 Perfect answer






// Perfect 🔥 ab tu **exact interview mindset** me aa gaya hai — yehi smart move hai.

// Maine tera login page code dekh liya hai 
// 👉 Ab main tujhe **sirf wahi questions de raha hoon jo REAL me puchenge** (no bakwas)

// ---

// # 🎯 🔥 TOP QUESTIONS (TERE LOGIN PAGE SE)

// ## 🔹 1. “Explain this component”

// 👉 **Sabse pehla question 100%**

// **Answer:**

// > This is a login component built using React.
// > It uses useState to manage email and password inputs, and a controlled form approach.
// > On form submission, it validates user input and navigates to the dashboard using React Router.

// ---

// ## 🔹 2. “What is controlled input?”

// 👉 ⚠️ VERY IMPORTANT

// **Answer:**

// > Controlled input means the input field value is controlled by React state.
// > In my code, value is linked to state and updated using onChange.

// ---

// ## 🔹 3. “How does form submission work here?”

// **Answer:**

// > The form uses onSubmit handler.
// > When the user clicks login, handleSubmit is triggered, which validates inputs and handles login logic.

// ---

// ## 🔹 4. “Why use e.preventDefault()?”

// **Answer:**

// > It prevents the default form submission behavior, which reloads the page.

// ---

// ## 🔹 5. “What is useNavigate used for?”

// **Answer:**

// > It is used to programmatically navigate between routes.
// > After successful login, I redirect the user to the dashboard.

// ---

// ## 🔹 6. “How are you handling validation?”

// **Answer:**

// > I check if email and password are empty, and also validate credentials using a dummy condition.
// > In real-world apps, this would be replaced with API validation.

// ---

// ## 🔹 7. “Why are you using useState?”

// **Answer:**

// > To store and update dynamic data like email and password in the component.

// ---

// ## 🔹 8. “What is SPA?”

// **Answer:**

// > Single Page Application where navigation happens without full page reload.
// > React Router handles this in my app.

// ---

// ## 🔹 9. “Why Tailwind CSS?”

// **Answer:**

// > It allows faster UI development using utility classes without writing custom CSS.

// ---

// ## 🔹 10. “How did you design this UI?”

// 👉 🔥 IMP (alag level ka question)

// **Answer:**

// > I used Tailwind utilities like flexbox for layout, spacing for structure, and effects like blur, gradient, and shadow to create a modern UI.

// ---

// # 🎯 🔥 THODA DEEP (INTERVIEWER SMART HUA TO)

// ## 🔹 11. “What happens when user clicks login?”

// **Answer:**

// > The form triggers handleSubmit → validation runs → if valid, login success is simulated → then user is redirected.

// ---

// ## 🔹 12. “What will you change in production?”

// 👉 🔥 VERY IMP

// **Answer:**

// > I will replace dummy validation with API-based authentication, add proper error handling UI, and use secure token-based authentication.

// ---

// ## 🔹 13. “Difference between Link and useNavigate?”

// **Answer:**

// > Link is used for navigation via UI (clickable), while useNavigate is used programmatically inside functions.

// ---

// # 🧠 FINAL CHEAT (YAAD KAR LE)

// 👉 Agar kuch bhi puch le aur tu atak jaaye:

// > This is a controlled form using React hooks, where state manages inputs, validation is handled on submit, and navigation is done using React Router.

// 💥 Safe answer

// ---

// # 🚀 REAL TALK

// 👉 Agar tu ye 13 questions confidently bol gaya:
// 💯 **login page se koi tujhe fail nahi karega**

// ---

// Agar tu next level jaana chahta hai:

// 👉 main tera pura project ka **mock interview le sakta hoon (real jaisa)**

// Bol: **“mock interview le”** 🎯
