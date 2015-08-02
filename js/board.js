(function () {

var Game = window.Game = window.Game || {};

Game.Board = function($el) {
  this.$el = $el;
  this.snake = new Game.Snake();
  this.divs = [];
  this.apples = [];
  this.makeGrid();
};

var Board = Game.Board;

Board.prototype.makeGrid = function () {
  for (var i = 0; i < Game.Config.boardWidth; i++) {
    for (var j = 0; j < Game.Config.boardHeight; j++) {
      var $div = $('<div>');
      $div.attr("row", i);
      $div.attr("col", j);
      $div.addClass("square");
      this.$el.append($div);
      this.divs.push($div)
      // this.grid.push(new Game.Coord(i, j));
    }
  }
};

Board.prototype.makeApples = function () {
  var rand = Math.random();
  if (rand < 1 / Game.Config.appleFrequency) {
    var appleRow = Math.floor(Math.random() * Game.Config.boardWidth);
    var appleCol = Math.floor(Math.random() * Game.Config.boardHeight);
    this.apples.push(new Game.Coord(appleRow, appleCol));
  };
};

Board.prototype.inApples = function (coord) {
  var inApples = false;
  this.apples.forEach(function (apple) {
    if (apple.eq(coord)) inApples = true;
  });
  return inApples;
};

Board.prototype.render = function ($el) {
  for (var i = 0; i < Game.Config.boardWidth * Game.Config.boardHeight; i++) {
    var coord = new Game.Coord(i % Game.Config.boardWidth, Math.floor(i / Game.Config.boardWidth));

    if (this.snake.on(coord)) {
      this.divs[i].addClass("on");
    } else if (this.inApples(coord)) {
      this.divs[i].addClass("apple");
    } else {
      this.divs[i].removeClass("on").removeClass("apple"); //V-Inneficient
    }
  }
};

Board.prototype.adjust = function () {
  this.makeApples();
  this.snake.move();
};

})();
