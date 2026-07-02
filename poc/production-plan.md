# Production Integration & Scaling Plan

This document outlines the roadmap to implement, integrate, and scale the LeetCode verification system from POC to production inside ConsistPay.

## 1. Database Schema Design

To ensure data integrity, prevent streak spoofing, and avoid database growth issues, we define the following relational structures (represented in SQL syntax, adaptable to MongoDB/Mongoose).

### Table: `leetcode_linkages`
Stores the verified connection between a ConsistPay user and their LeetCode account.
```sql
CREATE TABLE leetcode_linkages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    leetcode_username VARCHAR(100) NOT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_token VARCHAR(50), -- CP-XXXX
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_leetcode_username ON leetcode_linkages(leetcode_username);
```

### Table: `leetcode_verified_solves`
Stores individual unique solves to act as transaction records. `submission_id` is a unique index to prevent double-claiming.
```sql
CREATE TABLE leetcode_verified_solves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linkage_id UUID NOT NULL REFERENCES leetcode_linkages(id) ON DELETE CASCADE,
    submission_id VARCHAR(50) NOT NULL UNIQUE, -- LeetCode's submission id
    title_slug VARCHAR(255) NOT NULL,
    solved_date DATE NOT NULL, -- Localized date (e.g. 2026-07-02) based on user timezone
    timestamp BIGINT NOT NULL, -- Unix epoch
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX idx_unique_solve_per_day_user ON leetcode_verified_solves(linkage_id, title_slug, solved_date);
```

---

## 2. Onboarding & Ownership Verification Flow

To link an account securely without passwords:

```
[ User Input Username ] 
        │
        ▼
[ Generate Token: "CP-" + Random(1000..9999) ]
        │
        ▼
[ Instruct User: "Paste token into your LeetCode profile Bio" ]
        │
        ▼
[ User clicks "Confirm Link" ] ───► [ Call GET /api/leetcode/verify ]
                                                  │
                                                  ▼
                                       [ Fetch getUserProfile query ]
                                                  │
                                                  ▼
                                       [ Is token in aboutMe bio? ]
                                        ├─── Yes ──► [ Mark Linkage Verified ]
                                        └─── No  ──► [ Return Verification Error ]
```

---

## 3. Scale-Up & Processing Strategy

Running real-time checks on hundreds of users concurrently presents scaling problems (rate limits, response lag). We propose a **hybrid verification strategy**.

### A. Sync Strategies
1.  **On-Demand Sync (Dashboard Pull):**
    *   When the user visits the dashboard, they can trigger a manual sync.
    *   **Throttling:** Capped at once per 10 minutes per user using a Redis rate limiter to prevent spamming LeetCode.
2.  **Nightly Fallback Worker (Cron Queue):**
    *   At 11:30 PM relative to the user's timezone, a background worker checks if the user has completed their daily coding habit.
    *   If not, it enqueues a background job to sync their LeetCode status automatically so their streak doesn't break due to forgetting to sync manually.

### B. Background Queue Architecture
To handle large batches of queries without getting IP-banned, we use a message queue (e.g., BullMQ with Redis):
*   Jobs are processed in a serialized queue with a delay (e.g., 500ms - 1s between LeetCode API calls).
*   **Concurreny limits:** Bound to a single concurrent worker thread per target proxy IP to avoid triggering Cloudflare blocks.
*   **Retries:** If the job fails due to network or WAF issues, retry up to 3 times with exponential backoff (e.g., 2s, 10s, 60s).
