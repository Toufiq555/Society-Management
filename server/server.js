// Entry point for server-side code
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const db = require("./config/db"); // ✅ MySQL Connection Import

// dotenv configuration
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Parse JSON request body
app.use(morgan("dev")); // Logging middleware

// Routes
app.use("/api/v1/members", require("./routes/members.js")); // ✅ MySQL Routes

// Define PORT
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server Running on PORT ${PORT}`.bgGreen.white);
});
