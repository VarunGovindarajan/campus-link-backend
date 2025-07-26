const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Internship', 'Hackathon', 'Tech News', 'Workshop']
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false // Deadline is optional (e.g., for news articles)
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);
