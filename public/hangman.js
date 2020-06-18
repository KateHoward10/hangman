var socket = io.connect('http://localhost:4000');

socket.on('createRoom', room => {
  window.location.search = room;
})

socket.on('connect', () => {
  const room = window.location.search.replace('/?', '');
  socket.emit('join', room);
});

const hangman = new Vue({
  el: '#hangman',
  data: {
    isChallenging: false,
    currentChallenge: '',
    lives: 10,
    guesses: [],
    alphabet: Array.from(Array(26).keys(), i => String.fromCharCode(i + 65))
  },
  computed: {
    formattedChallenge: function() {
      return this.currentChallenge.split('').map((char, i) => {
        if (char === ' ') {
          return ' ';
        } else if (this.guesses.some(guess => this.currentChallenge[i] === guess)) {
          return char;
        } else return '?';
      }).join('');
    },
    livesTally: function() {
      return Array(this.lives).fill('|').join('');
    }
  },
  created() {
    socket.on('challenge', challenge => {
      this.currentChallenge = challenge;
    });
  },
  methods: {
    submitChallenge: function(e) {
      e.preventDefault();
      const challengeInput = document.getElementById('challenge');
      socket.emit('challenge', challengeInput.value.toUpperCase());
      challengeInput.value = '';
    },
    guessLetter: function(guess) {
      this.guesses.push(guess);
      if (this.currentChallenge.indexOf(guess) === -1) this.lives--;
    }
  }
});