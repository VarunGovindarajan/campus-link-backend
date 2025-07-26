const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Removes leading/trailing whitespace
    },
    content: {
        type: String,
        required: true,
        trim: true // Removes leading/trailing whitespace
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // --- NEW: Field for tracking reactions ---
    reactions: [
        {
            emoji: { // The emoji character (e.g., '👍', '❤️')
                type: String,
                required: true
            },
            count: { // How many times this emoji has been used
                type: Number,
                default: 0
            },
            users: [ // Array of user IDs who reacted with this emoji
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            ]
        }
    ]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Announcement', AnnouncementSchema);
