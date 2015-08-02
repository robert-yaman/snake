(function () {

window.Game = function($el, canvas) {
  this.$el = $el;
  this.canvas = canvas;
  this.board = new Game.Board(this.$el);
  this.configureKeys();
  this.run();
};

var Game = window.Game;

Game.prototype.run = function () {
  game = this;
  setInterval(function () {
    game.adjust();
    game.render();
  }, 1000 / Game.Config.fps);
};

Game.prototype.adjust = function () {
  this.board.adjust();
};

Game.prototype.render = function () {
  this.board.render(this.$el);
};

Game.prototype.configureKeys = function () {
  game = this;
  key('w', function () { game.changeDir([0, -1]); } );
  key('a', function () { game.changeDir([-1, 0]); });
  key('s', function () { game.changeDir([0, 1]); });
  key('d', function () { game.changeDir([1, 0]); });
};

Game.prototype.changeDir = function (dir) {
  //TODO: queue of moves to facilitate quick successive moves
  game.board.snake.changeDir(dir);
};

})();
