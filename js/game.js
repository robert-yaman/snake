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
  this.run();
};

Play.prototype.run = function () {
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
  this.lost = true;
  this.togglePause();
  document.cookie = "high_score=" +
                        Math.max(this.board.snake.length(), this.highScore);
  var play = this;
  setTimeout(function () {
    play.togglePause();
    play.reset();
  }, 2000);
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
  new Game.Play(this.$el, false);
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
  } else {
    this.$el.addClass("paused");
    clearInterval(this.loop);
    this.paused = true;
  }
};

})();
