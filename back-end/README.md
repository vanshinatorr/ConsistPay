# ConsistPay Backend Server

This directory contains the Express.js backend server and database synchronization engine for ConsistPay. It manages user profiles, handles daily solve verification algorithms, processes battle transactions, and stores beta access requests.

---

## Directory Overview

```
back-end/
├── src/
│   ├── config/              # MongoDB connection setups & parameters
│   ├── controllers/         # Express request/response router logic
│   ├── middleware/          # JWT auth verification guards
│   ├── models/              # Mongoose DB schema definitions
│   ├── providers/           # Platform scraping/GraphQL API connectors
│   ├── routes/              # HTTP routers maps
│   ├── services/            # Core business workflows & payout rules
│   └── utils/               # Calculations helpers & classifiers
├── server.js                # Core app listener entry
└── README.md                # Server documentation
```

---

## Architecture Components

### 1. Platform Providers (`/providers`)
*   **LeetCodeProvider.js:** Executes GraphQL queries to retrieve user solved stats, submission logs, and badges from LeetCode.
*   **GFGProvider.js:** Extracts user metadata and solved statistics from public GeeksforGeeks profiles via user-agent rotated scraping.

### 2. Core Workflows (`/services/platformService.js`)
*   **initiateLinkage:** Generates secure bio verification tokens (`CP-LEET-XXXXXX`).
*   **verifyOwnership:** Confirms profile ownership by scanning bio blocks for verification tokens.
*   **syncDailySolve:** Fetches today's submissions. Registers solved problems, handles calendar dates, and updates streaks and payouts.

### 3. Database Schemas (`/models`)
*   *PlatformLinkage.js:* Stores verified platform links, solved statistics, and cached badge arrays.
*   *Submission.js:* Registers verified solutions, topics, difficulties, and payout processing flags.
*   *Challenge.js:* Manages 1v1 consistency duel status, active stakes, and opponent records.
*   *BetaAccessRequest.js:* Keeps track of user requests for upcoming module early beta enrollments.

---

## Setup & Running

### 1. Setup local env file
Create `.env` using `.env.example` as a template:
```bash
cp .env.example .env
```
Populate the environment variables with your database URI, Razorpay tokens, Gemini key, and JWT encryption secrets.

### 2. Run API Server
Install NPM modules and spin up the Express API listener:
```bash
npm install
npm run dev
```
The server will bind to port `8000` (or the `PORT` specified in your `.env`).
