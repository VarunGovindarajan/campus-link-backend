const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const newAnnouncement = new Announcement({ title, content, category, author: req.user.id });
        const announcement = await newAnnouncement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};