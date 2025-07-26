/* --- server/controllers/bookingController.js --- */
const Booking = require('../models/Booking');

// Get all bookings for the current user (both as learner and tutor)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ $or: [{ learner: req.user.id }, { tutor: req.user.id }] })
            .populate('skill', 'skillName')
            .populate('tutor', 'name')
            .populate('learner', 'name')
            .sort({ sessionTime: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create a new booking request
exports.createBooking = async (req, res) => {
    try {
        const newBooking = new Booking({ ...req.body, learner: req.user.id });
        const booking = await newBooking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update a booking's status (confirm, complete, cancel)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Authorization check: only tutor or learner can update
        if (booking.tutor.toString() !== req.user.id && booking.learner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};