// app.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// 🔹 CORS Middleware (Allows Frontend Access)
app.use(cors({
  credentials: true,  // Allow cookies & sessions
  origin: process.env.FRONTEND_URL || 'https://haunted-historiess-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']  // Allow frontend to receive cookies
}));


// Middleware
app.use(express.json());
app.use(cookieParser());

// 🔹 Session Middleware (Secure & Optimized)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,  // Don't save empty sessions
  cookie: {
    httpOnly: true,  // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production',  // Enforce HTTPS in production
    sameSite: 'lax',  // Helps prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000  // 24-hour session duration
  }
}));

// 🔹 Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  next();
};

// 🔹 MongoDB Connection (Handles Errors Properly)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || 'https://haunted-historiess-frontend.vercel.app');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
  
// 🔹 API Routes
app.use('/api/auth', authRoutes); // Authentication routes remain open
app.use('/api/stories', isAuthenticated, storiesRoutes); // Protected Stories Routes

// 🔹 Example of an Additional Protected Route
app.use('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: '✅ You have access to this protected route!' });
});

// 🔹 Serve Static Frontend Files (If Hosting Frontend Here)
app.use(express.static(path.join(__dirname, '../frontend')));

// 🔹 Serve Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 🔹 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: '❌ Internal Server Error' });
});

// 🔹 Handle Unexpected Errors
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
