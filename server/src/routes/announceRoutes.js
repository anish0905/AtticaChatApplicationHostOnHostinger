const express = require("express");
const router = express.Router();

const {
  getAnnouncementById,
  createMessage,
  getAllAnnouncements,
  delAllAnouncementsbySender,
  deletebyId,
  updateAnnouncement,
} = require("../controllers/announceController");
const { upload } = require("../middleware/multer.middlewear.js");

const result = upload.fields([
  { name: "image" },
  { name: "document" },
  { name: "video" },
]);
router.post("/postmessages", result, createMessage);
router.get("/getAnnounceById/:id", getAnnouncementById);
router.get("/getAllAnnounce/", getAllAnnouncements);
router.delete("/deleteAnnounce/:id", delAllAnouncementsbySender);
router.delete("/deleteAnnouncebyId/:id", deletebyId);
router.put("/updateAnnouncement/:id", updateAnnouncement);

module.exports = router;
