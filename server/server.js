// entry point for server side code

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");

//dotenv config
dotenv.config();

//MongoDB connection
connectDB();

// Rest object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
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
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`.bgGreen.white);
});
