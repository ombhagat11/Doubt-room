const path = require('path');
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const hpp = require('hpp');
const xss = require('xss-clean');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');

// Import socket handler
const socketHandler = require('./socket/socketHandler');

// Connect to database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Support CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Optimization
app.use(compression()); // Compress all responses

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Status route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DoubtRoom API is healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DoubtRoom API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      rooms: '/api/rooms',
      questions: '/api/questions',
      answers: '/api/answers'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// 404 handler
app.use((req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Advanced Error handling middleware
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

// Initialize socket handlers
socketHandler(io);

// Export for Vercel
module.exports = app;

// Start server only if not running on Vercel or if explicitly told
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`🚀 DoubtRoom Server Running`);
        console.log(`📍 Port: ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`⚡ Socket.IO: Ready`);
        console.log('='.repeat(50));
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // In production, we might want to shut down gracefully
  // server.close(() => process.exit(1));
});

