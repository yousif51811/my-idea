const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('pair', () => {
    const partnerSocket = findPartner(socket);
    if (partnerSocket) {
      socket.emit('pairSuccess', { partnerId: partnerSocket.id });
      partnerSocket.emit('pairSuccess', { partnerId: socket.id });
    }
  });

  socket.on('message', ({ message, partnerSocketId }) => {
    const partnerSocket = io.sockets.sockets.get(partnerSocketId);
    if (partnerSocket) {
      partnerSocket.emit('message', { message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

function findPartner(socket) {
  const sockets = [...io.sockets.sockets.values()];
  const availableSockets = sockets.filter(s => s !== socket && !s.partnerSocketId);
  if (availableSockets.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableSockets.length);
    const partnerSocket = availableSockets[randomIndex];
    socket.partnerSocketId = partnerSocket.id;
    partnerSocket.partnerSocketId = socket.id;
    return partnerSocket;
  }
  return null;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
