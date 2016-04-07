(function(angular) {
	angular
		.module('history')
		.controller('HistoricSetController', HistoricSetController);
	
	HistoricSetController.$inject = ['$scope', '$window', '$mdDialog'];
	function HistoricSetController($scope, $window, $mdDialog) {
		var vm = this;
		
		vm.dateHeader = vm.record.moment.format("dddd, MMMM Do, h:mm:ss A");
		vm.keyboardVisible = false;
		
		vm.removeRep = removeRep;
		vm.close = closeModal;
		vm.updateRecord = updateRecord;

		/*
		 * Internal Methods
		 */
		function removeRep($index) {
			vm.record.velocities.splice($index, 1);
		}
		
		function closeModal() {
			$mdDialog.cancel();
		}
		
		function updateRecord() {
			$mdDialog.hide(vm.record);
		}
		
		$window.addEventListener('native.keyboardshow', keyboardShowHandler);
		$window.addEventListener('native.keyboardhide', keyboardHideHandler);
		
		function keyboardShowHandler(event) {		    
		    vm.keyboardVisible = true;
		}

		function keyboardHideHandler(event) {		    
		    vm.keyboardVisible = false;
		}
	};
})(angular);