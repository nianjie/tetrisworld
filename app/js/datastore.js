


var datastore= new function () {




/**
* @namespace Datastore
*/
var self= this;




/**
* @field
* @property {object}
*/
var data;

/**
* @field
* @property {object (function)}
*/
var eventHandlers;

/**
* @field
* @property {Firebase}
*/
var root;




/**
* @function
* @property {void} Initialises this namespace
*/
var init;

/**
* @function
* @property {Firebase}
* @param {string} id (Optional; current user by default)
*/
var user;




self.eventHandlers= {};
self.root= new Firebase('https://tetrisworld.firebaseio.com/');



self.init= function () {
    // 
    self.data= {
	activeGroup: null,
	group: {},
	ranking: {},
	lastPlayed: {
	    array: []
	},
	user: {},
	username: {}
    };
    
    self.data.user[authentication.userid]= {
	following: [],
	isOnline: true,
	board: {},
	playingState:tetris.PlayingState.Watching,
	username: authentication.username
    };

};

self.user = function(id) {
    id = (id || authentication.userid).toString();
    
    var user = self.root.child('user').child(id);

    user.groups = user.child('groups');
    user.group = function (id) {
	id = id.toString();
	return user.groups.child(id);
    };
    
    user.isOnline = user.child('isOnline');
    user.playingState = user.child('playingState');
    user.board = user.child('board');
};


};
