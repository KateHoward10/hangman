var socket = io.connect('http://localhost:4000');

const hangman = new Vue({
  el: '#hangman',
  data: {
    username: null,
    roomId: null,
    result: null,
    newChallenge: '',
    players: [],
    guesser: null,
    currentChallenge: '',
    lives: 10,
    guesses: [],
    messages: [],
    alphabet: Array.from(Array(26).keys(), i => String.fromCharCode(i + 65))
  },
  computed: {
    playerIndex: function() {
      return this.players.indexOf(this.username);
    },
    formattedChallenge: function() {
      return this.currentChallenge.split('').map((char, i) => {
        if (char === ' ' || this.guesses.some(guess => this.currentChallenge[i] === guess)) {
          return char;
        } else return '?';
      }).join('');
    },
    livesTally: function() {
      return Array(this.lives).fill('|').join('');
    }
  },
  created() {
    this.roomId = window.location.search.replace('?', '');

    socket.on('setRoom', id => {
      this.roomId = id;
      if (id !== window.location.search.replace('?', '')) {
        window.history.pushState({}, null, '?' + id);
      }
    });

    socket.on('updatePlayers', newPlayers => {
      this.players = newPlayers;
      if (this.players.length === 2) this.guesser = 1;
    });

    socket.on('roomFull', () => {
      alert("Sorry, this room is full.");
    });
    
    socket.on('challenge', challenge => {
      this.currentChallenge = challenge;
      this.messages.push(`${this.players[Number(!this.guesser)]} has sent a challenge!`);
    });

    socket.on('guessMade', guess => {
      this.guesses.push(guess);
      if (this.currentChallenge.indexOf(guess) === -1) this.lives--;
      this.messages.push(`${this.players[this.guesser]} has guessed ${guess}`);
      if (this.lives === 0) {
        this.result = 'loss';
        this.messages.push(`${this.players[this.guesser]} loses!`);
      } else if (this.currentChallenge.replace(' ', '').split('').every(letter => this.guesses.indexOf(letter) > -1)) {
        this.result = 'win';
        this.messages.push(`${this.players[this.guesser]} wins!`);
      }
    })
  },
  methods: {
    joinRoom: function() {
      if (this.username) {
        socket.emit('join', this.username, this.roomId);
      }
    },
    submitChallenge: function() {
      socket.emit('challenge', this.newChallenge.toUpperCase());
    },
    guessLetter: function(guess) {
      socket.emit('makeGuess', guess);
    }
  }
});