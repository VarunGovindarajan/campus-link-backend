/* --- server/models/Skill.js --- */
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    availability: { type: String, required: true, default: 'Flexible' }, // e.g., "Weekends", "Evenings after 5 PM"
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);