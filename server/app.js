import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());
app.use(cookieParser());

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
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
