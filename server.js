const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Import Node.js http module
const { Server } = require("socket.io"); // Import Server class from socket.io
const cron = require('node-cron');
const fetchAndSaveNews = require('./services/newsFetcher');
const scrapeAndSaveInternships = require('./services/internshipScraper'); // Import the new scraper
const scrapeAndSaveHackathons =require('./services/hackathonScraper');
const scrapeAndSaveWorkshops=require('./services/workshopScraper');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// --- Create HTTP Server and integrate with Express ---
const httpServer = http.createServer(app);

// --- Initialize Socket.IO Server ---
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Your frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


// --- API Routes ---
app.get('/', (req, res) => {
    res.send('CampusLink API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/lost-and-found', require('./routes/lostAndFoundRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
// in server.js, add this line with your other routes:
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/opportunities', require('./routes/opportunityRoutes'));
// in server.js, add this line with your other app.use() calls:
app.use('/api/polls', require('./routes/pollRoutes'));


// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join a private room based on the booking ID
    socket.on('join_room', (bookingId) => {
        socket.join(bookingId);
        console.log(`User with ID: ${socket.id} joined room: ${bookingId}`);
    });

    // Listen for a new message
    socket.on('send_message', (data) => {
        // Broadcast the received message to everyone in that specific room
        // The 'data' object should contain { bookingId, sender, content, ... }
        socket.to(data.bookingId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});
cron.schedule('0 8 * * *', () => {
    fetchAndSaveNews();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Set to your server's timezone
});
// --- NEW: Schedule for scraping internships (runs daily at 9:00 AM) ---
cron.schedule('0 9 * * *', scrapeAndSaveInternships, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

cron.schedule('0 10 * * *', scrapeAndSaveHackathons, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

cron.schedule('0 11 * * *', scrapeAndSaveWorkshops, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});




// --- Server Listening ---
// We now use httpServer.listen instead of app.listen
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Optional: Run the job once on server start for immediate testing
    fetchAndSaveNews(); 
     scrapeAndSaveInternships();
     scrapeAndSaveHackathons();
     scrapeAndSaveWorkshops();
});
