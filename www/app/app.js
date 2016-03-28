// angular.module is a global place for creating, registering and retrieving Angular modules
// 'openbarbell' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'required' modules
angular.module('openbarbell', [
	'ngMaterial',
	'ngMessages',
	'ionic',
	'appConfig',
	'appRoutes',
	'shell',
	'setup',
	'workout',
	'history',
	'settings',
	/* Services */
	'bluetooth-service', 'rfduino-service', 'settings-service', 'database-service', 'mongodb-service'
]);

//.run(function($ionicPlatform) {
//	$ionicPlatform.ready(function() {
//		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//		// for form inputs)
//
//		// This is where we could setup initial plug-in settings
//		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//			cordova.plugins.Keyboard.disableScroll(true);
//		}
//		if (window.StatusBar) {
//			// org.apache.cordova.statusbar required
//			StatusBar.styleDefault();
//		}
//	});
//});
