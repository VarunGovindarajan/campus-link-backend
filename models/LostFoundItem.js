/* --- server/models/LostFoundItem.js --- */
const mongoose = require('mongoose');

const LostFoundItemSchema = new mongoose.Schema({
    type: { type: String, enum: ['lost', 'found'], required: true },
    item: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    // --- NEW: Field for the image URL ---
    imageUrl: { type: String, default: 'https://placehold.co/400x300/cccccc/ffffff?text=No+Image' },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // --- NEW: Status to track if the item is resolved ---
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.models.LostFoundItem || mongoose.model('LostFoundItem', LostFoundItemSchema);



