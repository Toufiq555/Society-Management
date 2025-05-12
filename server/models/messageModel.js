const db = require('../config/db'); // Import your MySQL connection

const saveMessage = async (sender, receiver, message, timestamp) => {
  // Ensure values are not undefined
  sender = sender !== undefined ? sender : null;
  receiver = receiver !== undefined ? receiver : null;
  message = message !== undefined ? message : null;
  timestamp = timestamp !== undefined ? timestamp : null;

  const query = 'INSERT INTO messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, ?)';
  await db.query(query, [sender, receiver, message, timestamp]);
};


const getMessages = async (chatId) => {
  const query = `
    SELECT id, sender, receiver, message, chat_id, timestamp
    FROM messages
    WHERE chat_id = ?
    ORDER BY timestamp ASC
  `;
  try {
    const [rows] = await db.execute(query, [chatId]);
    return rows;
  } catch (error) {
    throw new Error("Error fetching messages: " + error.message);
  }
};

module.exports = { saveMessage, getMessages };
