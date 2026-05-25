import { createBrowserRouter } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { Pricing } from "./pages/Pricing";
import { CreateChallenge } from "./pages/CreateChallenge";
import { JoinChallenge } from "./pages/JoinChallenge";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";
import { Payment } from "./pages/Payment"; // 👈 add

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/onboarding", Component: Onboarding },
  { path: "/payment", Component: Payment }, // 👈 add
  { path: "/dashboard", Component: Dashboard },
  { path: "/pricing", Component: Pricing },
  { path: "/create-challenge", Component: CreateChallenge },
  { path: "/join-challenge/:code", Component: JoinChallenge },
  { path: "/leaderboard", Component: Leaderboard },
  { path: "/profile", Component: Profile },
  { path: "/notifications", Component: Notifications },
  { path: "/settings", Component: Settings },
  { path: "*", Component: NotFound },
]);


