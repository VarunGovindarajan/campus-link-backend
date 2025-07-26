const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const { auth, adminAuth } = require('../middleware/auth');

// Admin routes
router.get('/all', auth, adminAuth, pollController.getAllPolls);
router.post('/', auth, adminAuth, pollController.createPoll);
router.put('/:id/toggle', auth, adminAuth, pollController.togglePollStatus);
router.delete('/:id', auth, adminAuth, pollController.deletePoll);

// Student routes
router.get('/active', auth, pollController.getActivePolls);
router.post('/:pollId/vote/:optionId', auth, pollController.voteOnPoll);

module.exports = router;
