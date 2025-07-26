
/* --- server/routes/messageRoutes.js --- */
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// @route   GET api/messages/:bookingId
// @desc    Get all messages for a booking
router.get('/:bookingId', auth, messageController.getMessages);

// @route   POST api/messages/:bookingId
// @desc    Send a message
router.post('/:bookingId', auth, messageController.sendMessage);

module.exports = router;
