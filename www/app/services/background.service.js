(function(angular){
	angular.module('openbarbell')
	.service('bgService', bgService);

	bgService.$inject = [];
	function bgService() {
		var service = {
			init : initialize
		};
		
		return service;
		
		function initialize() {
		    // Android customization
		    // To indicate that the app is executing tasks in background and being paused would disrupt the user.
		    // The plug-in has to create a notification while in background - like a download progress bar.
//		    cordova.plugins.backgroundMode.setDefaults({ 
//		        title:  'OpenBarbell',
//		        text:   'Device is listening.'
//		    });

		    // Called when background mode has been activated
		    cordova.plugins.backgroundMode.onactivate = backgroundThread;
		}

		function backgroundThread() {
			if (cordova.plugins.backgroundMode.isEnabled()) {
				setTimeout(function() {
		        	backgroundThread();
				}, 10000);
			}
		}
	};
})(angular);