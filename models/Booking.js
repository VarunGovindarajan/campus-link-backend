
/* --- server/models/Booking.js --- */
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionTime: { type: Date, required: true }, // The proposed or agreed-upon time
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    learnerMessage: { type: String } // Initial message from the learner
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
