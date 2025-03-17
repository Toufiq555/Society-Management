const admin = require("firebase-admin");
const dotenv = require("dotenv");
const serviceAccount = require("./serviceAccountKey.json"); // 🔹 Your Firebase Private Key

dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
