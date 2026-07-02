# Risk Analysis & Mitigation Matrix

This document identifies potential structural, legal, and operational risks associated with integrating the automated LeetCode verification system and provides mitigation plans for each.

## Risk Registry

| Risk ID | Risk Name | Severity | Likelihood | Impact Area | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | Cloudflare WAF Blocking (IP Ban) | **Critical** | High | System Availability | Integrate proxy rotating services, implement backend request throttling, and enforce strict caching on results. |
| **R-02** | GraphQL Schema Deprecation | **Medium** | Low | Core Functionality | Abstract the GraphQL requester layer; set up automated telemetry alerts on fetch failures; design a fallback crawler. |
| **R-03** | Profile Privacy Lockout | **Medium** | Medium | User Experience | Build distinct frontend warning banners; block streak verification and instruct user to set profile to public. |
| **R-04** | Timezone / Deadline Spoofing | **Low** | Medium | Game Mechanics | Lock timezone config once a challenge starts. Enforce server-side cutoff checks matching target timezone. |
| **R-05** | Double-Claim / Re-use of Solves | **High** | Medium | Game Mechanics / Database | Establish a unique database index on `leetcode_submission_id` to guarantee a submission is only recorded once. |

---

## Detailed Analyses & Mitigations

### R-01: Cloudflare WAF Blocking (IP Ban)
*   **The Threat:** LeetCode protects its site using Cloudflare. Automated backend processes making multiple requests per minute from a single hosting provider's IP block (e.g., AWS EC2, Vercel Serverless) will trigger CAPTCHAs or `403 Forbidden` errors.
*   **Mitigation:**
    1.  **Request Caching:** Do not hit LeetCode every time the dashboard is loaded. Cache the status in Redis for 10 minutes.
    2.  **Rate Limiting:** Lock the client "Sync" button for 10 minutes once pressed.
    3.  **Proxy Rotation (If scaling beyond 1,000+ users):** Route GraphQL POST requests through a pool of residential proxies or rotating serverless functions.
    4.  **Header Emulation:** Ensure requests pass standard browser fingerprints (realistic `User-Agent`, `Referer`, and headers).

### R-02: GraphQL Schema Deprecation / API Failure
*   **The Threat:** LeetCode has no public API SLA. If they change the schema name from `recentAcSubmissionList` to something else, our endpoint will break immediately.
*   **Mitigation:**
    1.  **Telemetry & Alerts:** Log GraphQL errors to Sentry or a logging channel. If error rates exceed 5%, alert developers immediately.
    2.  **Decoupled Adapter Pattern:** Place the query strings and parsers in a decoupled service module. If the schema changes, we can patch the query string on our server in 5 minutes without altering backend database schemas.
    3.  **Fallback Web Scraper:** If GraphQL is completely shut down, build a backup parser using a headless browser cluster (e.g. Puppeteer) hosted in a separate serverless worker to scrape the public HTML profile page.

### R-03: Profile Privacy Settings
*   **The Threat:** A user has their LeetCode profile settings set to "Private," causing the GraphQL list to return empty (`[]`). The user complains that they solved problems but ConsistPay broke their streak.
*   **Mitigation:**
    1.  **UI Feedback:** When `recentAcSubmissionList` returns empty, display a modal: *"We found 0 submissions. If you solved a problem today, check if your LeetCode profile is set to Private. [Link to LeetCode Privacy Settings]"*.
    2.  **Onboarding Test Check:** During the onboarding verification step (Milestone 3), check if we can read their submissions count. If not, do not allow them to link the profile until they change privacy settings to public.
