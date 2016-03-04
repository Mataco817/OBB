(function(angular) {
	angular
		.module('shell')
		.controller('TabController', TabController);

	TabController.$inject = ['$scope', '$window', '$document', 'bluetoothService'];
	function TabController($scope, $window, $document, bluetoothService) {
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

		/****************** Cordova Events ******************/
		
		// Check status of bluetooth once plug-in is detected
		var unbindWatcher = $scope.$watch(function() { 
			return $window.bluetoothSerial;
		}, 
		function(newValue, oldValue) {
			if (newValue !== undefined) {
				$scope.$broadcast('checkConnectionStatus', {});
				unbindWatcher();
			}
		});
		
		// Check status of bluetooth when app resumed
		$document[0].addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			$document[0].addEventListener("pause", onPause, false);
			$document[0].addEventListener("resume", onResume, false);
		}
		
		// Handle the pause event
		function onPause() {
			
		}
		
		// Handle the resume event
		function onResume() {
			$scope.$broadcast('checkConnectionStatus', {});
		}
	};
})(angular);
