    const express = require('express');
    const router = express.Router();
    const chatController = require('../controllers/chatController');

    // Get all chats for a specific user
    router.get('/chats/:userId', chatController.getChats);

    // Get messages for a specific chat
    router.get('/messages/:chatId', chatController.getMessages);

    // Start a new chat between two users
    router.post('/chats', chatController.startChat); // Corrected route

    module.exports = router;
    