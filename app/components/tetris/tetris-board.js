'use strict';

angular.module('Game.Tetris.Board', [

])
.factory('BoardFactory', [
    '$FirebaseObject', 'Constants',
    function($FirebaseObject, Constants) {
	var boardFactory = $FirebaseObject.$extendFactory({
	    $$updated: function(snap) {
		var changed = $FirebaseObject.prototype.$$updated.apply(this, arguments);
		this.draw();
		return changed;
	    },
	    draw: function() { 
		console.log("Board is drawing.");
		this.context.clearRect(0, 0, Constants.BOARD_WIDTH_PIXELS, Constants.BOARD_HEIGHT_PIXELS);

		// If this isn't my board, dim it out with a 25% opacity black rectangle.
		if (!this._isMyBoard) {
		    this.context.fillStyle = "rgba(0, 0, 0, 0.25)";
		    this.context.fillRect(0, 0, Tetris.BOARD_WIDTH_PIXELS, Tetris.BOARD_HEIGHT_PIXELS);
		}
	    },
	    drawPiece: function() {
		var self = this;
		this.forEachBlockOfPiece(piece, function(x, y, colorValue) {
		    var left = x * Constants.BLOCK_SIZE_PIXELS;
		    var top = y * Constants.BLOCK_SIZE_PIXELS;

		    self.context.fillStyle = Constants.BLOCK_COLORS[colorValue];
		    self.context.fillRect(left, top, Constants.BLOCK_SIZE_PIXELS, Constants.BLOCK_SIZE_PIXELS);
		    self.context.lineWidth = 1;
		    self.context.strokeStyle = Constants.BLOCK_BORDER_COLOR;
		    self.context.strokeRect(left, top, Constants.BLOCK_SIZE_PIXELS, Constants.BLOCK_SIZE_PIXELS);
		});
	    },
	    clear: function() {
		for (var row = 0; row < Constants.BOARD_HEIGHT; row++) {
		    this.setRow(row, Constants.EMPTY_LINE);
		}
	    },
	    checkForPieceCollision: function() {
		// to do
	    },
	    addLandedPiece: function() {
		// to do
	    },
	    removeCompletedRows: function() {
		// to do
	    },
	    addJunkRows: function() {
		// to do
	    },
	    forEachBlockOfPiece: function (piece, fn, includeInvalid) {
		for (var blockY = 0; blockY < 4; blockY++) {
		    for (var blockX = 0; blockX < 4; blockX++) {
			var colorValue = Constants.PIECES[piece.rotation][blockY][piece.pieceNum].charAt(blockX);
			if (colorValue != ' ') {
			    var x = piece.x + blockX, y = piece.y + blockY;
			    if (includeInvalid || (x >= 0 && x < Constants.BOARD_WIDTH && y >= 0 && y < Constants.BOARD_HEIGHT)) {
				fn(x, y, colorValue);
			    }
			}
		    }
		}
	    },
	    getRow: function (y) {
		var row = (y < 10) ? ('0' + y) : ('' + y); // Pad row so they sort nicely in debugger. :-)

		var rowContents = this[row];
		return rowContents || Constants.EMPTY_LINE;
	    },
	    getBlockVal: function (x, y) {
		return this.getRow(y).charAt(x);
	    },

	    setRow: function (y, rowContents) {
		var row = (y < 10) ? ('0' + y) : ('' + y); // Pad row so they sort nicely in debugger. :-)

		if (rowContents === Constants.EMPTY_LINE)
		    rowContents = null; // delete empty lines so we get remove / added events in debugger. :-)

		this[row] = rowContents;
	    },
	    setBlockVal: function (x, y, val) {
		var rowContents = this.getRow(y);
		rowContents = rowContents.substring(0, x) + val + rowContents.substring(x+1);
		this.setRow(y, rowContents);
	    },
	    _isMyBoard: false
	});
	return boardFactory;
    }]
)
.factory('Board', [
    '$firebase', 'Constants', 'BoardFactory',
    function($firebase, Constants, BoardFactory) {
	return function(canvas, playerId) {
	    var restStuff = {
		_context: canvas.getContext('2d'),
		_player: playerId
	    };
	    angular.extend(BoardFactory, restStuff);
	    var boardRef = Constants.rootRef.child(playerId).child('board');
	    return $firebase(boardRef, {objectFactory: 'BoardFactory'}).$asObject();
	};
    }]
)
;

