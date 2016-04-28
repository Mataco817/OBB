/*
 * This is for setting up application wide configurations
 * I theme the colors for the app here using the Material Design $mdThemingProvider
 */
(function(angular){
	angular.module('appConfig', [])
	.config(['$mdThemingProvider', function($mdThemingProvider) {
		// Set the application color scheme
		$mdThemingProvider.theme('default')
	    .primaryPalette('blue')
	    .accentPalette('yellow', {
	    	'default' : '500',
	    	'hue-1' : 'A700'
	    })
	    .backgroundPalette('grey', {
	    	'default' : '200',
	    	'hue-1' : '500',
	    	'hue-2' : '600',
	    	'hue-3' : '800'
	    });
	    
	    $mdThemingProvider.theme('docs-dark')
		.primaryPalette('grey', {
			'default' : '800',
			'hue-1': '50'
		})
		.dark();
	}])
	
	.config(['$ionicConfigProvider', function($ionicConfigProvider) {
		$ionicConfigProvider.views.transition("android");
	}]);	
})(angular);