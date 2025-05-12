// chatController.js
const messagesModel = require('../models/messageModel');
const db = require('../config/db');

// Helper function to get member details
async function getUserDetails(memberId) {
    const query = 'SELECT id, name FROM members WHERE id = ?'; // Assuming your members table has 'id' and 'name' columns
    const [rows] = await db.execute(query, [memberId]);
    return rows[0];
}

// ... (rest of your chatController.js code)

// Function to get the last message of a chat
async function getLastMessage(chatId) {
    const query = 'SELECT content, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp DESC LIMIT 1';
    const [rows] = await db.execute(query, [chatId]);
    return rows[0];
}

const chatController = {
    // Get the chats for a user
    async getChats(req, res) {
        const userId = req.params.userId;

        try {
            // 1. Find all conversations where the user is a participant.
            const query = `
        SELECT c.id AS chat_id, c.participants
        FROM conversations c
        WHERE ? IN (SELECT value FROM JSON_TABLE(c.participants, '$[*]' COLUMNS (value VARCHAR(255) PATH '$')))
      `;
            const [conversations] = await db.execute(query, [userId]);

            // 2. For each conversation, get the other participant's info and last message.
            const chats = await Promise.all(
                conversations.map(async (conversation) => {
                    // Get the other participant
                    const otherUserId = conversation.participants.find(
                        (p) => p !== userId
                    ); //simplified for 1-on-1 chat
                    const otherUser = await getUserDetails(otherUserId);

                    // Get the last message
                    const lastMessage = await getLastMessage(conversation.chat_id);

                    return {
                        chat_id: conversation.chat_id,
                        otherUser,
                        lastMessage,
                    };
                })
            );
            res.status(200).json({ success: true, chats });
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch chats' });
        }
    },

    // Get messages for a chat
    async getMessages(req, res) {
        const chatId = req.params.chatId;
        try {
            const messages = await messagesModel.getMessages(chatId);
            res.status(200).json({ success: true, messages });
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch messages' });
        }
    },

    // Send a message
    async sendMessage(req, res) {
        const { chatId, senderId, content } = req.body;
        try {
            const messageId = await messagesModel.createMessage(chatId, senderId, content);

            // TODO: Emit the message via Socket.IO (we'll cover this later)
            // req.io.to(chatId).emit('newMessage', { chatId, senderId, content, messageId });

            res.status(201).json({ success: true, message: 'Message sent', messageId });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, message: 'Failed to send message' });
        }
    },

    // Start a new chat (or get existing chat)
    async startChat(req, res) {
        const { userId1, userId2 } = req.body;

        try {
            // 1. Check if a chat already exists between these two users
            const checkQuery = `
        SELECT id AS chat_id, participants
        FROM conversations
        WHERE ? IN (SELECT value FROM JSON_TABLE(participants, '$[*]' COLUMNS (value VARCHAR(255) PATH '$')))
        AND ? IN (SELECT value FROM JSON_TABLE(participants, '$[*]' COLUMNS (value VARCHAR(255) PATH '$')))
      `;
            const [existingChats] = await db.execute(checkQuery, [userId1, userId2]);

            if (existingChats.length > 0) {
                // Chat exists, return its ID
                const existingChat = existingChats[0];
                res.status(200).json({
                    success: true,
                    message: 'Chat already exists',
                    chatId: existingChat.chat_id,
                });
                return;
            }

            // 2. Chat doesn't exist, create a new one
            const participants = [userId1, userId2];
            const insertQuery = 'INSERT INTO conversations (participants, created_at, updated_at) VALUES (?, NOW(), NOW())';
            const [result] = await db.execute(insertQuery, [JSON.stringify(participants)]);
            const newChatId = result.insertId;

            res.status(201).json({
                success: true,
                message: 'New chat created',
                chatId: newChatId,
            });
        } catch (error) {
            console.error('Error starting chat:', error);
            res.status(500).json({ success: false, message: 'Failed to start chat' });
        }
    },
};

module.exports = chatController;