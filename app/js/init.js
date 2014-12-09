/* init application code */
angular.module('TetrisWorld', ['firebase']);
angular.module('TetrisWorld')
    .value('rootURL', {
	url: "https://tetrisworld.firebaseio.com/"
    });
authentication.init();
//tetris.init();
controllers.init();
//datastore.init();

