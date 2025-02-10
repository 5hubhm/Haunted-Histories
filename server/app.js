import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  credentials: true,
  origin: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Change this in production
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: true,  // Set to `true` in production with HTTPS
      httpOnly: true, // Prevents XSS attacks
      maxAge: 1000 * 60 * 60 * 24 // 1-day session duration
  }
}));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  next();
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', isAuthenticated, storiesRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send("🚀 Haunted Histories API is Running!");
});

// Export for Vercel (Important)
export default app;
