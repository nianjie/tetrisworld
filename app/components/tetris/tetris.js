'use strict';

angular.module('Game.Tetris', [
])

.value('Constants', new function(){
    var self = this;
    /**
     * Various constants related to board size / drawing.
     */
    self.PlayingState = {Watching: 0, Joing: 1, Playing: 2};

    self.BOARD_WIDTH = 10; // (in "blocks", not pixels)
    self.BOARD_HEIGHT = 20;


    self.BLOCK_SIZE_PIXELS = 25;
    self.BOARD_HEIGHT_PIXELS = self.BOARD_HEIGHT * self.BLOCK_SIZE_PIXELS;
    self.BOARD_WIDTH_PIXELS = self.BOARD_WIDTH * self.BLOCK_SIZE_PIXELS;

    self.BLOCK_BORDER_COLOR = "#484848";
    self.BLOCK_COLORS = { 'X': 'black', 'b': 'cyan', 'B': 'blue', 
			  'O': 'orange','Y': 'yellow', 'G': 'green', 
			  'P': '#9370D8', 'R': 'red' 
			};

    self.GRAVITY_DELAY = 300; // 300ms

    self.EMPTY_LINE  = "          ";
    self.FILLED_LINE = "XXXXXXXXXX";
    self.COMPLETE_LINE_PATTERN = /[^ ]{10}/;

    // Pieces.  (Indexed by piece rotation (0-3), row (0-3), piece number (0-6))
    self.PIECES = [];
    for (var i = 0; i < 4; i++) { self.PIECES[i] = []; }
    self.PIECES[0][0] = [ "    ",   "    ",   "    ",   "    ",   "    ",   "    ",   "    " ];
    self.PIECES[0][1] = [ "    ",   "B   ",   "  O ",   " YY ",   " GG ",   " P  ",   "RR  " ];
    self.PIECES[0][2] = [ "bbbb",   "BBB ",   "OOO ",   " YY ",   "GG  ",   "PPP ",   " RR " ];
    self.PIECES[0][3] = [ "    ",   "    ",   "    ",   "    ",   "    ",   "    ",   "    " ];
    self.PIECES[1][0] = [ " b  ",   "    ",   "    ",   "    ",   "    ",   "    ",   "  R " ];
    self.PIECES[1][1] = [ " b  ",   " B  ",   "OO  ",   " YY ",   " G  ",   " P  ",   " RR " ];
    self.PIECES[1][2] = [ " b  ",   " B  ",   " O  ",   " YY ",   " GG ",   " PP ",   " R  " ];
    self.PIECES[1][3] = [ " b  ",   "BB  ",   " O  ",   "    ",   "  G ",   " P  ",   "    " ];
    self.PIECES[2][0] = [ "    ",   "    ",   "    ",   "    ",   "    ",   "    ",   "    " ];
    self.PIECES[2][1] = [ "    ",   "    ",   "    ",   " YY ",   " GG ",   "    ",   "RR  " ];
    self.PIECES[2][2] = [ "bbbb",   "BBB ",   "OOO ",   " YY ",   "GG  ",   "PPP ",   " RR " ];
    self.PIECES[2][3] = [ "    ",   "  B ",   "O   ",   "    ",   "    ",   " P  ",   "    " ];
    self.PIECES[3][0] = [ " b  ",   "    ",   "    ",   "    ",   "    ",   "    ",   "  R " ];
    self.PIECES[3][1] = [ " b  ",   " BB ",   " O  ",   " YY ",   " G  ",   " P  ",   " RR " ];
    self.PIECES[3][2] = [ " b  ",   " B  ",   " O  ",   " YY ",   " GG ",   "PP  ",   " R  " ];
    self.PIECES[3][3] = [ " b  ",   " B  ",   " OO ",   "    ",   "  G ",   " P  ",   "    " ];

    return self;
}()
);
