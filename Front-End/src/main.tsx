import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <RouterProvider router={router} />
  );
}






// Bhai 🔥 very smart question — yehi mindset placement crack karata hai

// 👉 Short answer:
// **Haan, is concept se interview me questions aate hain**
// BUT direct code nahi puchte → **concept puchte hain**

// ---

// # 🎯 1. Sabse common interview question

// ## ❓ Q1: React app ka entry point kya hota hai?

// 👉 **Answer (simple):**

// > React app `main.tsx` (ya `index.js`) se start hota hai
// > Yahan `createRoot()` se app DOM me render hota hai

// ---

// ## ❓ Q2: `createRoot` kya karta hai?

// 👉 **Answer:**

// > Ye React ko browser ke DOM element ke saath connect karta hai
// > Jisse React UI screen pe render hota hai

// 👉 Simple line:

// > "It mounts React app into the DOM"

// ---

// ## ❓ Q3: Root element kya hota hai?

// 👉 **Answer:**

// > HTML ka ek container (usually `<div id="root">`)
// > jahan pura React app render hota hai

// ---

// # 🚦 Routing wale questions (important 🔥)

// ## ❓ Q4: React me routing kya hoti hai?

// 👉 **Answer:**

// > Routing allows switching between different pages
// > without reloading the page

// 👉 Example:

// * `/login`
// * `/dashboard`

// ---

// ## ❓ Q5: `RouterProvider` kya karta hai?

// 👉 **Answer (best):**

// > It provides routing functionality to the entire app
// > and renders components based on current URL

// 👉 Short Hinglish:

// > "Ye decide karta hai kaunsa page dikhana hai URL ke basis pe"

// ---

// ## ❓ Q6: `router` object kya hota hai?

// 👉 **Answer:**

// > It contains route configuration (URL → component mapping)

// ---

// ## ❓ Q7: Agar RouterProvider remove kar diya to?

// 👉 **Answer:**

// > Navigation kaam nahi karega
// > Pages switch nahi honge
// > App single static UI ban jayega

// 👉 (Ye question bahut puchte hai 🔥)

// ---

// # 🧠 Thoda advanced (but easy)

// ## ❓ Q8: SPA kya hota hai?

// 👉 **Answer:**

// > Single Page Application
// > jahan page reload nahi hota, sirf content change hota hai

// 👉 React apps = SPA

// ---

// ## ❓ Q9: React Router ka use kyun karte hain?

// 👉 **Answer:**

// > To handle navigation in SPA without page reload

// ---

// # 🚀 ConsistPay se relate karke answer (IMP 🔥)

// Agar interviewer bole:

// > "Tumne routing kaha use ki?"

// 👉 Tu bole:

// > "Maine React Router use kiya
// > jisse user login, dashboard, aur challenge pages ke beech
// > smoothly navigate kar sake bina reload ke"

// ---

// # 🎯 Real interview tip

// 👉 Ye mat bol:
// ❌ "RouterProvider use kiya bas"

// 👉 Ye bol:
// ✅ "It helps in dynamic routing based on URL"

// ---

// # 🧪 Mini practice (bol ke dikha)

// 👉 Try bol:

// > "createRoot is used to mount React app into DOM
// > and RouterProvider enables routing in the app"

// ---

// # 💬 Final mentor advice

// 👉 Interview me ye code nahi puchte
// 👉 **Concept puchte hain + real use case**

// ---

// # 🔥 Next level

// Ab tu ready hai next cheez ke liye:

// 👉 `routes.tsx` bhej

// Wahi se:

// * real routing samajh aayega
// * interview level clarity aayegi 😎
