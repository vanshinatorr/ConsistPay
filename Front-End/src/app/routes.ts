import { createBrowserRouter } from "react-router-dom";

import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { Pricing } from "./pages/Pricing";
import { CreateChallenge } from "./pages/CreateChallenge";
import { JoinChallenge } from "./pages/JoinChallenge";
import { ActiveBattle } from "./pages/ActiveBattle";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";
import { Payment } from "./pages/Payment";
import FaqPage from "./pages/FaqPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { RootLayout } from "./components/RootLayout";
import { 
  FitnessPage, StudyPage, RunningPage, CyclingPage, 
  MeditationPage, SkillLearningPage, WalletPage 
} from "./pages/ComingSoonPages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { path: "/", Component: Landing },
      { path: "/auth", Component: Auth },
      { path: "/login", Component: Auth },
      { path: "/signup", Component: Auth },
      { path: "/onboarding", Component: Onboarding },
      { path: "/payment", Component: Payment },
      { path: "/dashboard", Component: Dashboard },
      { path: "/pricing", Component: Pricing },
      { path: "/faq", Component: FaqPage },
      { path: "/create-challenge", Component: CreateChallenge },
      { path: "/join-challenge/:code", Component: JoinChallenge },
      { path: "/battle/:id", Component: ActiveBattle },
      { path: "/leaderboard", Component: Leaderboard },
      { path: "/profile", Component: Profile },
      { path: "/notifications", Component: Notifications },
      { path: "/settings", Component: Settings },
      { path: "/fitness", Component: FitnessPage },
      { path: "/study", Component: StudyPage },
      { path: "/running", Component: RunningPage },
      { path: "/cycling", Component: CyclingPage },
      { path: "/meditation", Component: MeditationPage },
      { path: "/skill-learning", Component: SkillLearningPage },
      { path: "/wallet", Component: WalletPage },
      { path: "/admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ]
  }
]);