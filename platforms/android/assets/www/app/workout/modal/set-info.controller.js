(function(angular) {
	angular
		.module('workout')
		.controller('SetInformationController', SetInformationController);
	
	SetInformationController.$inject = ['$scope', '$window', '$mdDialog'];
	function SetInformationController($scope, $window, $mdDialog) {
		var vm = this;
		vm.keyboardVisible = false;
		
		if (vm.set.infoEntered) {
			$scope.exerciseName = vm.set.exerciseName ? vm.set.exerciseName : '';
			$scope.weight = vm.set.weight ? vm.set.weight : '';
		}
		
		vm.reduceRPE = function() {
			vm.set.rpe--;
			$scope.rpeTouched = true;
		};
		
		vm.increaseRPE = function() {
			vm.set.rpe++;
			$scope.rpeTouched = true;
		};
		
		vm.enterSetInfo = function() {
			vm.set.infoEntered = true;
			if ($scope.setInfo.$dirty) {
				vm.set.exerciseName = $scope.setInfo.exercise.$dirty ? $scope.exerciseName : vm.exercisePlaceholder;
				vm.set.weight = $scope.setInfo.weight.$dirty ? $scope.weight : vm.weightPlaceholder;
			}
			else {
				vm.set.weight = vm.weightPlaceholder;
				vm.set.exerciseName = vm.exercisePlaceholder;
			}
			
			$mdDialog.hide();
		};
		
//		$window.addEventListener('native.keyboardshow', keyboardShowHandler);
//		$window.addEventListener('native.keyboardhide', keyboardHideHandler);
//
//		function keyboardShowHandler(event) {		    
//		    vm.keyboardVisible = true;
//		}
//
//		function keyboardHideHandler(event) {		    
//		    vm.keyboardVisible = false;
//		}
	};
})(angular);