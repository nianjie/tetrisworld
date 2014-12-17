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
    '$firebase', 'Constants', 'PieceFactory', 
    function($firebase, Constants, PieceFactory) {
	var self = this;
	var player = 'player0', piece = 'piece';
	var playerRef = Constants.rootRef.child(player).child(piece);
	console.log(playerRef.toString());
	this.piece = $firebase(playerRef, {objectFactory: 'PieceFactory'}).$asObject();
	this.piece2 = $firebase(playerRef).$asObject();
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
