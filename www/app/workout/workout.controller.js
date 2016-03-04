(function(angular) {
	angular
		.module('workout')
		.controller('WorkoutController', WorkoutController);
	
	WorkoutController.$inject = ['$scope', '$timeout', '$document', '$mdDialog', 'bluetoothService', 'settingsService'];
	function WorkoutController($scope, $timeout, $document, $mdDialog, bluetoothService, settingsService) {
		var vm = this;
		
//		vm.waiting = waitingForSet;
//		vm.waiting = checkBluetoothEnabled;
		vm.waiting = false;
		vm.ready = false;
		vm.getSets = getSets;
		vm.endSet = stopSimulation;
		vm.startSimulatedSet = startSimulatedSet;
		vm.units = getUnits;
		
		vm.enterSetInfo = enterSetInformation;
		
		vm.doRefresh = function() {
			console.log("Refreshing...");
			// Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		};
		
		/*
		 * Internal Methods
		 */
		var currentWorkout = {};
		currentWorkout.sets = [];
		
		var setInProgress = false;
		var lastExerciseName = '';
		var lastWeight = '';
		
		var maxRandLimit = 0.90;
		var minRandLimit = 0.10;
		
		function waitingForSet() {
//			vm.waiting = true;
//			checkBluetoothEnabled();
			return currentWorkout.sets.length === 0;
		}
		
		$scope.$on('checkConnectionStatus', function(params) {
			checkBluetoothEnabled();
			checkDeviceConnected();
		});
		
		/*
		 * Initial check if bluetooth enabled
		 */
		function checkBluetoothEnabled() {
//			vm.waiting = false;
//			checkingBluetooth = true;
			
			bluetoothService.isEnabled()
			.then(function(response) {
				vm.waiting = currentWorkout.sets.length === 0;
			},
			function(reason) {
				vm.waiting = false;
			});
		}
		
		function checkDeviceConnected() {
//			vm.ready = false;
			
//			bluetoothService.isConnected()
//			.then(function(response) {
//				vm.ready = true;
//			},
//			function(reason) {
//				console.log(reason);
//			});
		}
		
		function getUnits() {
			return settingsService.getSetting("units");
		}
		
		function getSets() {
			if (!waitingForSet()) {
				return currentWorkout.sets;
			}
		}
		
		function getCurrentSet() {
			if (!waitingForSet()) {
				return currentWorkout.sets[currentWorkout.sets.length - 1];
			}
		}
		
		function startSimulatedSet($last) {
			//TODO remove, just for testing
			if (vm.waiting) { vm.waiting = false; }
			
			if ($last === undefined || $last === true) {
				setInProgress = true;
				
				var setName = "Current Set"
				currentWorkout.sets.push({
					complete : false,
					exerciseName : setName,
					reps : []
				});
	
				getCurrentSet().reps.push({
					velocity : (minRandLimit + (Math.random() * (maxRandLimit - minRandLimit))).toFixed(2) 
				});
				simulateRep();
			}
		}
		
		function simulateRep() {
			if (getCurrentSet().reps.length < 5) {
				$timeout(function() {
					if (setInProgress) {
						getCurrentSet().reps.push({
							velocity : (minRandLimit + (Math.random() * (maxRandLimit - minRandLimit))).toFixed(2)
						});
						
						simulateRep();
					}
				}, 1000);
			}
		}
		
		function stopSimulation() {
			setInProgress = false;

			getCurrentSet().complete = true;
			getCurrentSet().rpe = 5;
			getCurrentSet().exerciseName = "Set " + currentWorkout.sets.length;
		}
		
		function enterSetInformation(set, $index, $event) {		
			$mdDialog.show({
				parent: angular.element(document.body),
	        	templateUrl: 'app/workout/modal/set-info-modal.tmpl.html',
	        	targetEvent: $event,
	        	clickOutsideToClose: false,
	        	autoWrap: false,
	        	controller: 'SetInformationController',
	        	controllerAs: 'setCtrl',
	        	locals: {
	        		set : set,
	        		exercisePlaceholder : lastExerciseName,
	        		weightPlaceholder : lastWeight
	        	},
	        	bindToController: true
	        })
	        .then(function() {
	        	lastExerciseName = set.exerciseName;
	        	lastWeight = set.weight;
	        }, function() {
	        	//You cancelled the dialog
	        });
		}
		
		/* Check bluetooth enabled once loaded */
		checkBluetoothEnabled();
		checkDeviceConnected();
	};
})(angular);