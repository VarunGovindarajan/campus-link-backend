const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary with credentials from your .env file
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'campuslink-lost-and-found', // A folder name in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize images
    },
});

// Initialize Multer with the configured storage
const upload = multer({ storage: storage });

module.exports = upload;
