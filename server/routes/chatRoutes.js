const express = require("express");
const router = express.Router();
const {
  getUserChats,
  getMessages,
  startChat,
  sendMessage,
  markMessagesAsRead,
} = require("../controllers/chatController");

// Get all chats of a user
router.get("/:userid", getUserChats);

// Start or Get Chat
router.post("/start", startChat);

// Get messages between users
router.get("/:chatId/messages", getMessages);

// Send message
router.post("/send", sendMessage);

// Mark messages as read
router.post("/mark-read", markMessagesAsRead);

module.exports = router;
