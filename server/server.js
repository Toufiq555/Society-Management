// Entry point for server-side code
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
<<<<<<< HEAD
const db = require("./config/db"); // ✅ MySQL Connection Import
=======
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
>>>>>>> ab10bc8f0d28728a775a448dc8f7b52ed3d6bb91

// dotenv configuration
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Parse JSON request body
app.use(morgan("dev")); // Logging middleware

// Routes
<<<<<<< HEAD
app.use("/api/v1/members", require("./routes/members.js")); // ✅ MySQL Routes

// Define PORT
=======
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/chat", chatRoutes);

// Server Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store online users
let onlineUsers = new Map();

// Socket.io Setup
io.on("connection", (socket) => {
  console.log("New User Connected:", socket.id);

  // User joins with userId
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  });

  // Listen for new messages
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    const newMessage = new Message({
      sender,
      receiver,
      message,
    });
    await newMessage.save();

    // Send message to receiver if online
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("newMessage", newMessage);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
    console.log("User Disconnected:", socket.id);
  });
});

//PORT
>>>>>>> ab10bc8f0d28728a775a448dc8f7b52ed3d6bb91
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server Running on PORT ${PORT}`.bgGreen.white);
});
