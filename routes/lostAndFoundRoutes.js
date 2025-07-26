const express = require('express');
const router = express.Router();
const lostAndFoundController = require('../controllers/lostAndFoundController');
const { auth } = require('../middleware/auth');
const upload = require('../config/cloudinaryConfig');

router.get('/', auth, lostAndFoundController.getItems);
router.post('/', auth, upload.single('image'), lostAndFoundController.createItem);
router.delete('/:id', auth, lostAndFoundController.deleteItem);

// --- NEW: Route for finding AI matches ---
router.post('/:id/find-matches', auth, lostAndFoundController.findMatches);

module.exports = router;
