# ConsistPay

ConsistPay is a premium gamified coding habit tracker designed to build long-term consistency in Data Structures & Algorithms (DSA). By combining financial commitment pools, 1v1 competitive coding battles, and verified streak tracking directly integrated with LeetCode and GeeksforGeeks, ConsistPay ensures developers stay consistent and accountable.

Live Platform: [consistpay.tech](https://consistpay.tech)

---

## Key Features

*   **Verified Streak Tracking:** Auto-synchronizes coding progress directly from LeetCode and GeeksforGeeks profiles to verify daily solves.
*   **Commitment Pools:** Stake daily deposits on consistency cycles. Complete daily challenges to reclaim deposits or forfeit stakes on missed days.
*   **1v1 DSA Battles:** Challenge peers to high-stakes coding duels in the arena. Earn rewards for superior consistency and problem-solving speed.
*   **Glossy Achievements & Badges:** Unlock premium, metallic 3D milestones (7-Day Streak, 30-Day Streak, 50 Solved, 100 Solved) along with your verified LeetCode profile badges.
*   **Grace Period Protection:** Safeguard your streak from accidental resets using Grace Coins earned through consecutive milestones.
*   **SaaS-Grade Experience:** Glassmorphic dark interfaces, real-time sync handlers, and strict session verification dialogs.

---

## Tech Stack

*   **Frontend:** React (Vite), TailwindCSS v4, Lucide Icons, Canvas Confetti, Sonner Notifications.
*   **Backend:** Node.js, Express.js, Mongoose (MongoDB), Nodemailer (Email verification/OTPs), Razorpay SDK (Payment Integration).
*   **External Integrations:** LeetCode GraphQL API, GeeksforGeeks Profile Scraping, Google Gemini API (AI code verification backup).

---

## Project Structure

```
ConsistPay/
├── front-end/           # React client application (Vite, TailwindCSS)
│   ├── src/             # Frontend source components, pages, & assets
│   └── .env.example     # Environment template for frontend variables
├── back-end/            # Node/Express API server
│   ├── src/             # Routes, controllers, models, and providers
│   └── .env.example     # Environment template for backend secrets
└── README.md            # Master project documentation
```

---

## Setup & Local Installation

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   MongoDB Instance (Local or MongoDB Atlas Cluster)

### 1. Clone & Navigate
```bash
git clone https://github.com/vanshinatorr/ConsistPay.git
cd ConsistPay
```

### 2. Configure Environment Files
Before running the application, set up your configuration values by copying the `.env.example` templates to `.env` in both folders.

#### Backend Setup
Navigate to `/back-end/` and copy `.env.example`:
```bash
cd back-end
cp .env.example .env
```
Fill in the `.env` with your actual MongoDB URI, JWT Secret, Gemini API Key, and Razorpay Credentials.

#### Frontend Setup
Navigate to `/front-end/` and copy `.env.example`:
```bash
cd ../front-end
cp .env.example .env
```
Update your backend API target URL and client access IDs.

### 3. Install Dependencies & Start Services

#### Run Backend Server
```bash
cd back-end
npm install
npm run dev
```

#### Run Frontend Server
```bash
cd front-end
npm install
npm run dev
```

The application will start running locally. Open [http://localhost:5173](http://localhost:5173) in your browser to access the dashboard.
