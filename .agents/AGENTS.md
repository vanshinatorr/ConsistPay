# Project Rules: ConsistPay Backend & SRE Guidelines

This workspace contains backend code optimized specifically for Vercel Serverless deployment and high-availability database connections. Follow these strict guidelines for all future modifications.

## 1. Database Connection & Middleware
* **Always Await Connections:** In a serverless environment (Vercel), database connections are asynchronous and transient. Never call database operations before the connection is ready.
* **Use dbMiddleware:** Always routing API requests through the global `dbMiddleware` (`/back-end/src/middleware/dbMiddleware.js`) is mandatory. This ensures `mongoose.connection.readyState === 1` is established before route handlers execute.
* **Keep Connection Caching:** Do not revert the caching setup in `/back-end/src/config/db.js`. The `cachedConnection` variable must be preserved to prevent connection exhaustion.
* **Fail Fast:** Keep Mongoose command buffering disabled (`bufferCommands: false`) to catch connection timeouts instantly instead of leaving requests hanging.

## 2. Process Stability & SRE
* **No Fatal Process Exits:** Never use `process.exit(1)` inside request lifecycles or database connection catch blocks. Serverless containers should throw errors to the global error handler, letting the platform manage lifecycle recycling.
* **Process Guards:** Keep the `unhandledRejection` and `uncaughtException` process event listeners active in `/back-end/src/server.js` to prevent unexpected downstream exceptions from terminating the Node process.
* **Global Error Middleware:** Preserve the JSON catch-all error handling middleware in `/back-end/src/app.js` to format unhandled server exceptions cleanly instead of outputting generic HTML stack traces.

## 3. API Security & Quotas
* **Protect Billing Endpoints:** Always rate-limit resource-heavy or paid third-party API integrations (such as OTP sending or Gemini AI verification calls).
* **Maintain rateLimiter Middleware:** Use the zero-dependency in-memory `rateLimiter` (`/back-end/src/middleware/rateLimiter.js`) for security constraints. Avoid introducing heavy NPM packages for routing limits unless explicitly requested.
