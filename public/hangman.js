var socket = io.connect('http://localhost:4000');

const challengeInput = document.getElementById('challenge');
const form = document.getElementById('challenge_form');
const display = document.querySelector('.display-area');
const letters = document.getElementById('letters_container');

form.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('challenge', challengeInput.value);
  challengeInput.value = '';
});

socket.on('challenge', data => {
  display.textContent = data.replace(/[a-zA-Z]/gi, '?');
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(i + 97);
    const letterButton = document.createElement('button');
    letterButton.value = letter;
    letterButton.textContent = letter;
    letters.appendChild(letterButton);
  }
});