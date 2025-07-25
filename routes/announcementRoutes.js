const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', announcementController.getAnnouncements);
router.post('/', [auth, adminAuth], announcementController.createAnnouncement);

module.exports = router;