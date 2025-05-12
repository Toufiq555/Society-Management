const db = require('../config/db');

const getUserById = (userId) => {
  return db.execute('SELECT * FROM members WHERE id = ?', [userId]);
};

module.exports = {
  getUserById,
};
