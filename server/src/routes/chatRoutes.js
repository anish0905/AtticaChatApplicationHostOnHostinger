const express = require("express");
const router = express.Router();
const multer = require("multer");
const chatController = require("../controllers/chatController");
// const getNotificationId = require("../controllers/notificationController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/messages",
  upload.fields([{ name: "image" }, { name: "document" }, { name: "video" }]),
  chatController.sendMessage
);

// router.get("/getNotificationId", getNotificationId);

module.exports = router;
