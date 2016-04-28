(function(angular) {
	angular
		.module('workout')
		.controller('WorkoutController', WorkoutController);
	
	WorkoutController.$inject = ['$scope', '$timeout', '$mdDialog', 'bluetoothService','rfduinoService', 'settingsService', 'mongodbService'];
	function WorkoutController($scope, $timeout, $mdDialog, bluetoothService, rfduinoService, settingsService, mongodbService) {
		var vm = this;
		
		vm.waiting = false;
		vm.ready = false;
		vm.getSets = getSets;
		vm.endSet = endSet;
		vm.units = getUnits;
		
		vm.enterSetInfo = enterSetInformation;
		vm.showIcon = showIcon;
		
		/*
		 * Internal Methods
		 */
		var currentWorkout = {};
		currentWorkout.sets = [];
		
		var currentSetTimeout = false;
		
		var setInProgress = false;
		var lastExerciseName = '';
		var lastWeight = '';
		
		$scope.$on('checkConnectionStatus', function(params) {
			checkBluetoothEnabled();
			checkDeviceConnected();
		});
		
		rfduinoService.subscribe($scope, onRfduinoStatusChange);
		
		function onRfduinoStatusChange() {
			
		}
		
		/*
		 * Initial check if bluetooth enabled
		 */
		function checkBluetoothEnabled() {			
			bluetoothService.isEnabled()
			.then(function(response) {
				vm.waiting = currentWorkout.sets.length === 0;
			},
			function(reason) {
				vm.waiting = false;
			});
		}
		
		function checkDeviceConnected() {
			rfduinoService.isConnected()
			.then(function(response) {
				vm.ready = true;
			},
			function(reason) {
				console.log(reason);
				vm.ready = false;
			});
		}
		
		function showIcon() {
			return vm.waiting === true || waitingForSet() === true;
		}
		
//		function checkTodayForWorkout() {
//			mongodbService.getTodaysRecords()
//			.then(function(records) {
//				console.log(records);
//			});
//		}
		
		function getUnits() {
			return settingsService.getSetting("units");
		}
		
		function waitingForSet() {
			return currentWorkout.sets.length === 0;
		}
		
		function getSets() {
//			if (!waitingForSet()) {
				return currentWorkout.sets;
//			}
		}
		
		function getCurrentSet() {
			if (!waitingForSet()) {
				return currentWorkout.sets[currentWorkout.sets.length - 1];
			}
		}
		
		/**
		 * @function onRepData - callback tied to rfduinoService onData readings from device
		 * @parameter repData - JSON object with rep information
		 * repData = {
		 * 		rep : int,
		 * 		rom : int
		 * 		avgVel : float,
		 * 		peakVel : float
		 * }
		 */
		function onRepData(repData) {
			$scope.$apply(function() {
				vm.waiting = false;
				
				if (!setInProgress) {
					setInProgress = true;
					
					currentWorkout.sets.push({
						time : new Date(),
						setNumber : currentWorkout.sets.length + 1,
						exerciseName : "Current Set",
						avgVelocities : []
					});
					
					/* Emit event to focus on this tab */
					$scope.$emit('focusTab', { index : 0 });
				}
				
				/* Reset callback timer to end set */
				if (currentSetTimeout) {
					$timeout.cancel(currentSetTimeout);
				}

				/* Set callback to end set after 30 seconds */
				currentSetTimeout = $timeout(function() {
					// If user has not ended set
					if (setInProgress) {
						endSet();
					}
				}, settingsService.getSetting("setTimeoutInMillis"));
			
				getCurrentSet().avgVelocities.push(repData.avgVel.toFixed(2));
			});
		}
		
		function endSet() {
			setInProgress = false;

			getCurrentSet().complete = true;
			getCurrentSet().rpe = 5;
			getCurrentSet().exerciseName = "Set " + currentWorkout.sets.length;
			
			saveToDatabase(getCurrentSet());
		}
		
		function saveToDatabase(setInfo) {
			var record = {
					user : "OB Test",
					set : setInfo.setNumber,
					time : setInfo.time,
					lift : setInfo.exerciseName,
					weight : setInfo.weight,
					velocities : setInfo.avgVelocities.toString(),
					rpe : setInfo.rpe
			};
			
			mongodbService.saveRecord(record)
			.then(function(data) {
				console.log(data);
			});
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
				
				saveToDatabase(set);
	        }, function() {
	        	//You cancelled the dialog
	        });
		}
		
		rfduinoService.setWorkoutCallback(onRepData);
		
		/* Check bluetooth enabled once loaded */
		checkBluetoothEnabled();
		checkDeviceConnected();
//		checkTodayForWorkout();
	};
})(angular);