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

});
