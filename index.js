var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function () {
  console.log('Listening on port 4000');
});

app.use(express.static('public'));

var io = socket(server);

let roomId;
let rooms = {};
let players = roomId ? rooms[roomId] : [];
let name;

io.on('connection', function(socket) {
  socket.on('join', (username, room) => {
    if (players.length < 2) {
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
});