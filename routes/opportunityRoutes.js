const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { auth, adminAuth } = require('../middleware/auth');

// Get all opportunities (all authenticated users)
router.get('/', auth, opportunityController.getOpportunities);

// Create an opportunity (admin only)
router.post('/', auth, adminAuth, opportunityController.createOpportunity);

// Update an opportunity (admin only)
router.put('/:id', auth, adminAuth, opportunityController.updateOpportunity);

// Delete an opportunity (admin only)
router.delete('/:id', auth, adminAuth, opportunityController.deleteOpportunity);

module.exports = router;
