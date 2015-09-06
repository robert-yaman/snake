(function () {

var Game = window.Game = window.Game || {};

var Play = Game.Play = function($el, firstGame) {
  this.$el = $el;
  this.board = new Game.Board(this.$el);
  this.dirQueue = [];
  if (firstGame) this.configureKeys();

  if (document.cookie) {
    this.highScore = parseInt(document.cookie.match(/\d+/)[0]);
  } else {
    this.highScore = 3;
  }
  $("#start-button").click(function () {
    $(".info").css("display", "block");
    $("#start-button").remove();
    this.run();
  }.bind(this));
};

Play.prototype.run = function () {
  this.board.introAnimation();
  Game.play = this;
  game = this;
  this.loop = setInterval(function () {
    game.adjust();
    if (!game.lost) game.render();
  }, 1000 / Game.Config.fps);
};

Play.prototype.adjust = function () {
  this.changeDirs();
  this.board.adjust();
  this.checkForLoss();
  this.adjustCounter();
  this.alreadyChangedDirs = false;
};

Play.prototype.adjustCounter = function () {
  $(".current-score").html(this.board.snake.length());
  $(".high-score").html(
    "Top: " + Math.max(this.board.snake.length(), this.highScore)
  );
};

Play.prototype.blinkOut = function ($block) {
  $block.css("background-color", "green");
  $block.css("transition", "opacity 1s");
  $block.one("transitionend", function() {
    $block.css("background-color", "blue");
    $block.css("transition", "opacity 1.5s");
  });
  $block.css("opacity", "0");
};

Play.prototype.checkForLoss = function () {
  if (this.board.snake.eatingSelf() || this.offBoard(this.board.snake.headPos)) { this.lossSequence(); }
};

Play.prototype.changeDirs = function () {
  if (this.alreadyChangedDirs || this.dirQueue.length === 0) return;
  this.alreadyChangedDirs = true;
  game.board.snake.changeDir(this.dirQueue.shift());
};

Play.prototype.configureKeys = function () {
  game = this;
  key('w', function () { game.queueDirShift(new Game.Coord(0, -1)); } );
  key('a', function () { game.queueDirShift(new Game.Coord(-1, 0)); });
  key('s', function () { game.queueDirShift(new Game.Coord(0, 1)); });
  key('d', function () { game.queueDirShift(new Game.Coord(1, 0)); });
  key('p', function () { game.togglePause(); });
};


Play.prototype.lossSequence = function () {
  //so board won't render again
  this.lost = true;
  this.togglePause();
  document.cookie = "high_score=" +
                        Math.max(this.board.snake.length(), this.highScore);

  $(".game-over").css("opacity", "1").css("top", "-300px");
  setTimeout(function () {
    $(".countdown-block").css("opacity", "1");
  }, 500);

  $(".countdown-blocks").one("transitionend", function() {
    this.blinkOut($(".countdown-blocks .block-3"));

    setTimeout(function () {
      this.blinkOut($(".countdown-blocks .block-1"));
    }.bind(this), 1500);

    setTimeout(function () {
      this.blinkOut($(".countdown-blocks .block-2"));
    }.bind(this), 3000);

    setTimeout(function () {
      this.togglePause();
      this.reset();
      $(".game-over").css("transition", "opacity .5s");
      $(".game-over").css("opacity", "0");
      $(".game-over").one("transitionend", function() {
        $(".game-over").css("top", "-400px").css("transition", "1.5s");
      });
    }.bind(this), 4500);
  }.bind(this));
};

Play.prototype.queueDirShift = function (dir) {
  //implementing queue so that users can make moves in quick succession
  this.dirQueue.push(dir);
  this.changeDirs();
};

Play.prototype.reset = function () {
  //remove everything but the game info
  this.$el.find(".stopper").remove();
  this.$el.find(".square").remove();

  clearInterval(this.loop);
  newGame = new Game.Play(this.$el, false);
  newGame.run();
};

Play.prototype.offBoard = function (coord) {
  return coord.pos[0] < 0 || coord.pos[1] < 0 ||
  coord.pos[0] >= Game.Config.boardWidth ||
  coord.pos[1] >= Game.Config.boardHeight;
};

Play.prototype.render = function () {
  this.board.render(this.$el);
};

Play.prototype.togglePause = function () {
  if (this.paused) {
    this.$el.removeClass("paused");
    this.run();
    this.paused = false;
    if (!this.lost) {
      $(".me-info").css("transition", ".5s").css("opacity", "0");
      $(".me-info").one("transitionend", function() {
        $(".me-info").css("transition", "1.5s").css("top", "-520px");
      });
    }
  } else {
    this.$el.addClass("paused");
    clearInterval(this.loop);
    this.paused = true;
    if (!this.lost) {
      $(".me-info").css("opacity", "1").css("top", "-420px");
    }
  }
};

})();
