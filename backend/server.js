const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/error");

// Import routes
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");

const app = express();

// Trust proxy for Vercel/proxies (fixes rate limiter issues)
app.set("trust proxy", 1);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(hpp());

// CORS - deduplicated allowed origins
const allowedOrigins = [
  ...new Set(
    [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean)
  ),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some((allowed) => origin.startsWith(allowed)) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

// Logging - only in development and when running as persistent server
if (process.env.NODE_ENV === "development" && require.main === module) {
  try {
    const morgan = require("morgan");
    app.use(morgan("dev"));
  } catch {
    // morgan is optional
  }
}

// Compression for responses
app.use(compression());

// Body parser with sensible limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Favicon noise reduction
app.get(["/favicon.ico", "/favicon.png"], (req, res) => res.status(204).end());

// Ensure DB connection before API routes (serverless-friendly middleware)
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB middleware connection error:", err.message);
    return res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable. Please try again in a moment.",
    });
  }
});

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

// Health check (placed before DB middleware via separate route)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DoubtRoom API is healthy",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "production",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DoubtRoom API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      rooms: "/api/rooms",
      questions: "/api/questions",
      answers: "/api/answers",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

// Export for Vercel serverless
module.exports = app;

// Start server with Socket.IO ONLY when running locally (not on Vercel)
if (require.main === module) {
  const http = require("http");
  const { Server } = require("socket.io");
  const socketHandler = require("./socket/socketHandler");

  // Connect DB eagerly when running as a server (non-blocking)
  connectDB()
    .then(() => console.log("✅ Database ready"))
    .catch((err) => console.error("⚠️ Database not ready (will retry per-request):", err.message));

  const server = http.createServer(app);

  // Setup Socket.IO (only works with a persistent server, NOT serverless)
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  socketHandler(io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log(`🚀 DoubtRoom Server Running`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`⚡ Socket.IO: Ready`);
    console.log(`🔗 CORS: ${allowedOrigins.join(", ") || "*"}`);
    console.log("=".repeat(50));
  });
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
