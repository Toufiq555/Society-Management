// D:\VS Code\App\server\models\messageModel.js

const db = require('../config/db');

const messageModel = {
  getMessages: async (chatId) => {
    // ... your getMessages logic
  },

  saveMessage: async (sender_id, receiver_id, content, timestamp, chatId) => { // Expecting chatId as a parameter
    console.log('saveMessage called with chatId:', chatId); // Add this for debugging
    if (!chatId) {
      throw new Error('Error saving message: chatId is not defined');
    }
    const query = `
      INSERT INTO messages (chat_id, sender_id, receiver_id, message, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [chatId, sender_id, receiver_id, content, timestamp]);
      const [rows] = await db.execute('SELECT * FROM messages WHERE id = ?', [result.insertId]);
      return rows[0];
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },
};

module.exports = messageModel;