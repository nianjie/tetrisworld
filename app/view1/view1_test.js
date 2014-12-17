'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should load data from firebase with certain methods', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
	console.log(view1Ctrl.piece);
	expect(view1Ctrl.piece.drop).toBeDefined();
//	console.log(view1Ctrl.piece.x);
//	console.log(view1Ctrl.piece.$id);
	console.log(view1Ctrl.piece2);
	console.log(view1Ctrl.piece2.x);
    }));

  });
});
