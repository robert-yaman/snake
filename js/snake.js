(function () {

var Game = window.Game = window.Game || {};

Game.Snake = function() {
  this.headPos = new Coord(1,1);
  this.currentDir = new Coord(0,1);
  this.segments = [this.headPos, new Coord(2,1), new Coord(3,1)];
};

var Snake = Game.Snake;

Game.Coord = function(row, col) {
  this.pos = [row, col];
};

var Coord = Game.Coord;

Coord.prototype.eq = function (otherCoord) {
  return this.pos[0] === otherCoord.pos[0] && this.pos[1] === otherCoord.pos[1];
};

Coord.prototype.plus = function (otherCoord) {
  return new Coord(this.pos[0] + otherCoord.pos[0], this.pos[1] + otherCoord.pos[1]);
};

Snake.prototype.move = function () {
  this.headPos = this.headPos.plus(this.currentDir);
  this.segments.unshift(this.headPos);
  this.segments.pop();
};

Snake.prototype.changeDirs = function (newDir) {
  var matched = false;
  for (var i = 0; i < Game.DIRS.length; i++) {
    if (Game.DIRS[i].eq(newDir)) matched = true;
  }
  if (!matched) throw "Invalid dir";

  this.currentDir = newDir;
};

Snake.prototype.length = function () {
  return this.segments.length;
};

Snake.prototype.on = function (coord) {
  for (var i = 0; i < this.length(); i++) {
    if (this.segments[i].eq(coord)) return true;
  }
  return false;
};

Snake.prototype.changeDir = function (dir) {
  this.currentDir = new Coord(dir[0], dir[1]);
};

})();
