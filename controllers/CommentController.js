
/* --- NEW FILE: server/controllers/commentController.js --- */
const Comment = require('../models/Comment');

// Get all comments for a specific item
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ item: req.params.itemId }).populate('user', 'name').sort({ createdAt: 'asc' });
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Add a new comment to an item
exports.addComment = async (req, res) => {
    try {
        const newComment = new Comment({
            content: req.body.content,
            item: req.params.itemId,
            user: req.user.id
        });

        const comment = await newComment.save();
        // Populate user details for immediate display on the frontend
        await comment.populate('user', 'name'); 
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
