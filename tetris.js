// -------------------------------------
// Block
// {{{
var Block = function() {};

Block.prototype.init = function(matrix, color) {
   this.matrix = matrix;
   this.color  = color;
   return this;
};

Block.prototype.rotated = function() {
   var mat = [];
   var w = this.matrix[0].length;
   var h = this.matrix.length;

   for (var x=0; x<w; x++) {
      var row = [];
      for (var y=0; y<h; y++)
         row[y] = this.matrix[y][w-x-1];
      mat[x] = row;
   }
   return mat;
};

Block.prototype.rotate = function() {
   this.matrix = this.rotated();
   return this;
};

var blocks = [
   new Block().init([
      [1, 1, 1, 1]
   ], '#c00'),
   new Block().init([
      [1, 1],
      [1, 1]
   ], '#0c0'),
   new Block().init([
      [1, 1, 1],
      [1, 0, 0]
   ], '#00c'),
   new Block().init([
      [1, 1, 1],
      [0, 0, 1]
   ], '#00c'),
   new Block().init([
      [1, 1, 0],
      [0, 1, 1]
   ], '#aa0'),
   new Block().init([
      [0, 1, 1],
      [1, 1, 0]
   ], '#0aa'),
   new Block().init([
      [0, 1, 0],
      [1, 1, 1]
   ], '#0aa')
];
// }}}

// -------------------------------------
// User
// {{{
var User = function() {};

User.prototype.init = function(board, bricks) {
   this.board  = board;
   this.bricks = bricks;

   this.reset();
   var that = this;

   window.onkeypress = function(e) {
      var e = window.event || e;
      var kc = e.keyCode;
      if (kc == 104) { // h
         if (that.left_ok())
            that.move_left();
            draw(that.board, that.bricks, that);
      } else if (kc == 108) { // l
         if (that.right_ok())
            that.move_right();
            draw(that.board, that.bricks, that);
      } else if (kc == 107) { // k
         if (that.rotate_ok()) {
            that.block.rotate();
            draw(that.board, that.bricks, that);
         }
      } else if (kc == 106) {
         if (! that.didHit(that.board)) {
            that.move_down();
            draw(that.board, that.bricks, that);
         }
      }
   };

   return this;
};

User.prototype.reset = function() {
   this.x = 2;
   this.y = 0;
   this.block = blocks[parseInt(Math.random() * blocks.length)];
}

User.prototype.left_ok = function() {
   var left = this.x - 1

   if (left < 0) return false;

   for (var y=0; y<this.block.matrix.length; y++) {
      if (this.block.matrix[y][0] == 0)
         continue;

      if (this.board[this.y + y][left] == 1)
         return false;
   }

   return true;
};

User.prototype.right_ok = function() {
   var right = this.x + this.block.matrix[0].length;

   if (right >= this.board[0].length) {
      return false;
   }

   for (var y=0; y<this.block.matrix.length; y++)
      if (this.board[this.y + y][right] == 1)
         return false;

   return true;
};

User.prototype.move_left = function() {
   if (this.left_ok(this.board))
      this.x -= 1;
};

User.prototype.move_right = function() {
   if (this.right_ok(this.board))
      this.x += 1;
};

User.prototype.move_down = function() {
   if (this.y < this.board.length-1)
   this.y += 1;
};

User.prototype.rotate_ok = function() {
   var rotated = this.block.rotated();
   for (var y=0; y<rotated.length; y++)
      for (var x=0; x<rotated[0].length; x++)
         if ((rotated[y][x] == 1) && this.board[this.y+y][this.x+x] == 1)
            return false;
   return true;
}

User.prototype.didHit = function(board) {
   var matrix = this.block.matrix;

   for (var y=0; y<matrix.length; y++)
      for (var x=0; x<matrix[0].length; x++)
         if ((matrix[y][x] == 1) &&
            ((this.y + y+1) >= board.length ||
             board[this.y + y+1][this.x + x] == 1))
            return true;

   return false;
};

User.prototype.draw = function(bricks) {
   var matrix = this.block.matrix;

   for (var y=0; y<matrix.length; y++)
      for (var x=0; x<matrix[0].length; x++)
         if (matrix[y][x] == 1)
            bricks[this.y+y][this.x+x].className = 'current';
}

