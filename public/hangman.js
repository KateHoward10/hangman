var socket = io.connect('http://localhost:4000');

const challengeInput = document.getElementById('challenge');
const form = document.getElementById('challenge_form');
const display = document.querySelector('.display-area');

form.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('challenge', challengeInput.value);
  challengeInput.value = '';
});

socket.on('challenge', data => {
  display.textContent = data.replace(/[a-zA-Z]/gi, '?');
});