'use strict';

describe('Game.Tetris.Piece module', function() {
    beforeEach(module('Game.Tetris'));

    describe('PieceType service', function() {
	it('should provide type of PieceType', function() {
	    inject(function(PieceType) {
		var a = new PieceType(1,2,3,4), b = new PieceType(5,6,7,8);
		expect(a.pieceNum).toBe(1);
		expect(b.pieceNum).toBe(5);
		expect(a.drop).toBeDefined();
		expect(b.rotate).toBeDefined();
		console.log(PieceType);
	    });
	});
    });

    describe('PieceFactory service', function() {
	it('should provide piece factory service', function() {
	    inject(function(PieceFactory) {
		console.log(PieceFactory);
	    });
	});
    });

});
