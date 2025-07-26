const Poll = require('../models/Poll');

// @desc    Get all polls (for admin view)
exports.getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Get only active polls (for student view)
exports.getActivePolls = async (req, res) => {
    try {
        const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new poll (admin only)
exports.createPoll = async (req, res) => {
    try {
        const { question, options, isAnonymous } = req.body;
        const formattedOptions = options.map(opt => ({ text: opt, votes: 0, voters: [] }));
        
        const newPoll = new Poll({
            question,
            options: formattedOptions,
            isAnonymous,
            createdBy: req.user.id
        });

        const poll = await newPoll.save();
        res.status(201).json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Submit a vote on a poll
exports.voteOnPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.pollId);
        if (!poll || !poll.isActive) {
            return res.status(404).json({ msg: 'Poll not found or is not active.' });
        }

        // Check if user has already voted
        const userHasVoted = poll.options.some(opt => opt.voters.includes(req.user.id));
        if (userHasVoted) {
            return res.status(400).json({ msg: 'You have already voted on this poll.' });
        }

        const option = poll.options.id(req.params.optionId);
        if (!option) {
            return res.status(404).json({ msg: 'Option not found.' });
        }

        option.votes++;
        option.voters.push(req.user.id);
        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Toggle a poll's active status (admin only)
exports.togglePollStatus = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });

        poll.isActive = !poll.isActive;
        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a poll (admin only)
exports.deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
        
        await poll.deleteOne();
        res.json({ msg: 'Poll removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
