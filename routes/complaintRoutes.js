const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, complaintController.getComplaints);
router.post('/', auth, complaintController.createComplaint);
router.put('/:id', [auth, adminAuth], complaintController.updateComplaintStatus);

module.exports = router;