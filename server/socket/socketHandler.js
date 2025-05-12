const { saveMessage } = require("../models/messageModel");

let onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ New user connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log("👤 Socket", socket.id, "joined chat:", chatId);
    });

    socket.on("sendMessage", async ({ sender, receiver, message }) => {
      console.log("📤 Received sendMessage event:", { sender, receiver, message });
      try {
        const savedMessage = await saveMessage({ sender, receiver, message });
        console.log("💾 Message saved to database:", savedMessage);

        // Logic to find receiver socket ID (adjust if needed based on your room structure)
        const receiverSocketId = Array.from(io.sockets.adapter.rooms.get(receiver) || []).find(id => id !== socket.id);
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);

        console.log("👤 Receiver ID:", receiver, "Socket ID:", receiverSocketId);
        if (receiverSocket) {
          io.to(receiverSocketId).emit("newMessage", savedMessage);
          console.log("✉️ Emitted newMessage to:", receiverSocketId, "with data:", savedMessage);
        } else {
          console.log("⚠️ Receiver is not in this chat room or offline.");
          // Optionally handle offline messages
        }
      } catch (err) {
        console.error("❌ Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log("❌ User disconnected:", userId, "Socket ID:", socket.id);
          break;
        }
      }
    });
  });
};

module.exports = socketHandler;