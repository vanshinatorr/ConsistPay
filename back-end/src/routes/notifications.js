const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, markSingleAsRead, deleteNotification } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getNotifications);
router.put("/read", protect, markAsRead);
router.put("/:id", protect, markSingleAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
