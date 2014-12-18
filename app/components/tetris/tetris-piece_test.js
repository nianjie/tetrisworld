'use strict';

describe('Game.Tetris.Piece module', function() {
    beforeEach(module('Game.Tetris'));

/*
    describe('PieceType service', function() {
	it('should provide type of PieceType', function() {
	    inject(function(PieceType) {
		var a = new PieceType(1,2,3,4), b = new PieceType(5,6,7,8);
		expect(a.pieceNum).toBe(1);
		expect(b.pieceNum).toBe(5);
		expect(a.drop).toBeDefined();
		expect(b.rotate).toBeDefined();
	    });
	});
    });
*/
    describe('PieceFactory service', function() {
	it('should provide a function which is used to render piece data by $firebase', function() {
	    inject(function(PieceFactory) {
		expect(typeof PieceFactory).toBe("function");
		expect(PieceFactory.prototype.drop).toBeDefined();
		expect(PieceFactory.prototype.rotate).toBeDefined();
		expect(PieceFactory.prototype.moveLeft).toBeDefined();
		expect(PieceFactory.prototype.moveRight).toBeDefined();
	    });
	});
    });

    describe('Piece service', function() {
	it('should provide a function that renders piece data for a certain player', function() {
	    inject(function(Piece) {
		var p1 = Piece('player0');
		expect(p1.$id).toBe('piece');
	    });
	});
    });

});
