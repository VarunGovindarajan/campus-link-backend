const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtpAndRegister, login } = require('../controllers/authController');

// --- NEW: Route to send an OTP to the user's email ---
// @route   POST api/auth/send-otp
router.post('/send-otp', sendOtp);

// --- NEW: Route to verify the OTP and complete registration ---
// @route   POST api/auth/verify-otp-and-register
router.post('/verify-otp-and-register', verifyOtpAndRegister);

// --- Login route remains the same ---
// @route   POST api/auth/login
router.post('/login', login);

module.exports = router;
