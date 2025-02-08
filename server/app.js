// app.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js'; // Importing storiesRoutes
import session from 'express-session';
import cookieParser from 'cookie-parser';


// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors({
  credentials: true  // Allows cookies to be sent
}));


app.use(express.json());
app.use(cookieParser());

// Session middleware should be used before API routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,  // Prevents unnecessary session updates
  saveUninitialized: true,  // Only saves sessions when user logs in
  cookie: {
    httpOnly: true,
    secure: false,  // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24-hour session duration
  }
}));



// Authentication check middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Please log in to access this resource' });
  }
  next(); // Proceed to the next middleware or route handler if the user is authenticated
};

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

// API routes

app.use('/api/stories', isAuthenticated, storiesRoutes);  // Protecting stories routes with session middleware
app.use('/api/auth', authRoutes);                         // Authentication API routes

// Static page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html')); // Homepage
});


// 404 Route for undefined paths
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
