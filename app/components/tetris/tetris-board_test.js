'use strict';

describe('Game.Tetris.Board module', function() {
    beforeEach(module('Game.Tetris'));

    describe('BoardFactory service', function() {
	it('should provide a function which is used to render board data by $firebase', function() {
	    inject(function(BoardFactory) {
		expect(typeof BoardFactory).toBe("function");
		expect(BoardFactory.prototype.draw).toBeDefined();
		expect(BoardFactory.prototype.$$updated).toBeDefined();
	    });
	});

    });

    describe('Board service', function() {
	var canvas = {
	    clearRect: function() {
		console.log("clearRect(" + arguments + ") invoked on dummy canvas.");
	    },
	    getContext: function() {
		console.log("getContext(" + arguments + ") invoked on dummy canvas.");
	    }
	};

	it('should render board data as an object with perfect methods', function() {
	    inject(function(Board) {
		var b1 = Board(canvas, 'player0');
		expect(b1.$id).toBe('board');
	    });
	});
    });

});
