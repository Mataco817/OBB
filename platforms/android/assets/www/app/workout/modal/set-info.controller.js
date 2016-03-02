(function(angular) {
	angular
		.module('workout')
		.controller('SetInformationController', SetInformationController);
	
	SetInformationController.$inject = ['$scope', '$mdDialog'];
	function SetInformationController($scope, $mdDialog) {
		var vm = this;
		
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
	};
})(angular);