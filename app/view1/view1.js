'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'Game.Tetris'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    controllerAs: 'player0'
  });
}])

.controller('View1Ctrl', [
    'Piece', 
    function(Piece) {
	var self = this;
	var player = 'player0';
	this.piece = Piece(player);
	this.rotate = function() {
	    this.piece && this.piece.rotate();
	};
	this.drop = function() {
	    this.piece.drop();
	};
	this.moveLeft = function() {
	    this.piece.moveLeft();
	};
	this.moveRight = function() {
	    this.piece.moveRight();
	};
    }
]);
