'use strict';

var myDebug = {};
myDebug.firebase = {

    injector: function() {
	var $injector = angular.injector(['ng', 'firebase']);
	return $injector;
    },

    di: function(diName) {
	return this.injector().get(diName);
    },

    $fire: function() {
	return this.di('$firebase');
    },

    $fireUtil: function() {
	return this.di('$firebaseUtils');
    },
    
    syncObj: function(ref) {
	try {
	    this.$fireUtil().assertValidRef(ref);
	} catch (error) {
	    ref = new Firebase(ref);
	}
	return this.$fire(ref).$asObject();
    },

    syncArry : function(ref) {
	try {
	    this.$fireUtil().assertValidRef(ref);
	} catch (error) {
	    ref = new Firebase(ref);
	}
	return this.$fire(ref).$asArray();
    },
    _defIsEnd : true
};
