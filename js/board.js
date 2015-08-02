(function () {

var Game = window.Game = window.Game || {};

Game.Board = function(el) {
  this.el = el
  this.snake = new Game.Snake();
  this.grid = [];
  this.makeGrid();
};

var Board = Game.Board;

Board.prototype.makeGrid = function () {
  for (var i = 0; i < Game.Config.boardWidth; i++) {
    for (var j = 0; i < Game.Config.boardHeight; i++) {
      this.grid.push(new Game.Coord(i, j));
    }
  }
};

Board.prototype.render = function ($el) {
  var string = "";
  for (var i = 0; i < Game.Config.boardWidth * Game.Config.boardHeight; i++) {
    if (this.snake.on(new Game.Coord(i % Game.Config.boardWidth, Math.floor(i / Game.Config.boardWidth)))) {
      string += " ▀ ";
    } else if (i % Game.Config.boardWidth === Game.Config.boardWidth - 1) {
      string +=" .<br>";
    } else {
      string += " . ";
    }
  }

  $el.html("");
  $el.append(string);
};

Board.prototype.adjust = function () {
  this.snake.move();
};

})();
