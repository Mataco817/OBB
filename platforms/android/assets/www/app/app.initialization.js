(function(angular) {
	angular.module('openbarbell').run(runBlock);
	
	runBlock.$inject = ['bgService', 'settingsService', 'rfduinoService', 'databaseService', '$state', '$rootScope'];
	function runBlock(bgService, settingsService, rfduinoService, databaseService, $state, $rootScope) {
		
//		settingsService.initializeSettings()
//		.then(function() {
//			if(settingsService.getSetting("initialSetupComplete")) {
//				$state.go('tab');
//			}
//			else {
//				$state.go('tab.setup');
//			}
//		});

//		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
//			if (toState.name === "tab" && !settingsService.getSetting("initialSetupComplete")) {
//				event.preventDefault();
//				
//				if (fromState.name !== "tab.setup") {
//					$state.go('tab.setup');
//				}
//			}
//			else if (toState.name === "tab" && settingsService.getSetting("initialSetupComplete")) {
//				event.preventDefault();
//				
//				if (fromState.name !== "tab.setup") {
//					$state.go('tab.setup');
//				}
//			}
//		});
//		
//		window.addEventListener('native.keyboardshow', keyboardShowHandler);
//		window.addEventListener('native.keyboardhide', keyboardHideHandler);
//
//		function keyboardShowHandler(event) {
//			$('.md-dialog-container').css({
//				"margin-bottom" : event.keyboardHeight.toString() + "px"
//			});
//		}
//
//		function keyboardHideHandler(event) {
//			$('.md-dialog-container').css({
//				"margin-bottom" : "0px"
//			});
//		}
		
		// Run when the device is ready
		document.addEventListener('deviceready', function () {
			document.addEventListener("pause", onPause, false);
			document.addEventListener("resume", onResume, false);

		    new FastClick(document.body);
		    
			settingsService.init()
			.then(function() {
				rfduinoService.init()
				.then(function(response) {
					$rootScope.$broadcast('checkConnectionStatus', {});
					$state.go('tab');					
				},
				function(error) {
					$state.go('tab');					
				});
			});
			
			bgService.init();
		}, false);
		
		// Handle the pause event
		function onPause() {
		    // Enable background mode if device is connected.
			rfduinoService.isConnected()
			.then(function() {
				cordova.plugins.backgroundMode.enable();
			});
		}

		// Handle the resume event
		function onResume() {
			$rootScope.$broadcast('checkConnectionStatus', {});
		    // Disable background mode
		    if (cordova.plugins.backgroundMode.isEnabled()) {
		    	cordova.plugins.backgroundMode.disable();
		    }
		}
	};
})(angular);