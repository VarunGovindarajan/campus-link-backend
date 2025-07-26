/* --- server/routes/skillRoutes.js --- */
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { auth } = require('../middleware/auth');

// @route   GET api/skills
// @desc    Get all available skills
router.get('/', auth, skillController.getAllSkills);

// @route   GET api/skills/my-skills
// @desc    Get skills for the logged-in user
router.get('/my-skills', auth, skillController.getMySkills);

// @route   POST api/skills
// @desc    Create a new skill listing
router.post('/', auth, skillController.createSkill);

module.exports = router;
