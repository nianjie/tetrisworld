'use strict';

var myDebug = {};
myDebug.firebase = {

    injector: function() {
	var $injector = angular.injector(['ng', 'firebaes']);
	return $injector;
    },

    di: function(diName) {
	return injector().get(diName);
    },

    $fire: function() {
	return di('$firebase');
    },

    $fireUtil: function() {
	return di('$firebaseUtils');
    },
    
    syncObj: function(ref) {
	try {
	    $fireUtil().assertValidRef(ref);
	} catch (error) {
	    ref = new Firebase(ref);
	}
	return $fire(ref).$asObject();
    },

    syncArry : function(ref) {
	try {
	    $fireUtil().assertValidRef(ref);
	} catch (error) {
	    ref = new Firebase(ref);
	}
	return $fire(ref).$asArray();
    },
    _defIsEnd : true
};
