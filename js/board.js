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
  //corner stopper
  var $stopper = $('<div>');
  $stopper.attr("row", -1);
  $stopper.attr("col", -1);
  $stopper.addClass("stopper corner");
  this.$el.append($stopper);

  //top stoppers
  for (var j = 0; j < Game.Config.boardWidth; j++) {
    var $stopper = $('<div>');
    $stopper.attr("row", -1);
    $stopper.attr("col", j);
    $stopper.addClass("stopper top");
    this.$el.append($stopper);
  }

  //corder
  var $stopper = $('<div>');
  $stopper.attr("row", Game.Config.boardWidth);
  $stopper.attr("col", -1);
  $stopper.addClass("stopper corner");
  this.$el.append($stopper);

  //main loop
  for (var i = 0; i < Game.Config.boardHeight; i++) {
    var $stopper = $('<div>');
    $stopper.attr("row", i);
    $stopper.attr("col", -1);
    $stopper.addClass("stopper left");
    this.$el.append($stopper);

    for (var j = 0; j < Game.Config.boardWidth; j++) {
      var $div = $('<div>');
      $div.attr("row", i);
      $div.attr("col", j);
      $div.addClass("square");
      this.$el.append($div);
      this.divs.push($div);
    }

    var $stopper = $('<div>');
    $stopper.attr("row", i);
    $stopper.attr("col", Game.Config.boardWidth);
    $stopper.addClass("stopper right");
    this.$el.append($stopper);
  }

  //corner
  var $stopper = $('<div>');
  $stopper.attr("row", -1);
  $stopper.attr("col", Game.Config.boardHeight);
  $stopper.addClass("stopper corner");
  this.$el.append($stopper);

  //bottom stoppers
  for (var j = 0; j < Game.Config.boardWidth; j++) {
    var $stopper = $('<div>');
    $stopper.attr("row", Game.Config.boardHeight);
    $stopper.attr("col", j);
    $stopper.addClass("stopper bottom");
    this.$el.append($stopper);
  }

  //corner
  var $stopper = $('<div>');
  $stopper.attr("row", Game.Config.boardWidth);
  $stopper.attr("col", Game.Config.boardHeight);
  $stopper.addClass("stopper corner");
  this.$el.append($stopper);
};

Board.prototype.makeApples = function () {
  var rand = Math.random();
  if (rand < 1 / Game.Config.appleFrequency) {
    var appleRow = Math.floor(Math.random() * Game.Config.boardWidth);
    var appleCol = Math.floor(Math.random() * Game.Config.boardHeight);
    var newAppleCoord = new Game.Coord(appleRow, appleCol);
    if (this.snake.on(newAppleCoord)) return;
    this.apples.push(newAppleCoord);
  }
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

Board.prototype.checkForEating = function () {
  var snakeHead = this.snake.headPos;
  for (var i = 0; i < this.apples.length; i++) {
    if (snakeHead.eq(this.apples[i])) {
      this.apples.splice(i,1);
      this.snake.chow();
    }
  }
};

Board.prototype.adjustBorders = function () {
  $(".stopper").removeClass("active");
  $(".stopper").removeClass("subactive")

  var snakePos = this.snake.headPos.pos;

  if (snakePos[0] < 4) {
    this.activate(-1, snakePos[1]);
  }

  if (snakePos[1] < 4) {
    this.activate(snakePos[0], -1);
  }

  if (snakePos[0] >= Game.Config.boardWidth - 4) {
    this.activate(Game.Config.boardWidth, snakePos[1]);
  }

  if (snakePos[1] >= Game.Config.boardHeight - 4) {
    this.activate(snakePos[0], Game.Config.boardHeight);
  }
};

Board.prototype.activate = function (col, row) {
  var $div = $("div[row=" + String(row) + "][col=" + String(col) + "]");
  $div.addClass("active");

  var $subdiv1 = $("div[row=" + String(row + 1) + "][col=" + String(col) + "]");
  $subdiv1.addClass("subactive");
  var $subdiv2 = $("div[row=" + String(row - 1) + "][col=" + String(col) + "]");
  $subdiv2.addClass("subactive");
  var $subdiv3 = $("div[row=" + String(row) + "][col=" + String(col - 1) + "]");
  $subdiv3.addClass("subactive");
  var $subdiv4 = $("div[row=" + String(row) + "][col=" + String(col + 1) + "]");
  $subdiv4.addClass("subactive");
};

Board.prototype.adjust = function () {
  this.makeApples();
  this.snake.move();
  this.adjustBorders();
  this.checkForEating();
};

})();
