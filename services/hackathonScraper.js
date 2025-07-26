const axios = require('axios');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const scrapeAndSaveHackathons = async () => {
    console.log('Running scheduled job: Fetching hackathons from HackerEarth API...');
    try {
        const targetUrl = 'https://www.hackerearth.com/chrome-extension/events/';

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found to post hackathons. Aborting.');
            return;
        }

        const { data } = await axios.get(targetUrl, {
            headers: { 
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
            }
        });
        
        const events = data.response;

        if (!events || events.length === 0) {
            console.log('Could not find any event listings from the HackerEarth API.');
            return;
        } else {
            console.log(`Found ${events.length} total events from the API. Filtering for hackathons...`);
        }

        let newPostsCount = 0;
        for (const event of events) {
            const eventType = event.challenge_type.toLowerCase();
            
            // --- UPDATED LOGIC: Be less strict about the event type ---
            // We now accept 'hackathon' or 'hiring challenge'
            if (eventType.includes('hackathon') || eventType.includes('hiring')) {

                // Check if a hackathon with the same link already exists
                const existingEvent = await Opportunity.findOne({ link: event.url });

                if (!existingEvent) {
                    const newOpportunity = new Opportunity({
                        title: event.title,
                        // Standardize the type to 'Hackathon' for our frontend filter
                        type: 'Hackathon', 
                        description: event.description || `Join the ${event.title} event. Click the link to learn more.`,
                        link: event.url,
                        postedBy: adminUser._id,
                    });
                    await newOpportunity.save();
                    newPostsCount++;
                }
            }
        }
        
        if (newPostsCount > 0) {
            console.log(`Successfully saved ${newPostsCount} new hackathon(s)/hiring challenge(s).`);
        } else {
            console.log('No new hackathons to save. All relevant listings found are already in the database.');
        }

    } catch (error) {
        console.error('An error occurred during the hackathon API job:', error.message);
    }
};

module.exports = scrapeAndSaveHackathons;
