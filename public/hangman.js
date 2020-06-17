var socket = io.connect('http://localhost:4000');

let currentChallenge = '';
let lives = 10;

const challengeInput = document.getElementById('challenge');
const form = document.getElementById('challenge_form');
const display = document.querySelector('.display-area');
const letters = document.getElementById('letters_container');
const livesContainer = document.getElementById('lives_container');

form.addEventListener('submit', e => {
  e.preventDefault();
  socket.emit('challenge', challengeInput.value.toUpperCase());
  challengeInput.value = '';
});

socket.on('challenge', data => {
  currentChallenge = data;
  display.textContent = data.replace(/[a-zA-Z]/gi, '?');
  livesContainer.textContent = 'Lives: ' + Array(lives).fill('|').join('');
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(i + 65);
    const letterButton = document.createElement('button');
    letterButton.value = letter;
    letterButton.textContent = letter;
    letterButton.classList.add('letter-button');
    letterButton.addEventListener('click', e => {
      const guess = e.target.value;
      if (currentChallenge.indexOf(guess) > -1) {
        display.textContent = display.textContent.split('').map((char, i) => currentChallenge[i] === guess ? guess : char).join('');
      } else {
        lives--;
        livesContainer.textContent = 'Lives: ' + Array(lives).fill('|').join('');
      };
    })
    letters.appendChild(letterButton);
  }
});