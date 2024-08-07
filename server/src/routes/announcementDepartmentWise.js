const express = require('express');
const { postAnnouncement, getAnnouncementsByDepartment, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementDepartmentWise');

const router = express.Router();


router.post ("/",postAnnouncement)
router.get ("/:department",getAnnouncementsByDepartment)
router.put ("/:id",updateAnnouncement)
router.delete ("/:id",deleteAnnouncement)

module.exports = router;

