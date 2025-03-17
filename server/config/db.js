const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");



// ✅ Load .env file
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// ✅ Use createPool() instead of createConnection()
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ MySQL Connection Pool Created!");

module.exports = db;
