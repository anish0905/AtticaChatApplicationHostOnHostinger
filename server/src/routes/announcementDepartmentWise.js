const express = require('express');
const { postAnnouncement, getAnnouncementsByDepartment, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementDepartmentWise');

const router = express.Router();


router.post = ("/announcements",postAnnouncement)
router.get =("/announcements/:department",getAnnouncementsByDepartment)
router.put =("/announcements/:id",updateAnnouncement)
router.delete =("/announcements/:id",deleteAnnouncement)

module.exports = router;

