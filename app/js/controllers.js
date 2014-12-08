


var controllers= new function () {



/**
* @namespace Controllers
*/
var self= this;




/**
* @function
* @property {void} Initialises this namespace
*/
var init;




self.init= function () {

    var myapp = angular.module('myapp', ['TetrisWorld']);

    // for more information see ~/github/coursera.startup/pj/Firebase/test4.html
    myapp.controller('LoginController', function ($scope, auth) {
	var propName = auth.init();

	function usernameToEmail (username) {
	    return '{0}@firebase.com'.replace(/\{0\}/, username);
	};

	function emailToUserName (email) {
	    return email.split('@')[0];
	};

	function clear(prop) { // it does not work the way which was supposed to make the object referred by the argument empty , as the reference is passed by value so the assignment to is assigning a reference of object to another value of reference. Btw, there is no type of reference similar to C++ in JavaScript. So an assignment directly made to an arugment does not take effect on the one passed in.
	    prop = {};
	};

        $scope.$watch(propName, function(newState, oldState ) {
            if (newState === oldState) { // no change
                return; 
            }
            if (!oldState && newState) { // login
		if (newState.error) {
		    $scope.error = {code: newState.error.code, msg: newState.error.msg};
		    return;
		}
                $scope.user = {name: emailToUserName(newState.email), id: newState.id, session: newState.sessionKey};
		delete $scope.login
                return;
            }
            if (!newState && oldState) { // logout
                delete $scope.user;
		delete $scope.login;
                return;
            }
        });
        
        $scope.createUser = function(uname, upwd) {
            auth.createUser(uname, upwd);
        };

        $scope.logout = function () {
            auth.logout();
        };

        $scope.loginFn = function (uname, upwd) {
            auth.login(uname, upwd);
        };
    });

    
    
};





};
