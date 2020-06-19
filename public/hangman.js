var socket = io.connect('http://localhost:4000');

const hangman = new Vue({
  el: '#hangman',
  data: {
    newRoomId: '',
    newChallenge: '',
    roomId: '',
    playerIndex: -1,
    currentChallenge: '',
    lives: 10,
    guesses: [],
    alphabet: Array.from(Array(26).keys(), i => String.fromCharCode(i + 65))
  },
  computed: {
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
    
    socket.on('challenge', challenge => {
      this.currentChallenge = challenge;
    });
  },
  methods: {
    createRoom: function() {
      socket.emit('join');
      this.playerIndex = 0;
    },
    joinRoom: function() {
      socket.emit('join', this.newRoomId);
      this.playerIndex = 1;
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