const mongoose = require('mongoose');

const LostFoundItemSchema = new mongoose.Schema({
    type: { type: String, enum: ['lost', 'found'], required: true },
    item: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.models.LostFoundItem || mongoose.model('LostFoundItem', LostFoundItemSchema);