const express = require("express");
const router = express.Router();

const { getNotificationId,deleteNotification,deleteNotificationByRecipient } = require("../controllers/notificationController");

router.get("/getNotification/:recipient", getNotificationId);
router.delete("/deleteNotification/:id", deleteNotification);
router.delete("/getNotification/:id", deleteNotificationByRecipient);

module.exports = router;
