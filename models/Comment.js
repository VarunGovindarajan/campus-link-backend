/* --- NEW FILE: server/models/Comment.js --- */
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFoundItem', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);