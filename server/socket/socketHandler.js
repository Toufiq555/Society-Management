// D:\VS Code\App\server\socket\socketHandler.js

const { saveMessage } = require('../models/messageModel');

module.exports = (socket, io) => { // Receive the io instance here
  console.log(`⚡️ User connected: ${socket.id}`);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`👤 Socket ${socket.id} joined chat: ${chatId}`);
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    console.log(`🚶 Socket ${socket.id} left chat: ${chatId}`);
  });

  socket.on('sendMessage', async (data) => {
    console.log('📤 Received sendMessage event:', data);
    const { sender, receiver, message, chatId } = data;

    try {
      const savedMessage = await saveMessage(sender, receiver, message, chatId);
      io.to(chatId).emit('newMessage', savedMessage); // Use the passed io instance
      console.log('✅ Message sent and saved:', savedMessage);
    } catch (error) {
      console.error('❌ Error saving/sending message:', error);
      socket.emit('messageFailed', { error: 'Failed to send message.' }); // Optionally inform the sender
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔥 User disconnected: ${socket.id}`);
    // You might want to handle leaving rooms or updating user status here
  });

  socket.on('typing', (chatId, user) => {
    socket.to(chatId).emit('userTyping', user);
  });

  socket.on('stopTyping', (chatId, user) => {
    socket.to(chatId).emit('userStoppedTyping', user);
  });

  // Example: Handling read receipts
  socket.on('messageRead', (chatId, messageId, userId) => {
    socket.to(chatId).emit('messageReadConfirmation', messageId, userId);
  });

  // Example: Handling user online status
  socket.on('userOnline', (userId) => {
    console.log(`🟢 User ${userId} is online (socket: ${socket.id})`);
    io.emit('userStatus', userId, 'online');
  });

  socket.on('userOffline', (userId) => {
    console.log(`🔴 User ${userId} is offline (socket: ${socket.id})`);
    io.emit('userStatus', userId, 'offline');
  });

  // You can add more event handlers here for other functionalities
  // like image uploads, video calls (signaling), etc.
};