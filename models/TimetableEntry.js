const mongoose = require('mongoose');

const TimetableEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: String, required: true },
    time: { type: String, required: true }, // e.g., "09:00 - 10:30"
    subject: { type: String, required: true },
    code: { type: String },
    location: { type: String },
});

module.exports = mongoose.models.TimetableEntry || mongoose.model('TimetableEntry', TimetableEntrySchema);