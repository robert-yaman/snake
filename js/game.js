(function () {

var Game = window.Game = window.Game || {};


var Play = Game.Play = function($el) {
  this.$el = $el;
  this.board = new Game.Board(this.$el);
  this.configureKeys();
  this.run();
};

Play.prototype.run = function () {
  game = this;
  this.loop = setInterval(function () {
    game.adjust();
    game.render();
  }, 1000 / Game.Config.fps);
};

Play.prototype.adjust = function () {
  this.board.adjust();
  this.checkForLoss();
};

Play.prototype.checkForLoss = function () {
  if (this.board.snake.eatingSelf() || this.offBoard(this.board.snake.headPos)) {
    alert("LOSER HAHAHAH");
    this.reset();
  }
};

Play.prototype.reset = function () {
  this.$el.children().remove();
  clearInterval(this.loop);
  new Game.Play(this.$el);
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
    this.run();
    this.paused = false;
  } else {
    clearInterval(this.loop);
    this.paused = true;
  }
};

Play.prototype.configureKeys = function () {
  game = this;
  key('w', function () { game.changeDir(new Game.Coord(0, -1)); } );
  key('a', function () { game.changeDir(new Game.Coord(-1, 0)); });
  key('s', function () { game.changeDir(new Game.Coord(0, 1)); });
  key('d', function () { game.changeDir(new Game.Coord(1, 0)); });
  key('space', function () {game.togglePause()});
};

Play.prototype.changeDir = function (dir) {
  //TODO: queue of moves to facilitate quick successive moves
  game.board.snake.changeDir(dir);
};

})();
