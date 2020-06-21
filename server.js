const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

let roomId;
let rooms = {};
let players = roomId ? rooms[roomId] : [];
let name;

io.on('connection', function(socket) {
  socket.on('join', (username, room) => {
    if (!rooms[room] || rooms[room].length < 2) {
      roomId = room || socket.id;
      socket.join(roomId);
      socket.emit('setRoom', roomId);
      name = username;
      players = [...players, username];
      rooms[roomId] = players;
      io.to(roomId).emit('updatePlayers', players);
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('challenge', data => {
    io.to(roomId).emit('challenge', data);
  });

  socket.on('makeGuess', guess => {
    io.to(roomId).emit('guessMade', guess);
  });

  socket.on('message', (message, name) => {
    socket.broadcast.to(roomId).emit('message', message, name);
  });

  socket.on('newGame', () => {
    socket.broadcast.to(roomId).emit('newGame');
  })
});