//Messages ko store karne ke liye MongoDB model banayein.

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // group chat support
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //Sender's user Id
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //receiver's user Id
  message: { type: String, required: true },
  // messageType: {
  //   tupe: String,
  //   enum: ["text", "image", "video"],
  //   default: "text",
  // }, // message type
  // mediaUrl: { type: String }, // image/video url
  seen: { type: Boolean, default: false }, // Seen Status
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
