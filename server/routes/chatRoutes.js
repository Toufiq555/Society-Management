// ChatsRoutes.js
const express = require('express');
const chatController = require('../controllers/chatController'); // Adjust the path if needed
const router = express.Router();

// Get all chats for a specific user
router.get('/chats/:userId', chatController.getChats);

// Get messages for a specific chat
router.get('/messages/:chatId', chatController.getMessages);

// Send a new message (initially via API)
router.post('/messages/:chatId', chatController.sendMessage);

// Start a new chat between two users
router.post('/chats', chatController.startChat);

module.exports = router;