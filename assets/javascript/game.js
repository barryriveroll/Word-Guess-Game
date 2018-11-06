var game = {
    // Element variables
    currentWord:    "",
    currentLetters: "",
    wordBank:       ["shotgun", "zombie", "survival", "horror", 
                     "food", "brains", "shoot", "frankenstein", "shamble",
                     "undead", "corpse", "macabre", "groaning", "graveyard"],
    maxGuesses:     10,
    currentGuesses: 10,
    lettersGuessed: [],
    maxLives:       3,
    currentLives:   3,
    kills:          0,
    zombiePosition: 0,

    // jQuery element variables
    guessesCountText:   $("#guesses-count"),
    guessedLettersText: $("#guessed-letters"),
    wordSpots:          $("#word-spots"),
    killsText:          $("#kills-text"),
    livesText:          $("#lives-text"),
    zombieSprite:       $("#zombie-sprite"),
    heroSprite:         $("#hero-sprite"),
    bloodSprite:        $("#blood-sprite"),
    gameOver:           $("#game-over"),
    endKills:           $("#end-kills"),
    zombieSpriteNew:    null,
    bloodSpriteNew:     null,

    newGame: function() {
        this.kills = 0;
        this.killsText.text(0);
        this.currentLives = this.maxLives;
        this.livesText.text(this.currentLives);
        this.initializeNewWord();
        this.gameOver.hide();
    },

    updateGameText: function() {
        this.guessesCountText.text(this.currentGuesses);
        var newLettersText = "";
        for (var i = 0; i < this.lettersGuessed.length; i++) {
            newLettersText = newLettersText + this.lettersGuessed[i] + " ";
        }
        this.guessedLettersText.text(newLettersText);
    },

    guessWrong: function(input) {
        this.lettersGuessed.push(input);
        this.zombieSpriteNew.attr("src","assets/images/zombieWalk.gif");
        this.zombieSpriteNew.animate({ right: "+=30%" }, "slow");
        this.bloodSpriteNew.animate({ right: "+=30%" }, "slow");
        this.currentGuesses--;

        if (this.currentGuesses === 0) {
            this.currentLives--;
            this.zombieSpriteNew.animate({ opacity: 0 }, "fast");
            this.bloodSpriteNew.animate({ opacity: 0 }, "slow");
            if (this.currentLives === 0) {
                this.gameOver.show();
                this.endKills.text(this.kills);
                this.livesText.text("");
            } else {
                this.initializeNewWord();
            }
        }
    },

    guessRight: function(input) {
        this.bloodSpriteNew.attr("src","assets/images/bloodSplash.gif");
        this.fillCorrectLetters(input);
    },

    drawSpots: function() {
        var newBlanks = "";
        for (var i = 0; i < this.currentLetters.length; i++) {
            newBlanks = newBlanks + this.currentLetters[i] + " ";
        }
        this.wordSpots.text(newBlanks);
    },

    fillCorrectLetters: function(letter) {
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
            this.kills++;
            this.zombieSpriteNew.animate({ opacity: 0 }, "fast");
            this.bloodSpriteNew.animate({ opacity: 0 }, "slow");
            
            this.wordSpots.fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
            
            setTimeout (function() {
                game.initializeNewWord();
            }, 2000);
        }
    },

    initializeNewWord: function() {
        this.currentWord = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
        this.currentLetters = "";
        for (var i = 0; i < this.currentWord.length; i++) {
            this.currentLetters = this.currentLetters + "_";
        }
        game.currentGuesses = game.maxGuesses;
        game.lettersGuessed = [];
        this.killsText.text("");
        this.livesText.text("");
        for (var i = 0; i < game.currentLives; i++) {
            this.livesText.text(this.livesText.text() + "❤️");
        }
        for (var i = 0; i < game.kills; i++) {
            this.killsText.text(this.killsText.text() + "💀");
        }
        this.zombieSpriteNew = this.zombieSprite.clone().appendTo($("#zombie-div"));
        this.bloodSpriteNew = this.bloodSprite.clone().appendTo($("#zombie-div"));
        this.bloodSpriteNew.attr("src","assets/images/empty.gif");
        this.zombieSpriteNew.animate({ opacity: 1}, "normal");

        this.drawSpots();
        game.updateGameText();
        console.log(this.currentWord);
    }
}

var audio = {
    on: true,
}

$(document).ready(function() {
    $("body").keyup(function(event)  {
        if (game.currentLives !== 0) {
            if (event.which < 91 && event.which > 64) {
                var userInput = String.fromCharCode(event.which).toLowerCase();
                if (!game.lettersGuessed.includes(userInput) &&
                !game.currentLetters.includes(userInput) &&
                game.currentGuesses > 0) {
                    game.heroSprite.attr("src","assets/images/heroShoot.gif");
                    if (game.currentWord.includes(userInput)) {
                        game.guessRight(userInput);
                    } else {
                        game.guessWrong(userInput);
                    }
                }
                game.updateGameText();
            }
        } else {
            if (event.which === 32) {
                game.newGame();
            }
        }
    });

    $('#sound-icon').bind('click', function(){
        audio.on = !audio.on;
        $("#sound-off").toggle();
    });

    $("#sound-off").hide();
    game.newGame();
});