const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// @route   GET api/bookings/my-sessions
// @desc    Get all bookings for the current user
router.get('/my-sessions', auth, bookingController.getMyBookings);

// @route   POST api/bookings
// @desc    Create a new booking request
router.post('/', auth, bookingController.createBooking);

// @route   PUT api/bookings/:id
// @desc    Update booking status
router.put('/:id', auth, bookingController.updateBookingStatus);

module.exports = router;