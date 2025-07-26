const express = require('express');
const router = express.Router();
const {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    toggleReaction // Import the new function
} = require('../controllers/announcementController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   POST /api/announcements
// @desc    Create a new announcement (Admin only)
// @access  Private (Admin)
router.post('/', auth, adminAuth, createAnnouncement);

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private (Authenticated Users)
router.get('/', auth, getAnnouncements);

// @route   PUT /api/announcements/:id
// @desc    Update an announcement by ID (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, adminAuth, updateAnnouncement);

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement by ID (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, adminAuth, deleteAnnouncement);

// @route   POST /api/announcements/:id/react
// @desc    Add or remove a reaction to an announcement (Authenticated users)
// @access  Private (Authenticated Users)
router.post('/:id/react', auth, toggleReaction); // New route for reactions

module.exports = router;
