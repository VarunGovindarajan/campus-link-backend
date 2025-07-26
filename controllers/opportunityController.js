const Opportunity = require('../models/Opportunity');

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private (Authenticated Users)
exports.getOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find().populate('postedBy', 'name').sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private (Admin only)
exports.createOpportunity = async (req, res) => {
    try {
        const newOpportunity = new Opportunity({
            ...req.body,
            postedBy: req.user.id
        });
        const opportunity = await newOpportunity.save();
        res.status(201).json(opportunity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Admin only)
exports.updateOpportunity = async (req, res) => {
    try {
        let opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ msg: 'Opportunity not found' });
        }
        
        opportunity = await Opportunity.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(opportunity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Admin only)
exports.deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ msg: 'Opportunity not found' });
        }
        
        await opportunity.deleteOne();
        res.json({ msg: 'Opportunity removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
