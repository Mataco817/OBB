(function(angular) {
	angular.module('openbarbell').run(runBlock);
	
	runBlock.$inject = ['settingsService', 'databaseService', '$state', '$rootScope'];
	function runBlock(settingsService, databaseService, $state, $rootScope) {
		
		settingsService.initializeSettings()
		.then(function() {
//			if(settingsService.getSetting("initialSetupComplete")) {
				$state.go('tab');
//			}
//			else {
//				$state.go('tab.setup');
//			}
		});

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
		
		window.addEventListener('load', function() {
		    new FastClick(document.body);
		}, false);
	};
})(angular);