var socket = io.connect('http://localhost:4000');

const hangman = new Vue({
  el: '#hangman',
  data: {
    username: null,
    newRoomId: '',
    newChallenge: '',
    roomId: '',
    players: [],
    currentChallenge: '',
    lives: 10,
    guesses: [],
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
    socket.on('setRoom', id => {
      this.roomId = id;
    });

    socket.on('updatePlayers', newPlayers => {
      this.players = newPlayers;
    });

    socket.on('roomFull', () => {
      alert("Sorry, this room is full. Please enter a different room ID.");
    })
    
    socket.on('challenge', challenge => {
      this.currentChallenge = challenge;
    });
  },
  methods: {
    createRoom: function() {
      if (this.username) {
        socket.emit('join', this.username);
      }
    },
    joinRoom: function() {
      if (this.username) {
        socket.emit('join', this.username, this.newRoomId);
      }
    },
    submitChallenge: function() {
      socket.emit('challenge', this.newChallenge.toUpperCase());
    },
    guessLetter: function(guess) {
      this.guesses.push(guess);
      if (this.currentChallenge.indexOf(guess) === -1) this.lives--;
    }
  }
});