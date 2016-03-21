(function(angular) {
	angular.module('openbarbell').run(runBlock);
	
	runBlock.$inject = ['settingsService', 'databaseService'];
	function runBlock(settingsService, databaseService) {
//		settingsService.initializeSettings();
//		databaseService.initializeDatabase();
	};
})(angular);