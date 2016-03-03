(function(angular) {
	angular
		.module('shell')
		.controller('TabController', TabController);

	TabController.$inject = ['$scope', '$window', 'bluetoothService'];
	function TabController($scope, $window, bluetoothService) {
		var vm = this;

		vm.selectedIndex = 0;

		vm.enableBluetooth = function() {
			vm.selectedIndex = 2;
			$scope.$broadcast('enableBluetooth', {});
		};

		vm.scanDevices = function() {
			vm.selectedIndex = 2;
			$scope.$broadcast('scanDevices', {});
		};

		vm.checkConnection = function() {
			$scope.$broadcast('checkConnectionStatus', {});
		};

		vm.syncSettings = function() {
			$scope.$broadcast('syncSettings', {});
		};

		/*
		 * Check status of bluetooth once plug-in is detected
		 */
		var unbindWatcher = $scope.$watch(function() { 
			return $window.bluetoothSerial;
		}, 
		function(newValue, oldValue) {
			if (newValue !== undefined) {
				$scope.$broadcast('checkConnectionStatus', {});
				unbindWatcher();
			}
		});
	};
})(angular);
