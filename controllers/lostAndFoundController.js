const LostFoundItem = require('../models/LostFoundItem');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Initialize the Google Gemini AI Model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- NEW: Configuration with less restrictive safety settings ---
const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Use a fast and efficient model for this task
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig, safetySettings });


// Get all *active* items
exports.getItems = async (req, res) => {
    try {
        const items = await LostFoundItem.find({ status: 'active' }).populate('reporter', 'name').sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Create a new item
exports.createItem = async (req, res) => {
    try {
        const newItemData = { ...req.body, reporter: req.user.id };
        if (req.file) {
            newItemData.imageUrl = req.file.path; 
        }
        const newItem = new LostFoundItem(newItemData);
        const item = await newItem.save();
        res.status(201).json(item);
    } catch (err) {
        console.error("Error creating item:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- UPDATED: Find AI-powered matches for a lost item with better error handling ---
exports.findMatches = async (req, res) => {
    try {
        const lostItem = await LostFoundItem.findById(req.params.id);
        if (!lostItem || lostItem.type !== 'lost') {
            return res.status(404).json({ msg: 'Lost item not found.' });
        }

        const foundItems = await LostFoundItem.find({ type: 'found', status: 'active' });
        if (foundItems.length === 0) {
            return res.json([]);
        }

        const foundItemsDescriptions = foundItems.map(item => 
            `ID: ${item._id}, Description: ${item.item} - ${item.description}`
        );

        const prompt = `
            A student lost the following item: "${lostItem.item} - ${lostItem.description}".
            
            Here is a list of items that have been found:
            ${foundItemsDescriptions.join('\n')}

            Based ONLY on the descriptions, identify the top 3 most likely matches for the lost item from the provided list.
            Return ONLY the IDs of the matching items, separated by commas, without any extra text or labels. For example: ID1,ID2,ID3
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // --- FIX: Check if the response was blocked by safety settings ---
        if (!response.text) {
             console.error('Gemini response was blocked or empty.');
             return res.status(500).json({ msg: 'AI response was blocked. Please try a different description.' });
        }
        
        const text = response.text();
        const matchedIds = text.trim().split(',').filter(id => id); // Filter out empty strings

        if (matchedIds.length === 0) {
            return res.json([]);
        }

        const matchedItems = await LostFoundItem.find({
            '_id': { $in: matchedIds }
        }).populate('reporter', 'name');

        res.json(matchedItems);

    } catch (error) {
        // --- FIX: Log the specific Gemini API error to the console ---
        console.error("Error finding AI matches:", error);
        res.status(500).send("Server error: Could not get a response from the AI assistant.");
    }
};


// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const item = await LostFoundItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        if (item.reporter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await item.deleteOne();
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
