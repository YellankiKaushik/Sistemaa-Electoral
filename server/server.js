require('dotenv').config();

// 1. ENV VALIDATION (Security)
const requiredEnv = ["GEMINI_API_KEY"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

if (!process.env.ALLOWED_ORIGINS) {
  console.warn("⚠️ ALLOWED_ORIGINS not set, defaulting to '*'");
}

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate Limiting (Security)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    title: "Too many requests",
    explanation: "You're sending requests too quickly. Please slow down.",
    status: "rate_limited"
  }
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
  methods: ["GET", "POST"]
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static('app'));

// Routes
app.use('/chat', chatRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// ✅ Start Server (UPDATED)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});