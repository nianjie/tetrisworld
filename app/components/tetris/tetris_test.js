'use strict';

describe('Game.Tetris module', function() {
    beforeEach(module('Game.Tetris'));

    describe('Constants service', function() {
	it('should define constant values used in system', function() {
/*	    module(function($provide) {
		$provide.value('Constants', {PlayingState: {Watching: 0, Joing: 1, Playing: 2} });
	    });
*/
	    inject(function(Constants) {
		expect(Constants.PlayingState).toBeDefined();
		expect(Constants.PlayingState.Watching).toBe(0);
		expect(Constants.BOARD_WIDTH).toBe(10);
	    });

	});

    });

    describe('Piece service', function() {
	it('should create instances of PieceType', function() {
	    inject(function(Piece) {
		var a = new Piece(1,2,3,4), b = new Piece(5,6,7,8);
		expect(a.pieceNum).toBe(1);
		expect(b.pieceNum).toBe(5);
		expect(a.drop).toBeDefined();
		expect(b.rotate).toBeDefined();
		console.log(typeof a);
	    });
	});
    });

});
