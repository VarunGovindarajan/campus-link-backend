const Complaint = require('../models/Complaint');

exports.getComplaints = async (req, res) => {
    try {
        let complaints;
        if (req.user.role === 'admin') {
            complaints = await Complaint.find().sort({ createdAt: -1 });
        } else {
            complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
        }
        res.json(complaints);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.createComplaint = async (req, res) => {
    try {
        const newComplaint = new Complaint({ ...req.body, user: req.user.id });
        const complaint = await newComplaint.save();
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
        res.json(complaint);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
