# ConsistPay Frontend Client

This directory houses the frontend application for ConsistPay, built using React, Vite, TypeScript, and styled with TailwindCSS v4. It features a responsive dashboard, 1v1 battle matching lobbies, custom calendar visualization widgets, and interactive gamified achievements.

---

## Directory Overview

```
front-end/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable layout widgets
│   │   │   ├── battle/      # Battle-specific modal dialogues and wallets
│   │   │   ├── ui/          # Generic visual tokens
│   │   │   ├── Sidebar.tsx  # SaaS collapsable side navigation
│   │   │   └── ...
│   │   └── pages/           # View route templates
│   │       ├── dashboard/   # Dashboard charts, rows, & calendars
│   │       ├── Dashboard.tsx
│   │       ├── ActiveBattle.tsx
│   │       ├── Settings.tsx
│   │       ├── ComingSoonPages.tsx # Future categories placeholders
│   │       └── ...
│   ├── styles/              # Global theme sheets & custom animation definitions
│   └── main.tsx             # DOM entry mounting
├── vite.config.ts           # Bundler build pipelines
└── README.md                # Client documentation
```

---

## Main Modules & Code Paths

### 1. Collapsible side-navigation (`Sidebar.tsx`)
*   Manages primary navigation links, future categories lists, and collapsing responsive drawer operations.
*   Handles the confirmation logout dialog trigger to prevent accidental session abandonment.

### 2. Achievements and Badges (`AwardsCard.tsx`)
*   Calculates local streaks, consistency scores, and solved milestones.
*   Maps and displays official 3D glossy LeetCode badge graphics pulled from the LeetCode CDN, integrated with screenspace canvas confetti triggers.

### 3. Verification & Setup Lobbies
*   *PlatformManager.tsx:* Manages external accounts verification (LeetCode bio validation, GFG sync).
*   *ComingSoonPages.tsx:* Render pages for upcoming habit trackers (Fitness, Study, etc.) equipped with active beta access request buttons hooked to the backend API.

---

## Getting Started

### 1. Setup local env file
Create `.env` using `.env.example` as a template:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your backend instance (e.g. `http://localhost:5000` locally).

### 2. Launch Local Server
Install dependencies and run the Vite bundler dev server:
```bash
npm install
npm run dev
```
By default, the client launches on [http://localhost:5173](http://localhost:5173).