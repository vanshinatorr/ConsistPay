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
import { Settings } from "./pages/Settings"; // 👈 add

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/dashboard", Component: Dashboard },
  { path: "/pricing", Component: Pricing },
  { path: "/create-challenge", Component: CreateChallenge },
  { path: "/join-challenge/:code", Component: JoinChallenge },
  { path: "/leaderboard", Component: Leaderboard },
  { path: "/profile", Component: Profile },
  { path: "/notifications", Component: Notifications },
  { path: "/settings", Component: Settings }, // 👈 add
  { path: "*", Component: NotFound },
]);





// # 🎯 1. MOST COMMON QUESTION

// ## ❓ Q1: React Router kya hota hai?

// 👉 **Answer:**

// > React Router is used to handle navigation in a React application
// > without reloading the page.

// 👉 Hinglish:

// > "Ye SPA me page switching handle karta hai bina reload ke"

// ---

// # 🎯 2. Direct tere code se question

// ## ❓ Q2: `createBrowserRouter` kya karta hai?

// 👉 **Answer:**

// > It creates a router instance using browser URL
// > and maps paths to components.

// 👉 Simple:

// > "Ye URL ke basis pe component decide karta hai"

// ---

// # 🎯 3. MOST IMPORTANT 🔥

// ## ❓ Q3: Ye code explain karo

// ```js
// { path: "/login", Component: Login }
// ```

// 👉 **Answer:**

// > When user navigates to `/login`, the Login component is rendered.

// 👉 Hinglish:

// > "Agar URL /login hai to Login page dikhaya jayega"

// ---

// # 🎯 4. Dynamic route (VERY IMPORTANT)

// ## ❓ Q4:

// ```js
// /join-challenge/:code
// ```

// 👉 Ye kya hai?

// ---

// 👉 **Answer:**

// > It is a dynamic route where `code` is a parameter
// > that can change based on URL.

// 👉 Example:

// ```
// /join-challenge/ABC123
// ```

// 👉 `code = ABC123`

// ---

// # 🎯 5. Catch-all route

// ## ❓ Q5:

// ```js
// { path: "*", Component: NotFound }
// ```

// 👉 **Answer:**

// > It handles all unmatched routes and shows a NotFound page.

// ---

// # 🎯 6. Practical question (IMP 🔥)

// ## ❓ Q6: Agar `/dashboard` protected hona chahiye to kya karoge?

// 👉 **Answer:**

// > I will wrap the route inside a ProtectedRoute component
// > to allow only authenticated users.

// ---

// # 🎯 7. Concept question

// ## ❓ Q7: SPA kya hota hai?

// 👉 **Answer:**

// > Single Page Application where content updates dynamically
// > without full page reload.

// ---

// # 🎯 8. Trick question

// ## ❓ Q8: `Component: Login` vs `element: <Login />`

// 👉 **Answer:**

// > Both are used to render components in routes,
// > but `element` is more commonly used in traditional React Router.

// ---

// # 🎯 9. Real project question (ConsistPay)

// ## ❓ Q9: Tumne routing kaha use ki?

// 👉 **Answer:**

// > I used React Router to manage navigation between pages like
// > login, dashboard, challenges, and leaderboard in my app.

// ---

// # 🎯 10. Debugging question

// ## ❓ Q10: Agar route kaam nahi kare to kya check karoge?

// 👉 **Answer:**

// * path correct hai?
// * RouterProvider wrap hai?
// * component import sahi hai?

// ---

// # 🧠 BONUS (impress interviewer 🔥)

// 👉 Bol:

// > "Routing improves user experience by avoiding page reload
// > and making the app faster"

// ---

// # 🎯 Mini Practice

// 👉 Tu bol ke dikha:

// > "createBrowserRouter maps URL paths to components
// > and RouterProvider renders them based on current URL"

// ---

// # 💬 Final mentor advice

// 👉 Interview me:
// ❌ code yaad nahi
// ✅ concept + use-case important

// ---


