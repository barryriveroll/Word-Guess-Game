var maxGuesses = 10;
var currentGuesses = 10;
var lettersGuessed = [];
var maxLives = 3;
var currentLives;
var kills = 0;
var zombiePosition = 0;

var guessesCountText = $("#guesses-count");
var guessedLettersText = $("#guessed-letters");
var wordSpots = $("#word-spots");
var killsText = $("#kills-text");
var livesText = $("#lives-text");
var zombieSprite = $("#zombie-sprite");
var heroSprite = $("#hero-sprite");
var bloodSprite = $("#blood-sprite");

var word = {
    currentWord:    "",
    currentLetters: "",
    wordBank:       ["shotgun", "zombie", "survival", "horror", 
                     "food", "brains", "shoot", "frankenstein", "shamble",
                     "undead", "corpse", "macabre", "groaning", "graveyard"],
    drawSpots: function () {
        var newBlanks = "";
        for (var i = 0; i < this.currentLetters.length; i++) {
            newBlanks = newBlanks + this.currentLetters[i] + "   ";
        }
        wordSpots.text(newBlanks);
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
            this.currentLetters = this.currentLetters + "_";
        }
        currentGuesses = maxGuesses;
        lettersGuessed = [];
        killsText.text("");
        livesText.text("");
        for (var i = 0; i < currentLives; i++) {
            livesText.text(livesText.text() + "❤️");
        }
        for (var i = 0; i < kills; i++) {
            killsText.text(killsText.text() + "💀");
        }
        zombiePosition = 0;
        zombieSprite.css("right", zombiePosition + "%");
        bloodSprite.css("right", zombiePosition + "%");

        this.drawSpots();
        updateGameText();
        console.log(this.currentWord);
    }
};

function newGame () {
    kills = 0;
    killsText.text(0);
    currentLives = maxLives;
    livesText.text(currentLives);
    word.initializeNewWord();
}

function updateGameText () {
    guessesCountText.text(currentGuesses);
    var newLettersText = "";
    for (var i = 0; i < lettersGuessed.length; i++) {
        newLettersText = newLettersText + lettersGuessed[i] + " ";
    }
    guessedLettersText.text(newLettersText);
}

function guessWrong () {
    lettersGuessed.push(userInput);
    zombiePosition = zombiePosition + (300 / maxGuesses);
    heroSprite.attr("src","assets/images/heroShoot.gif");
    zombieSprite.attr("src","assets/images/zombieWalk.gif");
    zombieSprite.animate({ right: "+=30%" }, "slow");
    bloodSprite.animate({ right: "+=30%" }, "slow");
    currentGuesses--;
}

function guessRight () {
    word.fillCorrectLetters(userInput);
    heroSprite.attr("src","assets/images/heroShoot.gif");
    bloodSprite.attr("src","assets/images/bloodSplash.gif");
}

$(document).ready(function() {
    $("body").keyup(function(event)  {
        // Check if key pressed is a-z
        if (event.which < 91 && event.which > 64) {
            // Convert event.which to string from character code
            var userInput = String.fromCharCode(event.which).toLowerCase();

            // Check if letter pressed is NOT already guessed
            if (!lettersGuessed.includes(userInput) &&
            !word.currentLetters.includes(userInput) &&
            currentGuesses > 0) {
                if (word.currentWord.includes(userInput)) {
                    guessRight();
                } else {
                    guessWrong();
                }
            }
            updateGameText();
            if (currentGuesses === 0) {
                currentLives--;
                for (var i = 0; i < currentLives; i++)

                if (currentLives === 0) {
                    newGame();
                } else {
                    word.initializeNewWord();
                }
            }
        }
    });
    newGame();
});