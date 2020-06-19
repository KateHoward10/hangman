var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function () {
  console.log('Listening on port 4000');
});

app.use(express.static('public'));

var io = socket(server);

let roomId;

io.on('connection', function(socket) {
  socket.on('join', room => {
    roomId = room || socket.id;
    socket.join(roomId);
    socket.emit('setRoom', roomId);
  });

  socket.on('challenge', data => {
    io.to(roomId).emit('challenge', data);
  })
});