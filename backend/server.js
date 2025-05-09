// File: server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const rooms = {}; // In-memory room store

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('createRoom', ({ name }, callback) => {
    const roomCode = nanoid(6);
    rooms[roomCode] = {
      users: [name],
      votes: { optionA: 0, optionB: 0 }
    };
    socket.join(roomCode);
    callback({ code: roomCode });
  });

  socket.on('joinRoom', ({ name, roomCode }, callback) => {
    if (rooms[roomCode]) {
      rooms[roomCode].users.push(name);
      socket.join(roomCode);
      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on('joinPoll', (roomCode) => {
    if (rooms[roomCode]) {
      io.to(roomCode).emit('voteUpdate', rooms[roomCode].votes);
    }
  });

  socket.on('vote', ({ roomCode, option }) => {
    if (!rooms[roomCode]) return;
    if (option === 'optionA') rooms[roomCode].votes.optionA += 1;
    else if (option === 'optionB') rooms[roomCode].votes.optionB += 1;

    io.to(roomCode).emit('voteUpdate', rooms[roomCode].votes);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