// sample
var Tetris = {};
  /**
   * Stores the state of a tetris board and handles drawing it.
   */
  Tetris.Board = function (canvas, playerRef) {
    this.context = canvas.getContext('2d');
    this.playerRef = playerRef;
    this.snapshot = null;
    this.isMyBoard = false;

    // Listen for changes to our board.
    var self = this;
    playerRef.on('value', function(snapshot) {
      self.snapshot = snapshot;
      self.draw();
    });
  };


  /**
   * Draws the contents of the board as well as the current piece.
   */
  Tetris.Board.prototype.draw = function () {
    // Clear canvas.
    this.context.clearRect(0, 0, Tetris.BOARD_WIDTH_PIXELS, Tetris.BOARD_HEIGHT_PIXELS);

    // Iterate over columns / rows in board data and draw each non-empty block.
    for (var x = 0; x < Tetris.BOARD_WIDTH; x++) {
      for (var y = 0; y < Tetris.BOARD_HEIGHT; y++) {
        var colorValue = this.getBlockVal(x, y);
        if (colorValue != ' ') {
          // Calculate block position and draw a correctly-colored square.
          var left = x * Tetris.BLOCK_SIZE_PIXELS;
          var top = y * Tetris.BLOCK_SIZE_PIXELS;
          this.context.fillStyle = Tetris.BLOCK_COLORS[colorValue];
          this.context.fillRect(left, top, Tetris.BLOCK_SIZE_PIXELS, Tetris.BLOCK_SIZE_PIXELS);
          this.context.lineWidth = 1;
          this.context.strokeStyle = Tetris.BLOCK_BORDER_COLOR;
          this.context.strokeRect(left, top, Tetris.BLOCK_SIZE_PIXELS, Tetris.BLOCK_SIZE_PIXELS);
        }
      }
    }

    // If there's a falling piece, draw it.
    if (this.snapshot !== null && this.snapshot.hasChild('piece')) {
      var piece = Tetris.Piece.fromSnapshot(this.snapshot.child('piece'));
      this.drawPiece(piece);
    }

    // If this isn't my board, dim it out with a 25% opacity black rectangle.
    if (!this.isMyBoard) {
      this.context.fillStyle = "rgba(0, 0, 0, 0.25)";
      this.context.fillRect(0, 0, Tetris.BOARD_WIDTH_PIXELS, Tetris.BOARD_HEIGHT_PIXELS);
    }
  };


  /**
   * Draw the currently falling piece.
   */
  Tetris.Board.prototype.drawPiece = function (piece) {
    var self = this;
    this.forEachBlockOfPiece(piece,
      function (x, y, colorValue) {
        var left = x * Tetris.BLOCK_SIZE_PIXELS;
        var top = y * Tetris.BLOCK_SIZE_PIXELS;

        self.context.fillStyle = Tetris.BLOCK_COLORS[colorValue];
        self.context.fillRect(left, top, Tetris.BLOCK_SIZE_PIXELS, Tetris.BLOCK_SIZE_PIXELS);
        self.context.lineWidth = 1;
        self.context.strokeStyle = Tetris.BLOCK_BORDER_COLOR;
        self.context.strokeRect(left, top, Tetris.BLOCK_SIZE_PIXELS, Tetris.BLOCK_SIZE_PIXELS);
      });
  };


  /**
   * Clear the board contents.
   */
  Tetris.Board.prototype.clear = function () {
    for (var row = 0; row < Tetris.BOARD_HEIGHT; row++) {
      this.setRow(row, Tetris.EMPTY_LINE);
    }
  };


  /**
   * Given a Tetris.Piece, returns true if it has collided with the board (i.e. its current position
   * and rotation causes it to overlap blocks already on the board).
   */
  Tetris.Board.prototype.checkForPieceCollision = function (piece) {
    var collision = false;
    var self = this;
    this.forEachBlockOfPiece(piece,
      function (x, y, colorValue) {
        // NOTE: we explicitly allow y < 0 since pieces can be partially visible.
        if (x < 0 || x >= Tetris.BOARD_WIDTH || y >= Tetris.BOARD_HEIGHT) {
          collision = true;
        }
        else if (y >= 0 && self.getBlockVal(x, y) != ' ') {
          collision = true; // collision with board contents.
        }
      }, /*includeInvalid=*/ true);

    return collision;
  };


  /**
   * Given a Tetris.Piece that has landed, add it to the board contents.
   */
  Tetris.Board.prototype.addLandedPiece = function (piece) {
    var self = this;
    // We go out of our way to set an entire row at a time just so the rows show up as
    // child_added in the graphical debugger, rather than child_changed.
    var rowY = -1, rowContents = null;
    this.forEachBlockOfPiece(piece,
      function (x, y, val) {
        if (y != rowY) {
          if (rowY !== -1)
            self.setRow(rowY, rowContents);

          rowContents = self.getRow(y);
          rowY = y;
        }
        rowContents = rowContents.substring(0, x).concat(val)
          .concat(rowContents.substring(x + 1, Tetris.BOARD_WIDTH));
      });

    if (rowY !== -1)
      self.setRow(rowY, rowContents);
  };


  /**
   * Check for any completed lines (no gaps) and remove them, then return the number
   * of removed lines.
   */
  Tetris.Board.prototype.removeCompletedRows = function () {
    // Start at the bottom of the board, working up, removing completed lines.
    var copyFrom = Tetris.BOARD_HEIGHT - 1;
    var copyTo = copyFrom;

    var completedRows = 0;
    while (copyFrom >= 0) {
      var fromContents = this.getRow(copyFrom);

      // See if the line is complete (if so, we'll skip it)
      if (fromContents.match(Tetris.COMPLETE_LINE_PATTERN)) {
        copyFrom--;
        completedRows++;
      } else {
        // Copy the row down (to fill the gap from any removed rows) and continue on.
        this.setRow(copyTo, fromContents);
        copyFrom--;
        copyTo--;
      }
    }

    return completedRows;
  };


  /**
   * generate the specified number of junk rows at the bottom of the board. Return true if the added
   * rows overflowed the board (in which case the player loses).
   */
  Tetris.Board.prototype.addJunkRows = function (numRows) {
    var overflow = false;
    // First, check if any blocks are going to overflow off the top of the screen.
    var topRowContents = this.getRow(numRows - 1);
    overflow = topRowContents.match(/[^ ]/);

    // Shift rows up to make room for the new rows.
    for (var i = 0; i < Tetris.BOARD_HEIGHT - numRows; i++) {
      var moveLineContents = this.getRow(i + numRows);
      this.setRow(i, moveLineContents);
    }

    // Fill the bottom with junk rows that are full except for a single random gap.
    var gap = Math.floor(Math.random() * Tetris.FILLED_LINE.length);
    var junkRow = Tetris.FILLED_LINE.substring(0, gap) + ' ' + Tetris.FILLED_LINE.substring(gap + 1);
    for (i = Tetris.BOARD_HEIGHT - numRows; i < Tetris.BOARD_HEIGHT; i++) {
      this.setRow(i, junkRow);
    }

    return overflow;
  };


  /**
   * Helper to enumerate the blocks that make up a particular piece.  Calls fn() for each block,
   * passing the x and y position of the block and the color value.  If includeInvalid is true, it
   * includes blocks that would fall outside the bounds of the board.
   */
  Tetris.Board.prototype.forEachBlockOfPiece = function (piece, fn, includeInvalid) {
    for (var blockY = 0; blockY < 4; blockY++) {
      for (var blockX = 0; blockX < 4; blockX++) {
        var colorValue = Tetris.PIECES[piece.rotation][blockY][piece.pieceNum].charAt(blockX);
        if (colorValue != ' ') {
          var x = piece.x + blockX, y = piece.y + blockY;
          if (includeInvalid || (x >= 0 && x < Tetris.BOARD_WIDTH && y >= 0 && y < Tetris.BOARD_HEIGHT)) {
            fn(x, y, colorValue);
          }
        }
      }
    }
  };


  Tetris.Board.prototype.getRow = function (y) {
    var row = (y < 10) ? ('0' + y) : ('' + y); // Pad row so they sort nicely in debugger. :-)

    var rowContents = this.snapshot === null ? null : this.snapshot.child('board/' + row).val();
    return rowContents || Tetris.EMPTY_LINE;
  };


  Tetris.Board.prototype.getBlockVal = function (x, y) {
    return this.getRow(y).charAt(x);
  };


  Tetris.Board.prototype.setRow = function (y, rowContents) {
    var row = (y < 10) ? ('0' + y) : ('' + y); // Pad row so they sort nicely in debugger. :-)

    if (rowContents === Tetris.EMPTY_LINE)
      rowContents = null; // delete empty lines so we get remove / added events in debugger. :-)

    this.playerRef.child('board').child(row).set(rowContents);
  };


  Tetris.Board.prototype.setBlockVal = function (x, y, val) {
    var rowContents = this.getRow(y);
    rowContents = rowContents.substring(0, x) + val + rowContents.substring(x+1);
    this.setRow(y, rowContents);
  };

