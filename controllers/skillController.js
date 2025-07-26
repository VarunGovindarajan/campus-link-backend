const Skill = require('../models/Skill');

// Get all available skills, excluding the user's own skills
exports.getAllSkills = async (req, res) => {
    try {
        // **FIX**: Add a clear check for an authenticated user first.
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'User not authenticated or token is invalid.' });
        }
        
        const skills = await Skill.find({ tutor: { $ne: req.user.id } }).populate('tutor', 'name');
        res.json(skills);

    } catch (err) {
        console.error("Error in getAllSkills:", err.message);
        res.status(500).send('Server Error');
    }
};

// Get skills listed by the currently logged-in user
exports.getMySkills = async (req, res) => {
    try {
        // **FIX**: Add a clear check for an authenticated user first.
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'User not authenticated or token is invalid.' });
        }

        const mySkills = await Skill.find({ tutor: req.user.id });
        res.json(mySkills);

    } catch (err) {
        console.error("Error in getMySkills:", err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new skill listing
exports.createSkill = async (req, res) => {
    try {
        // **FIX**: Add a clear check for an authenticated user first.
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'User not authenticated or token is invalid.' });
        }

        const newSkill = new Skill({ ...req.body, tutor: req.user.id });
        const skill = await newSkill.save();
        res.status(201).json(skill);
        
    } catch (err) {
        console.error("Error in createSkill:", err.message);
        res.status(500).send('Server Error');
    }
};
