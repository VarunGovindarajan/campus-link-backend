const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { auth } = require('../middleware/auth');

router.get('/', auth, timetableController.getSchedule);
router.post('/', auth, timetableController.addClass);
router.put('/:id', auth, timetableController.updateClass);
router.delete('/:id', auth, timetableController.deleteClass);

module.exports = router;
