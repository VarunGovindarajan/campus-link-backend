/* --- server/controllers/messageController.js --- */
const Message = require('../models/Message');
const Booking = require('../models/Booking');

// Get all messages for a specific booking
exports.getMessages = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Authorization check
        if (booking.tutor.toString() !== req.user.id && booking.learner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        
        const messages = await Message.find({ booking: req.params.bookingId }).sort({ createdAt: 'asc' });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Send a new message
exports.sendMessage = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });
        
        // Determine receiver
        const receiverId = booking.tutor.toString() === req.user.id ? booking.learner : booking.tutor;

        const newMessage = new Message({
            booking: req.params.bookingId,
            sender: req.user.id,
            receiver: receiverId,
            content: req.body.content,
        });

        const message = await newMessage.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};