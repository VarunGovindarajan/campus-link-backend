/* --- NEW FILE: server/routes/commentRoutes.js --- */
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

// Get all comments for an item
router.get('/:itemId', auth, commentController.getComments);

// Add a comment to an item
router.post('/:itemId', auth, commentController.addComment);

module.exports = router;