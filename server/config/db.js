const dotenv = require("dotenv");
const mysql = require("mysql2");


// ✅ Load .env file
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST, // ✅ `localhost` ko as a string use karein
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // ✅ Default MySQL port
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected Successfully!");
  }
});

module.exports = db;
