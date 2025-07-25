const express = require('express');
const router = express.Router();
const lostAndFoundController = require('../controllers/lostAndFoundController');
const { auth } = require('../middleware/auth');

router.get('/', lostAndFoundController.getItems);
router.post('/', auth, lostAndFoundController.createItem);

module.exports = router;