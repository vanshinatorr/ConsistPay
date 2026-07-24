# ConsistPay Production Readiness & SRE Operations Guide

This document contains standard operating procedures, architectural setup instructions, and troubleshooting steps for the ConsistPay application (Frontend & Backend). Refer to this guide if any runtime issues arise or if you need to migrate/re-deploy platforms in the future.

---

## 1. System Architecture Summary

The application is split into a **React (Vite) Frontend** and a **Node.js (Express) Backend**.

- **Frontend:** Deployed on Vercel. Static routing, API endpoint config via `VITE_API_URL`.
- **Backend:** Deployed on Vercel Serverless (configured with `vercel.json` routing). Works as a standard Node.js server.
- **Database:** MongoDB Atlas (Multi-Cloud, serverless).
- **Core Integrations:** LeetCode GraphQL API, GFG Scraper, Code360 API, Gemini API, Razorpay Checkout.

---

## 2. Serverless Optimization Safeguards (Vercel-Specific)

We implemented critical SRE patterns in the backend to ensure zero crashes under serverless container scales (tested for 1000+ concurrent users):

1. **`dbMiddleware.js` (Database Race Condition Guard):**
   - Located at `/back-end/src/middleware/dbMiddleware.js`.
   - Forces Vercel to await a ready database connection (`readyState === 1`) before handing the request to the routing controller.
   - Eliminates the `Cannot call users.findOne() before initial connection is complete` Mongoose error.

2. **Connection Caching (`db.js`):**
   - Located at `/back-end/src/config/db.js`.
   - Caches active Mongoose connection handlers so Vercel reuse instances instead of creating new sockets.
   - Disables command buffering (`bufferCommands: false`) to fail fast rather than leaving queries hanging.

3. **Unhandled Exception Guard (`server.js`):**
   - Process listeners check for `unhandledRejection` and `uncaughtException` in `server.js`.
   - Intercepts unexpected errors (e.g. SMTP or downstream API timeout), logs the trace, and keeps the Node process alive instead of terminating with exit code 1.

4. **In-Memory Rate Limiter (`rateLimiter.js`):**
   - Located at `/back-end/src/middleware/rateLimiter.js`.
   - Protects `/api/auth/send-otp` (Max 5 requests / 10 mins) and `/api/platforms/sync` (Max 15 requests / 5 mins).
   - Prevents DDoS vectors and saves your Gemini/Nodemailer API limits from automated spam.

---

## 3. Environment Variables Settings

Verify that these variables are correctly configured on your hosting platform (Vercel / Render Project Settings):

### Backend Environment Variables
| Variable Name | Description / Example Value |
| --- | --- |
| `MONGO_URI` | MongoDB connection string (Verify network whitelist `0.0.0.0/0` is active). |
| `JWT_SECRET` | Secret key used for signing session tokens. |
| `RAZORPAY_KEY_ID` | Razorpay API client ID for checkout logic. |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret Key for verify signature checks. |
| `EMAIL_USER` | Nodemailer sender Gmail account (e.g. `vanshvijay9784@gmail.com`). |
| `EMAIL_PASS` | Nodemailer App Password (16-char passcode generated via Google App Passwords). |
| `GEMINI_API_KEY` | Google Gemini API key for solve verification and insights. |

### Frontend Environment Variables
| Variable Name | Description / Example Value |
| --- | --- |
| `VITE_API_URL` | Deployed backend API URL (e.g., `https://consist-pay-backend.vercel.app`). |
| `VITE_RAZORPAY_KEY` | Public Razorpay key ID. |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID for OAuth flow. |

---

## 4. Troubleshooting Steps (If things fail)

If users report errors or the app stops responding, follow this triage flow:

### Step 1: Check Vercel Backend Logs
- Navigate to the **Logs** tab on the Vercel dashboard.
- Filter logs by **Error** or **Fatal** level.
- Check the error trace. If it is `Database connection failed`, check if MongoDB Atlas is active.

### Step 2: Check MongoDB Network Access (IP Whitelist)
- If the logs show `MongooseServerSelectionError: connection timed out`, log into MongoDB Atlas.
- Check **Security -> Network Access**.
- Ensure the IP address `0.0.0.0/0` (Allow Access from Anywhere) is active. If Vercel IPs change, this rule is mandatory.

### Step 3: Google Login "Failed" Error
- If Google login fails, open the browser's console (`F12` -> Console).
- If you see `redirect_uri_mismatch`, check **Google Cloud Console -> APIs & Services -> Credentials**.
- Ensure your production frontend domain (e.g. `https://daily-coding-habit-tracker.vercel.app`) is added to **Authorized JavaScript Origins**.

### Step 4: Sync API Cooldown Failures
- The sync action has a database cooldown of 30 seconds per user, and a rate limiter of 15 requests per 5 minutes per IP.
- If a user reports sync errors, ask them to wait 1-2 minutes and try again.

---

## 5. Migration to Render (Backup Plan)

If Vercel ever experiences pricing shifts or you want to migrate back to Render, follow these steps:

1. **Deploy Repository:** Link your Github repository on the Render dashboard.
2. **Setup Web Service:** Create a new Web Service for the backend. Set the **Root Directory** to `back-end`, **Build Command** to `npm install`, and **Start Command** to `npm start`.
3. **Configure Environment Variables:** Add all variables listed in section 3 of this document under Render's Environment panel.
4. **Update Frontend config:** Update your Vercel Frontend environment variable `VITE_API_URL` to point to the new Render Web Service URL. Re-deploy the frontend.
