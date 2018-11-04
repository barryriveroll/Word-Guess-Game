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
var gameOver = $("#game-over");
var endKills = $("#end-kills");
var zombieSpriteNew;
var bloodSpriteNew;
var zombieSpriteOld;


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
            zombieSpriteNew.animate({ opacity: 0}, "fast");
            bloodSpriteNew.animate({ opacity: 0}, "slow");
            
            wordSpots.fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
            
            setTimeout (function() {
                word.initializeNewWord();
            }, 2000);
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
        // zombieSpriteOld = zombieSpriteNew;
        // zombieSpriteOld.remove();
        zombieSpriteNew = zombieSprite.clone().appendTo($("#zombie-div"));
        bloodSpriteNew = bloodSprite.clone().appendTo($("#zombie-div"));
        bloodSpriteNew.attr("src","assets/images/empty.gif");
        zombieSpriteNew.animate({ opacity: 1}, "normal");

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
    gameOver.hide();
}

function updateGameText () {
    guessesCountText.text(currentGuesses);
    var newLettersText = "";
    for (var i = 0; i < lettersGuessed.length; i++) {
        newLettersText = newLettersText + lettersGuessed[i] + " ";
    }
    guessedLettersText.text(newLettersText);
}

function guessWrong (input) {
    lettersGuessed.push(input);
    zombieSpriteNew.attr("src","assets/images/zombieWalk.gif");
    zombieSpriteNew.animate({ right: "+=30%" }, "slow");
    bloodSpriteNew.animate({ right: "+=30%" }, "slow");
    currentGuesses--;

    if (currentGuesses === 0) {
        currentLives--;
        zombieSpriteNew.animate({ opacity: 0}, "fast");
        if (currentLives === 0) {
            gameOver.show();
            endKills.text(kills);
        } else {
            word.initializeNewWord();
        }
    }
}

function guessRight (input) {
    bloodSpriteNew.attr("src","assets/images/bloodSplash.gif");
    word.fillCorrectLetters(input);
}

$(document).ready(function() {
    $("body").keyup(function(event)  {
        if (currentLives !== 0) {
            if (event.which < 91 && event.which > 64) {
                var userInput = String.fromCharCode(event.which).toLowerCase();
                if (!lettersGuessed.includes(userInput) &&
                !word.currentLetters.includes(userInput) &&
                currentGuesses > 0) {
                    heroSprite.attr("src","assets/images/heroShoot.gif");
                    if (word.currentWord.includes(userInput)) {
                        guessRight(userInput);
                    } else {
                        guessWrong(userInput);
                    }
                }
                updateGameText();
            }
        } else {
            if (event.which === 32) {
                newGame();
            }
        }
    });
    newGame();
});