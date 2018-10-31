var maxGuesses = 10;
var currentGuesses = 10;
var lettersGuessed = [];
var maxLives = 3;
var currentLives;
var kills = 0;

var guessesCountText = document.getElementById("guesses-count");
var guessedLettersText = document.getElementById("guessed-letters");
var wordSpots = document.getElementById("word-spots");
var killsText = document.getElementById("kills-text");
var livesText = document.getElementById("lives-text");

var word = {
    currentWord: "zombie",
    currentLetters: "______",
    wordBank: ["shotgun", "zombie", "survival", "safe-zone", 
                "food", "brains", "shoot"],
    drawSpots: function () {
        var newBlanks = "";
        for (var i = 0; i < this.currentLetters.length; i++) {
            newBlanks = newBlanks + this.currentLetters[i] + " ";
        }
        wordSpots.textContent = newBlanks;
    },
    fillCorrectLetters: function (letter) {
        var newWordSpots = "";
        for (var i = 0; i < this.currentWord.length; i++) {
            if (letter === this.currentWord[i]) {
                newWordSpots = newWordSpots + letter;
            } else {
                newWordSpots = newWordSpots + this.currentLetters[i];
            }
        }
        this.currentLetters = newWordSpots;
        this.drawSpots();

        if (this.currentLetters === this.currentWord) {
            kills++;
            this.initializeNewWord();
        }
    },
    initializeNewWord () {
        this.currentWord = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
        this.currentLetters = "";
        for (var i = 0; i < this.currentWord.length; i++) {
            if (this.currentWord[i] === "-") {
                this.currentLetters = this.currentLetters + "-";
            } else {
                this.currentLetters = this.currentLetters + "_";
            }
        }
        currentGuesses = maxGuesses;
        lettersGuessed = [];
        killsText.textContent = kills;
        livesText.textContent = currentLives;

        this.drawSpots();
        updateGameText();
        console.log(this.currentWord);
    }
};

function newGame () {
    kills = 0;
    killsText.textContent = 0;
    currentLives = maxLives;
    livesText.textContent = currentLives;
    console.log(currentLives);
    word.initializeNewWord();
}

function updateGameText () {
    guessesCountText.textContent = currentGuesses;
    var newLettersText = "";
    for (var i = 0; i < lettersGuessed.length; i++) {
        newLettersText = newLettersText + lettersGuessed[i] + " ";
    }
    guessedLettersText.textContent = newLettersText;
}

document.onkeyup = function(event) {
    var userInput = event.key;

    if ("abcdefghijklmnopqrstuvwxyz".includes(userInput.toLowerCase()) && 
    !lettersGuessed.includes(userInput) &&
    currentGuesses > 0) {
        if (word.currentWord.includes(userInput)) {
            word.fillCorrectLetters(userInput);
        } else {
            lettersGuessed.push(userInput);
            currentGuesses--;
        }
    }
    updateGameText();
    if (currentGuesses === 0) {
        currentLives--;

        if (currentLives === 0) {
            newGame();
        } else {
            word.initializeNewWord();
        }
    }
}

newGame();