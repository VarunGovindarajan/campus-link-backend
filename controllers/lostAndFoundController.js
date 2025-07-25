const LostFoundItem = require('../models/LostFoundItem');

exports.getItems = async (req, res) => {
    try {
        const items = await LostFoundItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.createItem = async (req, res) => {
    try {
        const newItem = new LostFoundItem({ ...req.body, reporter: req.user.id });
        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};