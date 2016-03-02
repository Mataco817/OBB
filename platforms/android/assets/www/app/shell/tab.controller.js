(function(angular) {
	angular
		.module('shell')
		.controller('TabController', TabController);
	
	TabController.$inject = ['$scope'];
	function TabController($scope) {
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
	};
})(angular);