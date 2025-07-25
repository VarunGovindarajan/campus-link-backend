const TimetableEntry = require('../models/TimetableEntry');

exports.getSchedule = async (req, res) => {
    try {
        const schedule = await TimetableEntry.find({ user: req.user.id });
        res.json(schedule);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.addClass = async (req, res) => {
    try {
        const newClass = new TimetableEntry({ ...req.body, user: req.user.id });
        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateClass = async (req, res) => {
    try {
        let entry = await TimetableEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Class not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        entry = await TimetableEntry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(entry);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteClass = async (req, res) => {
    try {
        let entry = await TimetableEntry.findById(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Class not found' });
        if (entry.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await TimetableEntry.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Class removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
