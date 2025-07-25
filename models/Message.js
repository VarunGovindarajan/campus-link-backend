
/* --- server/models/Message.js --- */
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
