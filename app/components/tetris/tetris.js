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

    return self;
}()
);
