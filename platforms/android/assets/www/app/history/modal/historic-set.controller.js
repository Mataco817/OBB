(function(angular) {
	angular
		.module('history')
		.controller('HistoricSetController', HistoricSetController);
	
	HistoricSetController.$inject = ['$scope', '$window', '$mdDialog'];
	function HistoricSetController($scope, $window, $mdDialog) {
		var vm = this;
		vm.keyboardVisible = false;
		
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