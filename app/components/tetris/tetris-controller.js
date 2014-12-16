'use strict';

angular.module('Game.Tetris.Controller', [

])

;

// sample 

  /**
   * Manages joining the game, responding to keypresses, making the piece drop, etc.
   */
  Tetris.PlayingState = { Watching: 0, Joining: 1, Playing: 2 };
  Tetris.Controller = function (tetrisRef) {
    this.tetrisRef = tetrisRef;
    this.createBoards();

    this.playingState = Tetris.PlayingState.Watching;
    this.waitToJoin();
  };


  Tetris.Controller.prototype.createBoards = function () {
    this.boards = [];
    for(var i = 0; i < 1; i++) {
      var playerRef = this.tetrisRef.child('player' + i);
      var canvas = $('#canvas' + i).get(0);
      this.boards.push(new Tetris.Board(canvas, playerRef));
    }
  };


  Tetris.Controller.prototype.waitToJoin = function() {
    var self = this;

    // Listen on 'online' location for player0 and player1.
    this.tetrisRef.child('player0/online').on('value', function(onlineSnap) {
      if (onlineSnap.val() === null && self.playingState === Tetris.PlayingState.Watching) {
        self.tryToJoin(0);
      }
    });

    this.tetrisRef.child('player1/online').on('value', function(onlineSnap) {
      if (onlineSnap.val() === null && self.playingState === Tetris.PlayingState.Watching) {
        self.tryToJoin(1);
      }
    });
  };


  /**
   * Try to join the game as the specified playerNum.
   */
  Tetris.Controller.prototype.tryToJoin = function(playerNum) {
    // Set ourselves as joining to make sure we don't try to join as both players. :-)
    this.playingState = Tetris.PlayingState.Joining;

    // Use a transaction to make sure we don't conflict with other people trying to join.
    var self = this;
    this.tetrisRef.child('player' + playerNum + '/online').transaction(function(onlineVal) {
      if (onlineVal === null) {
        return true; // Try to set online to true.
      } else {
        return; // Somebody must have beat us.  Abort the transaction.
      }
    }, function(error, committed) {
      if (committed) { // We got in!
        self.playingState = Tetris.PlayingState.Playing;
        self.startPlaying(playerNum);
      } else {
        self.playingState = Tetris.PlayingState.Watching;
      }
    });
  };


  /**
   * Once we've joined, enable controlling our player.
   */
  Tetris.Controller.prototype.startPlaying = function (playerNum) {
    this.myPlayerRef = this.tetrisRef.child('player' + playerNum);
    this.opponentPlayerRef = this.tetrisRef.child('player' + (1 - playerNum));
    this.myBoard = this.boards[playerNum];
    this.myBoard.isMyBoard = true;
    this.myBoard.draw();

    // Clear our 'online' status when we disconnect so somebody else can join.
    this.myPlayerRef.child('online').onDisconnect().remove();

    // Detect when other player pushes rows to our board.
    this.watchForExtraRows();

    // Detect when game is restarted by other player.
    this.watchForRestart();

    $('#gameInProgress').hide();

    var self = this;
    $('#restartButton').show();
    $("#restartButton").click(function () {
      self.restartGame();
    });

    this.initializePiece();
    this.enableKeyboard();
    this.resetGravity();
  };


  Tetris.Controller.prototype.initializePiece = function() {
    this.fallingPiece = null;
    var pieceRef = this.myPlayerRef.child('piece');
    var self = this;

    // Watch for changes to the current piece (and initialize it if it's null).
    pieceRef.on('value', function(snapshot) {
      if (snapshot.val() === null) {
        var newPiece = new Tetris.Piece();
        newPiece.writeToFirebase(pieceRef);
      } else {
        self.fallingPiece = Tetris.Piece.fromSnapshot(snapshot);
      }
    });
  };


  /**
   * Sets up handlers for all keyboard commands.
   */
  Tetris.Controller.prototype.enableKeyboard = function () {
    var self = this;
    $(document).on('keydown', function (evt) {
      if (self.fallingPiece === null)
        return; // piece isn't initialized yet.

      var keyCode = evt.which;
      var key = { space:32, left:37, up:38, right:39, down:40 };

      var newPiece = null;
      switch (keyCode) {
        case key.left:
          newPiece = self.fallingPiece.moveLeft();
          break;
        case key.up:
          newPiece = self.fallingPiece.rotate();
          break;
        case key.right:
          newPiece = self.fallingPiece.moveRight();
          break;
        case key.down:
          newPiece = self.fallingPiece.drop();
          break;
        case key.space:
          // Drop as far as we can.
          var droppedPiece = self.fallingPiece;
          do {
            newPiece = droppedPiece;
            droppedPiece = droppedPiece.drop();
          } while (!self.myBoard.checkForPieceCollision(droppedPiece));
          break;
      }

      if (newPiece !== null) {
        // If the new piece position / rotation is valid, update self.fallingPiece and firebase.
        if (!self.myBoard.checkForPieceCollision(newPiece)) {
          // If the keypress moved the piece down, reset gravity.
          if (self.fallingPiece.y != newPiece.y) {
            self.resetGravity();
          }

          newPiece.writeToFirebase(self.myPlayerRef.child('piece'));
        }
        return false; // handled
      }

      return true;
    });
  };


  /**
   * Sets a timer to make the piece repeatedly drop after GRAVITY_DELAY ms.
   */
  Tetris.Controller.prototype.resetGravity = function () {
    // If there's a timer already active, clear it first.
    if (this.gravityIntervalId !== null) {
      clearInterval(this.gravityIntervalId);
    }

    var self = this;
    this.gravityIntervalId = setInterval(function() {
      self.doGravity();
    }, Tetris.GRAVITY_DELAY);
  };


  Tetris.Controller.prototype.doGravity = function () {
    if (this.fallingPiece === null)
      return; // piece isn't initialized yet.

    var newPiece = this.fallingPiece.drop();

    // If we've hit the bottom, add the (pre-drop) piece to the board and create a new piece.
    if (this.myBoard.checkForPieceCollision(newPiece)) {
      this.myBoard.addLandedPiece(this.fallingPiece);

      // Check for completed lines and if appropriate, push extra rows to our opponent.
      var completedRows = this.myBoard.removeCompletedRows();
      var rowsToPush = (completedRows === 4) ? 4 : completedRows - 1;
      if (rowsToPush > 0)
        this.opponentPlayerRef.child('extrarows').push(rowsToPush);

      // Create new piece (it'll be initialized to a random piece at the top of the screen).
      newPiece = new Tetris.Piece();

      // Is the board full?
      if (this.myBoard.checkForPieceCollision(newPiece))
        this.gameOver();
    }

    newPiece.writeToFirebase(this.myPlayerRef.child('piece'));
  };


  /**
   * Detect when our opponent pushes extra rows to us.
   */
  Tetris.Controller.prototype.watchForExtraRows = function () {
    var self = this;
    var extraRowsRef = this.myPlayerRef.child('extrarows');
    extraRowsRef.on('child_added', function(snapshot) {
      var rows = snapshot.val();
      extraRowsRef.child(snapshot.key()).remove();

      var overflow = self.myBoard.addJunkRows(rows);
      if (overflow)
        self.gameOver();

      // Also move piece up to avoid collisions.
      if (self.fallingPiece) {
        self.fallingPiece.y -= rows;
        self.fallingPiece.writeToFirebase(self.myPlayerRef.child('piece'));
      }
    });
  };


  /**
   * Detect when our opponent restarts the game.
   */
  Tetris.Controller.prototype.watchForRestart = function () {
    var self = this;
    var restartRef = this.myPlayerRef.child('restart');
    restartRef.on('value', function(snap) {
      if (snap.val() === 1) {
        restartRef.set(0);
        self.resetMyBoardAndPiece();
      }
    });
  };


  Tetris.Controller.prototype.gameOver = function () {
    this.restartGame();
  };


  Tetris.Controller.prototype.restartGame = function () {
    this.opponentPlayerRef.child('restart').set(1);
    this.resetMyBoardAndPiece();
  };


  Tetris.Controller.prototype.resetMyBoardAndPiece = function () {
    this.myBoard.clear();
    var newPiece = new Tetris.Piece();
    newPiece.writeToFirebase(this.myPlayerRef.child('piece'));
  };
