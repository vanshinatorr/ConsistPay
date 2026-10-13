const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, markSingleAsRead, deleteNotification } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// ─── Notification Routes (mounted at /api/notifications) ─────────────
// CRUD for the authenticated user's in-app notifications (battle invites,
// streak alerts, etc.). Notifications are created server-side by other
// controllers — these endpoints only read, update, and delete.
router.get("/", protect, getNotifications);
router.put("/read", protect, markAsRead);
router.put("/:id", protect, markSingleAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