User.prototype.blockize = function(board, user) {
   var matrix = this.block.matrix;

   for (var y=0; y<matrix.length; y++)
      for (var x=0; x<matrix[0].length; x++)
         if (matrix[y][x] == 1)
            board[this.y + y][this.x + x] = 1;
}

User.prototype.bottom = function() {
   return this.y + this.block.matrix.length-1;
}

// }}}

// -------------------------------------
// Drawing
// {{{
function init_view(w, h) {
   var bricks = []
   var screen = document.getElementById('screen');

   for (var y=0; y<h; y++) {
      bricks[y] = [];
      for (var x=0; x<w; x++) {
         var brick = document.createElement('div');
         brick.style.left = x * 32 + 'px';
         brick.style.top  = y * 32 + 'px';
         screen.appendChild(brick);
         bricks[y][x] = brick;
      }
   }
   return bricks;
}

function draw_board(board, bricks) {
   for (var y=0; y<board.length; y++)
      for (var x=0; x<board[0].length; x++)
         //if (board[y][x] == 0) {
            //bricks[y][x].className = 'space';
         //} else if (board[y][x] == 1) {
         if (board[y][x] == 1)
            bricks[y][x].className = 'block';
         //else if (board[y][x] == 2) {
            //bricks[y][x].className = 'current';
}

function clear_all(w, h, bricks) {
   for (var y=0; y<h; y++)
      for (var x=0; x<w; x++)
         bricks[y][x].className = 'space';
}

// }}}

// -------------------------------------
// Util
// {{{
var log = null;
function show_message(msg)
{
   if (log == null) {
      log = document.getElementById('log');
   }
   log.innerHTML = msg;
}
// }}}

function mark_clear(bottom, board)
{
   var lines = [];

   for (var y=bottom; y>bottom-4 && y >= 0; y--) {
      var to_be_cleared = true;

      for (var x=0; x<board[0].length; x++)
         if (board[y][x] == 0) {
            to_be_cleared = false;
            break;
         }

      if (to_be_cleared)
         lines.push(y);
   }

   return lines;
}

function clear_lines(lines, board)
{
   if (lines.length == 4)
      console.log('!!!! TETRIS !!!!');

   for (var i=0; i<lines.length; i++) {
      board.splice(lines[i], 1);

      var newline = [];
      for (var j=0; j<board[0].length; j++)
         newline[j] = 0;
      board.unshift(newline);

      for (var j=i+1; j<lines.length; j++)
         lines[j]++;
   }
}

function clear(bottom, board)
{
   var lines = mark_clear(bottom, board);
   clear_lines(lines, board);
}

var mainInterval = null;

function game_over()
{
   show_message('GAME OVER');
   clearInterval(mainInterval);
}

function update(board, user)
{
   if (user.didHit(board)) {
      if (user.x == 2 && user.y == 0) {
         game_over();
         return;
      }
      user.blockize(board);
      clear(user.bottom(), board);
      user.reset();
      return;
   }

   user.move_down();
}

function draw(board, bricks, user)
{
   clear_all(board[0].length, board.length, bricks);
   draw_board(board, bricks);
   user.draw(bricks);
}

var playing = false;
function toggle(user, board, bricks)
{
   if (playing)
      clearInterval(mainInterval);
   else {
      mainInterval = setInterval(function() {
         update(board, user);
         draw(board, bricks, user);
      }, 1000);
   }
   playing = ! playing;
}

function main() {
   var board = [
      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],

      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],

      [0, 0, 0, 0,  0, 0, 0, 0],
      [0, 0, 0, 0,  0, 0, 0, 0],
      [1, 0, 0, 0,  0, 0, 1, 0],
      [1, 0, 0, 0,  0, 1, 1, 1],

      [1, 1, 1, 0,  0, 1, 1, 1],
      [1, 1, 1, 0,  1, 1, 1, 1],
      [1, 0, 1, 0,  1, 1, 0, 1],
      [1, 1, 1, 1,  1, 1, 1, 1],
   ];

   var bricks = init_view(board[0].length, board.length);
   var user = new User().init(board, bricks);
   toggle(user, board, bricks);
}

// vim:set fdm=marker:
