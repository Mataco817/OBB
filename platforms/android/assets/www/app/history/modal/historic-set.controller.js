(function(angular) {
	angular
		.module('history')
		.controller('HistoricSetController', HistoricSetController);
	
	HistoricSetController.$inject = ['$scope', '$window', '$mdDialog', '$mdToast'];
	function HistoricSetController($scope, $window, $mdDialog, $mdToast) {
		var vm = this;
		
		vm.dateHeader = vm.record.moment.format("dddd, MMMM Do, h:mm:ss A");
		vm.keyboardVisible = false;
		
		vm.removeRep = removeRep;
		vm.addRep = addRep;
		vm.close = closeModal;
		vm.updateRecord = updateRecord;

		/*
		 * Internal Methods
		 */
		var removedRep;
		function removeRep($index, $event) {
			removedRep = vm.record.rep.splice($index, 1)[0];
			
			for (var i = $index; i < vm.record.rep.length; i++) {
				vm.record.rep[i].n--;
			}
			
			showActionToast($index);
		}
		 
		function showActionToast($index) {
//			var pinTo = $scope.getToastPosition();
			var toast = $mdToast.simple() 
			.textContent('Rep velocity removed')
			.action('UNDO')
			.highlightAction(true)
			.position("top right");
			
			$mdToast.show(toast)
			.then(function(response) {
				if (response === 'ok') {
					vm.record.rep.splice($index, 0, removedRep);
					
					for (var i = $index + 1; i < vm.record.rep.length; i++) {
						vm.record.rep[i].n++;
					}
				}
			});
		}
		
		function addRep() {
			vm.record.rep.push({
				n: vm.record.rep.length + 1,
				velocity : vm.newVelocity
			});
			
			delete vm.newVelocity;
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