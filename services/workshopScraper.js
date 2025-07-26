const axios = require('axios');
const cheerio = require('cheerio');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const scrapeAndSaveWorkshops = async () => {
    console.log('Running scheduled job: Scraping Eventbrite for workshops...');
    try {
        const targetUrl = 'https://www.eventbrite.com/d/online/free--technology--events/workshops/';

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found to post workshops. Aborting.');
            return;
        }

        const { data } = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        const workshops = [];

        // --- NEW RELIABLE METHOD: Extract structured data from the page ---
        const scriptData = $('script[id="__NEXT_DATA__"]').html();
        
        if (scriptData) {
            const jsonData = JSON.parse(scriptData);
            const events = jsonData?.props?.pageProps?.events;

            if (events && events.length > 0) {
                events.forEach(event => {
                    const eventDetails = event?.event;
                    if (eventDetails) {
                        let link = eventDetails.url;
                        // --- FIX: Clean the URL to remove tracking parameters ---
                        if (link.includes('?')) {
                            link = link.split('?')[0];
                        }

                        workshops.push({
                            title: eventDetails.name,
                            type: 'Workshop',
                            description: eventDetails.summary || `An online workshop titled "${eventDetails.name}". Click for details.`,
                            link: link,
                            postedBy: adminUser._id,
                        });
                    }
                });
            }
        }

        if (workshops.length === 0) {
            console.log('Could not find any workshop listings on Eventbrite. The website structure may have changed.');
            return;
        } else {
            console.log(`Found ${workshops.length} workshops from the page data. Checking for duplicates...`);
        }

        let newPostsCount = 0;
        for (const workshop of workshops) {
            const existingWorkshop = await Opportunity.findOne({ link: workshop.link });

            if (!existingWorkshop) {
                const newOpportunity = new Opportunity(workshop);
                await newOpportunity.save();
                newPostsCount++;
            }
        }
        
        if (newPostsCount > 0) {
            console.log(`Successfully saved ${newPostsCount} new workshop(s).`);
        } else {
            console.log('No new workshops to save. All found listings are already in the database.');
        }

    } catch (error) {
        console.error('An error occurred during the workshop scraping job:', error.message);
    }
};

module.exports = scrapeAndSaveWorkshops;
