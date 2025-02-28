const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // members in chat
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, //Last sent message
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
