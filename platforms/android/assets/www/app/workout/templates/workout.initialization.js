(function(angular) {
	angular
		.module('workout')
		.run(runBlock);
	
	runBlock.$inject = ['$scope', '$timeout', '$document', '$mdDialog', 'bluetoothService', 'settingsService'];
	function runBlock($scope, $timeout, $document, $mdDialog, bluetoothService, settingsService) {
	};
})(angular);