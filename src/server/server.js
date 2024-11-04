require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require('socket.io');
const userRoutes = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const transactionRoute = require("./routes/transactionRoute");
const supplierRoute = require("./routes/supplierRoute");
const authRoute = require("./routes/authRoute");

const app = express();

// Cors configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoute);
app.use("/api", transactionRoute);
app.use("/api", supplierRoute);
app.use("/api", authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});
