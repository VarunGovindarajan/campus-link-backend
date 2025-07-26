const axios = require('axios');
const cheerio = require('cheerio');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const scrapeAndSaveInternships = async () => {
    console.log('Running scheduled job: Scraping LinkedIn for internships...');
    try {
        const targetUrl = 'https://www.linkedin.com/jobs/search?keywords=Computer%20Science%20Intern&location=India&f_TPR=r86400';

        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found to post internships. Aborting.');
            return;
        }

        const { data } = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        const internships = [];

        $('li').each((index, element) => {
            const jobCard = $(element);
            const title = jobCard.find('h3.base-search-card__title').text().trim();
            const company = jobCard.find('h4.base-search-card__subtitle').text().trim();
            let link = jobCard.find('a.base-card__full-link').attr('href');

            if (title && company && link) {
                // --- FIX: Clean the URL to remove tracking parameters ---
                if (link.includes('?')) {
                    link = link.split('?')[0];
                }

                internships.push({
                    title: `${title}`,
                    type: 'Internship',
                    description: `An internship opportunity is available at ${company}. Click the link to learn more and apply.`,
                    link: link,
                    postedBy: adminUser._id,
                });
            }
        });

        if (internships.length === 0) {
            console.log('No new internships found on LinkedIn in the last 24 hours.');
            return;
        }

        let newPostsCount = 0;
        for (const intern of internships) {
            const existingInternship = await Opportunity.findOne({ link: intern.link });

            if (!existingInternship) {
                const newOpportunity = new Opportunity(intern);
                await newOpportunity.save();
                newPostsCount++;
            }
        }
        
        if (newPostsCount > 0) {
            console.log(`Successfully saved ${newPostsCount} new internship(s).`);
        } else {
            console.log('No new internships to save (already in DB).');
        }

    } catch (error) {
        console.error('An error occurred during the internship scraping job:', error.message);
    }
};

module.exports = scrapeAndSaveInternships;
