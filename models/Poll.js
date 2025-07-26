const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [
        {
            text: { // The text of the option (e.g., "Yes", "No")
                type: String, 
                required: true,
                trim: true 
            },
            votes: { // The count of votes for this option
                type: Number, 
                default: 0 
            },
            voters: [{ // An array of user IDs who voted for this option
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            }]
        }
    ],
    isActive: { // Toggled by admins to show/hide the poll from students
        type: Boolean,
        default: true 
    },
    isAnonymous: { // If true, voter names are not shown on the results
        type: Boolean,
        default: false 
    },
    createdBy: { // The admin who created the poll
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Poll', PollSchema);
