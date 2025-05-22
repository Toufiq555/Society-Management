const db = require("../config/db"); // mysql connection


const createChat = (user1Id, user2Id) => {
  return db.execute('INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)', [user1Id, user2Id]);
};

const getChatByUsers = (user1Id, user2Id) => {
  return db.execute('SELECT * FROM chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)', [user1Id, user2Id, user2Id, user1Id]);
};

module.exports = {
  createChat,
  getChatByUsers,
};
