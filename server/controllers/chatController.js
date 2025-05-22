const { getMessages, saveMessage } = require('../models/messageModel');
const db = require('../config/db'); // Import your MySQL connection

const chatController = {
  // Get all chats for a specific user
  getChats: async (req, res) => {
    const { userId } = req.params;
    try {
      // A SQL query to retrieve chats for a user.
      const query = `
        SELECT c.id, c.user1_id, c.user2_id,
               u1.name AS user1_name, u2.name AS user2_name,
               m.message AS last_message,
               m.timestamp AS last_message_timestamp
        FROM chats c
        JOIN member u1 ON c.user1_id = u1.id
        JOIN member u2 ON c.user2_id = u2.id
        LEFT JOIN messages m ON c.id = m.chat_id -- Get last message
        WHERE c.user1_id = ? OR c.user2_id = ?
        ORDER BY m.timestamp DESC;
      `;

      const [rows] = await db.execute(query, [userId, userId]);
      res.status(200).json({ success: true, chats: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get messages for a specific chat
  getMessages: async (req, res) => {
    const { chatId } = req.params;
    try {
      const messages = await getMessages(chatId);
      res.status(200).json({ success: true, messages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Send a new message (via API - not used with Socket.IO in this simplified version)
  sendMessage: async (req, res) => {
    const { chatId } = req.params;
    const { sender, receiver, message } = req.body;
    const timestamp = new Date();

    try {
      await saveMessage(sender, receiver, message, timestamp, chatId); // Include chatId
      res.status(201).json({ success: true, message: 'Message sent and saved', data: { sender, receiver, message, timestamp, chatId } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

 startChat: async (req, res) => {
  const { userId1, userId2 } = req.body;
  const stringUserId1 = String(userId1);
  const stringUserId2 = String(userId2);

  const sortedUserIds = [stringUserId1, stringUserId2].sort();
  const potentialChatId = `chat_${sortedUserIds[0]}_${sortedUserIds[1]}`;

  try {
    const [existingChat] = await db.execute(
      'SELECT id FROM chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [stringUserId1, stringUserId2, stringUserId2, stringUserId1]
    );

    if (existingChat.length > 0) {
      return res.status(200).json({ success: true, chatId: existingChat[0].id, message: 'Chat already exists' });
    }

    const chatId = potentialChatId; // Use the generated ID as it's new
    const query = `INSERT INTO chats (id, user1_id, user2_id) VALUES (?, ?, ?)`;
    await db.execute(query, [chatId, stringUserId1, stringUserId2]);
    res.status(200).json({ success: true, chatId });
  } catch (error) {
    console.error('Error starting chat:', error);
    res.status(500).json({ success: false, message: error.message });
  }
},

};
module.exports = chatController;