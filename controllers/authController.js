const User = require('../models/User');
const Otp = require('../models/Otp'); // Import the Otp model
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Email transporter setup using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS  // Your email password or app-specific password from .env
    }
});

/**
 * @desc    Send OTP to user's college email for registration
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    // Adjust the regex to match your specific college domain
    const collegeEmailRegex = /^[a-zA-Z0-9.]+@sece\.ac\.in$/;
    if (!collegeEmailRegex.test(email)) {
        return res.status(400).json({ msg: 'Please use your official college email ID (e.g., name.year-dept@sece.ac.in).' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ msg: 'User with this email is already registered. Please login.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CampusLink - Your Registration OTP',
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>CampusLink Registration OTP</h2><p>Use the following OTP to complete your registration:</p><h3 style="font-size: 28px; text-align: center; background-color: #f0f0f0; padding: 15px; border-radius: 8px;">${otp}</h3><p>This OTP is valid for <strong>5 minutes</strong>.</p></div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                return res.status(500).json({ msg: 'Failed to send OTP email. Please try again.' });
            }
            console.log('OTP Email sent successfully:', info.response);
            res.status(200).json({ msg: 'OTP sent to your college email address.' });
        });

    } catch (err) {
        console.error('Server error during sendOtp:', err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Verify OTP and complete user registration
 * @route   POST /api/auth/verify-otp-and-register
 * @access  Public
 */
exports.verifyOtpAndRegister = async (req, res) => {
    const { email, otp, name, password, role } = req.body;

    try {
        const storedOtp = await Otp.findOne({ email });

        if (!storedOtp) {
            return res.status(400).json({ msg: 'OTP expired or invalid. Please request a new one.' });
        }
        if (storedOtp.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP. Please try again.' });
        }

        let user = await User.findOne({ email });

        if (user && !user.isVerified) {
            user.name = name;
            user.password = password;
            user.isVerified = true;
            await user.save();
        } else {
            user = new User({ name, email, password, role: 'student', isVerified: true });
            await user.save();
        }

        await Otp.deleteOne({ email });

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });

    } catch (err) {
        console.error('Server error during OTP verification:', err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    User login
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let user = await User.findOne({ email });

        if (!user || !user.isVerified) {
            return res.status(400).json({ msg: 'Invalid Credentials or email not verified.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (user.role !== role) {
            return res.status(403).json({ msg: `Access denied. You are registered as a ${user.role}.` });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('Server error during login:', err.message);
        res.status(500).send('Server error');
    }
};
