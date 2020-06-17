var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function () {
  console.log('Listening on port 4000');
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket) {
  socket.on('challenge', data => {
    io.emit('challenge', data);
  })
});