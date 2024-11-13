require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require('socket.io');

// Import routes dengan nama yang lebih konsisten
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const transactionRoutes = require("./routes/transactionRoute");
const supplierRoutes = require("./routes/supplierRoute");
const authRoutes = require("./routes/authRoute");
const roleRoutes = require("./routes/roleRoute");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://192.168.1.20:5173", // Tambahkan IP address Anda
].filter(Boolean); // Filter out undefined values

// Cors configuration dengan opsi yang lebih lengkap
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Origin blocked:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "x-requested-with",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Credentials"
    ],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200
  })
);

// Middleware untuk parsing JSON dan menangani payload besar
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API version prefix
const API_PREFIX = '/api';

// Routes dengan pengelompokan yang lebih terstruktur
app.use(`${API_PREFIX}/auth`, authRoutes);         // /api/auth/*
app.use(`${API_PREFIX}/users`, userRoutes);        // /api/users/*
app.use(`${API_PREFIX}/products`, productRoutes);   // /api/products/*
app.use(`${API_PREFIX}/transactions`, transactionRoutes); // /api/transactions/*
app.use(`${API_PREFIX}/suppliers`, supplierRoutes); // /api/suppliers/*
app.use(`${API_PREFIX}/roles`, roleRoutes);        // /api/roles/*

// Middleware untuk logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} [${new Date().toISOString()}]`);
  next();
});

// Error handling middleware dengan lebih banyak detail
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });

  // Menentukan status code berdasarkan jenis error
  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? {
      stack: err.stack,
      ...err
    } : {
      message: "Something went wrong"
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler yang lebih informatif
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Server setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Socket.IO setup (jika diperlukan)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: [
      "Content-Type", 
      "Authorization"
    ]
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle process termination
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  gracefulShutdown();
});

module.exports = { app, server, io }; // Export for testing purposes