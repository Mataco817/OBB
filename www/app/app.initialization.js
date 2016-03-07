(function(angular) {
	angular.module('openbarbell').run(runBlock);
	
	runBlock.$inject = ['settingsService'];
	function runBlock(settingsService) {
//		settingsService.initializeSettings();
	};
})(angular);