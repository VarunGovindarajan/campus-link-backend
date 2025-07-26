const axios = require('axios');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User'); // We need to associate the post with an admin user

const fetchAndSaveNews = async () => {
    console.log('Running scheduled job: Fetching tech news...');
    try {
        // Find an admin user to associate the posts with.
        // In a real-world scenario, you might have a dedicated "System" user.
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found to post news. Aborting.');
            return;
        }

        const apiKey = process.env.GNEWS_API_KEY;
        const query = 'technology OR "computer science" OR "software development"';
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=5&token=${apiKey}`;

        const response = await axios.get(url);
        const articles = response.data.articles;

        if (!articles || articles.length === 0) {
            console.log('No new articles found from GNews.');
            return;
        }

        for (const article of articles) {
            // Check if an article with the same link already exists to avoid duplicates
            const existingArticle = await Opportunity.findOne({ link: article.url });

            if (!existingArticle) {
                const newArticle = new Opportunity({
                    title: article.title,
                    type: 'Tech News',
                    description: article.description,
                    link: article.url,
                    postedBy: adminUser._id,
                });
                await newArticle.save();
                console.log(`Saved new article: "${article.title}"`);
            }
        }
        console.log('Tech news fetching job completed.');

    } catch (error) {
        // GNews API might have rate limits on the free plan, so we log errors gently.
        if (error.response) {
            console.error('Error fetching news from GNews API:', error.response.data);
        } else {
            console.error('An unexpected error occurred during news fetching:', error.message);
        }
    }
};

module.exports = fetchAndSaveNews;
