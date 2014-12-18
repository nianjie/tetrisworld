'use strict';

angular.module('Game.Tetris.Piece', [

])
.value('PieceType', function() {
    function PieceType(pieceNum, x, y, rotation) {
	if (arguments.length > 0 ) {
	    this.pieceNum = pieceNum;
	    this.x = x;
	    this.y = y;
	    this.rotation = rotation;
	} else {
	    // Initialize new random piece.
	    this.pieceNum = Math.floor(Math.random() * 7);
	    this.x = 4;
	    this.y = -2;
	    this.rotation = 0;
	}
    };

    PieceType.prototype.drop = function () {
	return new PieceType(this.pieceNum, this.x, this.y + 1, this.rotation);
    };

    PieceType.prototype.rotate = function () {
	return new PieceType(this.pieceNum, this.x, this.y, (this.rotation + 1) % 4);
    };

    PieceType.prototype.moveLeft = function () {
	return new PieceType(this.pieceNum, this.x - 1, this.y, this.rotation);
    };

    PieceType.prototype.moveRight = function () {
	return new PieceType(this.pieceNum, this.x + 1, this.y, this.rotation);
    };
    
    return PieceType;
}()
)
.factory('PieceFactory', [
    'Constants','PieceType', '$FirebaseObject', 
    function(Constants, PieceType, $FirebaseObject){
	var pieceFactory = $FirebaseObject.$extendFactory({
	    drop: function() {
		this.y = this.y + 1;
		return this;
	    },
	    rotate: function() {
		this.rotation = (this.rotation + 1) % 4;
		return this;
	    },
	    moveLeft: function() {
		this.x = this.x -1;
		return this;
	    },
	    moveRight: function() {
		this.x = this.x + 1;
		return this;
	    }
	});

	return pieceFactory;
    }]
)
.factory('Piece', [
    '$firebase', 'Constants', 
    function($firebase, Constants) {
	return function(playerId) {
	    return $firebase(Constants.rootRef.child(playerId).child('piece'), {objectFactory: 'PieceFactory'}).$asObject();
	};
    }]
)
;
