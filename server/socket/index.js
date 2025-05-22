const { Server } = require('socket.io');
const socketHandler = require('./socketHandler');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socketHandler(socket, io); // Pass the io instance here
  });

  console.log('Socket.IO server initialized');
}

module.exports = {
  initializeSocket,
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized!');
    }
    return io;
  }
};