<<<<<<< HEAD
// const { DataTypes } = require("sequelize"); // ✅ Correct import
// const sequelize = require("../config/db"); // ✅ Use the correct DB instance

// const User = sequelize.define("members", {
//   phone: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//   },
// });

// module.exports = User;
=======
const db = require('../config/db');

const getUserById = (userId) => {
  return db.execute('SELECT * FROM members WHERE id = ?', [userId]);
};

module.exports = {
  getUserById,
};
>>>>>>> dev
