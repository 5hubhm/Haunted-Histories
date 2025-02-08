import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';  // You need bcrypt to compare passwords
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SECRET_KEY = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] // Check if email or username exists
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});


// Login Route (using sessions)
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { username: identifier }] // Match email or username
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
        }

        // Create a session
        req.session.user = { id: user._id, username: user.username, email: user.email };

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login', error });
    }
});


// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Check if user is logged in
router.get('/check-session', (req, res) => {
    console.log("Session Data:", req.session); // Debugging

    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(401).json({ loggedIn: false, message: 'Session expired' });
    }
});


export default router;
