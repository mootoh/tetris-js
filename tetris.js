var screen = null;
var blocks = [];
var board = null;
var H;
var W;
var BLOCK = 1;

function init_view()
{
   screen = document.getElementById('screen');

   for (var y=0; y<H; y++) {
      blocks[y] = [];
      for (var x=0; x<W; x++) {
         var block = document.createElement('div');
         block.style.left = x * 32 + 'px';
         block.style.top  = y * 32 + 'px';
         screen.appendChild(block);
         blocks[y][x] = block;
      }
   }

}

function print_board(board)
{
   for (var y=0; y<H; y++) {
      for (var x=0; x<W; x++) {
         if (board[y][x] == 0) {
            blocks[y][x].className = 'space';
         } else if (board[y][x] == 1) {
            blocks[y][x].className = 'block';
         } else if (board[y][x] == 2) {
            blocks[y][x].className = 'current';
         }
      }
   }
}

var log = null;
function show_message(msg)
{
   if (log == null) {
      log = document.getElementById('log');
   }
   log.innerHTML = msg;
}

function check_dropped()
{
   // true if the bottom of the block is close to other blocks
}

function mark_clear(bottom)
{
   var lines = [];

   for (var y=bottom; y>bottom-4 && y >= 0; y--) {
      var to_be_cleared = true;

      for (var x=0; x<W; x++)
         if (board[y][x] == 0) {
            to_be_cleared = false;
            break;
         }

      if (to_be_cleared)
         lines.push(y);
   }

   return lines;
}

function clear_lines(lines)
{
   if (lines.length == 4) {
      // TETRIS !!!!
   }

   for (var i=0; i<lines.length; i++) {
      board.splice(lines[i], 1);

      var newline = new Array(W);
      for (var j=0; j<W; j++)
         newline[j] = 0;
      board.unshift(newline);

      for (var j=i+1; j<lines.length; j++)
         lines[j]++;
   }
}

function clear(bottom)
{
   var lines = mark_clear(bottom);
   if (lines.length > 0)
      console.log('lines ot be cleared:' + lines);
   clear_lines(lines);
}

/*
function print_board()
{
   console.log(board);
}
*/

var mainInterval = null;

function game_over()
{
   show_message('GAME OVER');
   clearInterval(mainInterval);
}

var current_x;
var current_y;

function new_user()
{
   current_x = 2;
   current_y = 0;
}

function hit()
{
   for (var i=0; i<4; i++)
      if (board[current_y][current_x+i] != 0)
         return true;
   return false;
}

function blockize()
{
   for (var i=0; i<4; i++)
      board[current_y][current_x+i] = 1;
}

function update()
{
   if (hit()) {
      current_y--;
      if (current_y < 0) {
         game_over();
         return;
      }
      blockize();
      clear(current_y);
      new_user();
      return;
   }

   for (var i=0; i<4; i++) {
      if (current_y > 0)
         board[current_y-1][current_x+i] = 0;
      console.log('' + (current_x+i), ', ' + current_y);
      board[current_y][current_x+i] = 2;
   }
   if (current_y < H-1)
      current_y++;
}

function main()
{
   new_user();

   mainInterval = setInterval(function() {
      update();
      print_board(board);
   }, 1000);
}

function left_ok()
{
   var left = current_x-1
   return ! (left < 0 || board[current_y][left] != 0);
}

function move_left()
{
   board[current_y-1][current_x + 3] = 0;
   current_x--;
}

function right_ok()
{
   var right = current_x+4;
   return ! (right >= W  || board[current_y][right] != 0);
}

function move_right()
{
   board[current_y-1][current_x] = 0;
   current_x++
}

function init()
{
   board = [
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
      [1, 1, 0, 0,  0, 0, 1, 1],
      [1, 0, 0, 0,  0, 1, 1, 0],

      [1, 1, 1, 0,  0, 1, 1, 0],
      [1, 1, 1, 1,  1, 1, 1, 1],
      [1, 0, 1, 0,  1, 1, 0, 1],
      [1, 1, 1, 1,  1, 1, 1, 1],
   ];

   H = board.length;
   W = board[0].length;

   init_view();

   window.onkeypress = function(e) {
      var e = window.event || e;
      var kc = e.keyCode;
      if (kc == 104) { // h
         console.log('left');
         if (left_ok()) {
            move_left();
         }
      } else if (kc == 108) { // l or ->
         console.log('right');
         if (right_ok()) {
            move_right();
         }
      }
   };
}
