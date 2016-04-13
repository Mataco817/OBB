(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', '$timeout', '$mdDialog', 'databaseService', 'mongodbService', 'utilService'];
	function HistoryController($scope, $timeout, $mdDialog, databaseService, mongodbService, utilService) {
		var vm = this;
		var MONTH_VIEW = 'Month View';
		var DAY_VIEW = 'Day View';
		
		vm.records = [];
		vm.sortingMethod = "-";

		vm.selectedOptionIndex = 2;
		vm.optionClick = optionClick;
		vm.options = [{
			title : 'Select...',
			icon : 'img/icons/check_circle.svg'
		},{
			title : 'Comfy View',
			icon : 'img/icons/comfy_view.svg',
			disabled : true
		},{
			title : 'Day View',
			icon : 'img/icons/day_view.svg'
		},{
			title : 'Month View',
			icon : 'img/icons/month_view.svg',
			disabled : true
		},{
			title : 'Year View',
			icon : 'img/icons/year_view.svg',
			disabled : true
		}];
		
		vm.showSetInfo = showSetModal;
		vm.getOrderingMethod = getOrderMethod;
		
		vm.isDayView = function() { return isView(DAY_VIEW); };
		vm.isMonthView = function() { return isView(MONTH_VIEW); };
		
		vm.selectedRecords = {};
		vm.recordSelectChange = function(record, index) {
			if (record.selected) {
				vm.selectedRecords[index] = record;
			}
			else {
				delete vm.selectedRecords[index];
			}
		};
		
		vm.getNumSelected = function() {
			return Object.keys(vm.selectedRecords).length;
		};
		
		vm.clearSelection = function() {
			vm.selectingItems = false;
			
			var keys = Object.keys(vm.selectedRecords);
			for (var i = 0; i < keys.length; i++) {
				vm.selectedRecords[keys[i]].selected = false;
			}
			
			vm.selectedRecords = {};
		};
		
		vm.confirmDelete = function(ev) {

		    // Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.confirm()
		          .title('Would you like to delete your debt?')
		          .textContent('All of the banks have agreed to forgive you your debts.')
		          .ariaLabel('Lucky day')
		          .targetEvent(ev)
		          .ok('Please do it!')
		          .cancel('Sounds like a scam');
		    $mdDialog.show(confirm).then(function() {
//		      $scope.status = 'You decided to get rid of your debt.';
				var keys = Object.keys(vm.selectedRecords);
		    	deleteRecords(vm.selectedRecords, keys, 0);
//		    	for (var i = 0; i < vm.selectedRecords.length; i++) {
//		    		
//		    	}
		    }, function() {
//		      $scope.status = 'You decided to keep your debt.';
		    });
		};
		
		function deleteRecords(records, keys, index) {
			if (index < keys.length) {
				mongodbService.deleteRecord(records[keys[index]])
				.then(function() {
				
					index++;
					deleteRecords(records, keys, index);
				});
			}
		}
		
		/*
		 * This will set the height of the content area relative to the amount
		 * of the shrinking toolbar is shown/hidden
		 * DISABLED for now, shrinking may not be needed
		 */
		/*		
		vm.contentCSS = {
			"height" : "calc(100vh - 96px)"
		};
		
		var content = angular.element(document.getElementById('history-content'));
		$scope.$watch(function watchContent(scope) {
			return content[0].style["transform"];
		},
		function(newVal, oldVal) {				
			var transformString = newVal;
			var transformStringArray = transformString.split(" ");
			var transformY = parseInt(transformStringArray[1]);
			var heightOffset = 96 - (24 - transformY);
			
			vm.contentCSS["height"] = "calc(100vh - " + heightOffset.toString() + "px)";
		});
		 */
		
		/*
		 * Internal Methods
		 */		
//		$scope.$watch(function watchSelecting() {
//			return vm.selectingItems;
//		},
//		function(newValue, oldValue) {
//			if (newValue === false) {
//				var keys = Object.keys(vm.selectedRecords)
//			}
//		});
//		$scope.$watch(function watchSorting(scope) {
//			return vm.sortingMethod;
//		},
//		function(newVal, oldVal) {
//			$window.clearTimeout(vm.timer);
//			vm.timer = $window.setTimeout(rearrange, 100);
//		});
//		
//		$scope.$watch(function watchGrouping(scope) {
//			return vm.selectedOptionIndex;
//		},
//		function(newVal, oldVal) {
//			$window.clearTimeout(vm.timer);
//			vm.timer = $window.setTimeout(rearrange, 100);
//		});
		
		function optionClick(index) {
			if (index === 0) {
				vm.selectingItems = true;
			}
			else {
				$timeout(function() {
					vm.selectedOptionIndex = index;
				}, 500);
			}
		}
		
		function getOrderMethod() {
			return [vm.sortingMethod + 'year', vm.sortingMethod + 'month', vm.sortingMethod + 'monthDay'];
		}
		
		function isView(viewTitle) {
			return vm.options[vm.selectedOptionIndex].title === viewTitle;
		}
		
		function showSetModal(record, $event) {
			var recordCopy = angular.copy(record);
			$mdDialog.show({
				parent: angular.element(document.body),
	        	templateUrl: 'app/history/modal/historic-set-modal.tmpl.html',
	        	targetEvent: $event,
	        	clickOutsideToClose: true,
	        	autoWrap: false,
	        	controller: 'HistoricSetController',
	        	controllerAs: 'historicSetCtrl',
	        	locals: {
	        		record : recordCopy
	        	},
	        	bindToController: true
	        })
	        .then(function(updatedRecord) {
				updateDatabase(record, updatedRecord)
				.then(function() {
					record = updatedRecord;
					for (var i = 0; i < vm.records.length; i++) {
						if (updatedRecord.year === vm.records[i].year) {
							for (var x = 0; x < vm.records[i].months.length; x++) {
								if (vm.records[i].months[x].monthNumber === updatedRecord.monthNumber) {
									for (var y = 0; y < vm.records[i].months[x].days.length; y++) {
										if (vm.records[i].months[x].days[y].dayNumber === updatedRecord.monthDay) {
											for (var w = 0; w < vm.records[i].months[x].days[y].records.length; w++) {
												if (vm.records[i].months[x].days[y].records[w].time === updatedRecord.time) {
													vm.records[i].months[x].days[y].records[w] = updatedRecord;
												}
											}
										}
									}
								}
							}
						}
					}
				});
	        }, function() {
	        	//You cancelled the dialog
	        });
		}
		
		function updateDatabase(original, updated) {
			var velocities = [];
			for (var i = 0; i < updated.rep.length; i++) {
				velocities.push(updated.rep[i].velocity);
			}
			
			var record = {
					user : "OB Test",
					set : updated.set,
					time : updated.time,
					lift : updated.lift,
					weight : updated.weight,
					velocities : velocities,
					rpe : updated.RPE
			};
			
			return mongodbService.saveRecord(record);
//			.then(function(data) {
//				console.log(data);
//				original = updated;
//			});
		}
		
		function getMyRecords() {
			mongodbService.getAllRecords()
			.then(function(records) {
				var years = [];
				var yearIndexes = {};
				
				for (var i = 0; i < records.length; i++) {
					var timeObj = new Date(records[i].time);
					var m = moment(timeObj);
					records[i].dateObj = timeObj;
					records[i].day = utilService.getDays()[m.day()];
					records[i].month = utilService.getMonths()[m.month()];
					records[i].monthNumber = m.month();
					records[i].monthDay = m.date();
					records[i].year = m.year();
					records[i].moment = m;

					records[i].weight = parseInt(records[i].weight);
					records[i].RPE = parseInt(records[i].RPE);
					
					if (!yearIndexes[records[i].year]) {
						years.push({
							year : records[i].year,
							months : []
						});
						
						yearIndexes[records[i].year] = {
								yearIndex : years.length - 1,
								monthIndexes : {}
						};
					}
					
					if (!yearIndexes[records[i].year].monthIndexes[records[i].monthNumber]) {
						var yearIndex = yearIndexes[records[i].year].yearIndex;
						years[yearIndex].months.push({
							monthNumber : records[i].monthNumber,
							month : records[i].month,
							days : []
						});
						
						yearIndexes[records[i].year].monthIndexes[records[i].monthNumber] = {
								monthIndex : years[yearIndex].months.length - 1,
								dayIndexes : {}
						};
					}
					
					if (!yearIndexes[records[i].year].monthIndexes[records[i].monthNumber].dayIndexes[records[i].monthDay]) {
						var yearIndex = yearIndexes[records[i].year].yearIndex;
						var monthIndex = yearIndexes[records[i].year].monthIndexes[records[i].monthNumber].monthIndex;
						years[yearIndex].months[monthIndex].days.push({
							dayNumber : records[i].monthDay,
							day : records[i].day,
							records : []
						});
						
						yearIndexes[records[i].year].monthIndexes[records[i].monthNumber].dayIndexes[records[i].monthDay] = {
								dayIndex : years[yearIndex].months[monthIndex].days.length - 1,
								recordIndexes : {}
						};
					}

					var yearIndex = yearIndexes[records[i].year].yearIndex;
					var monthIndex = yearIndexes[records[i].year].monthIndexes[records[i].monthNumber].monthIndex;
					var dayIndex = yearIndexes[records[i].year].monthIndexes[records[i].monthNumber].dayIndexes[records[i].monthDay].dayIndex;
					years[yearIndex].months[monthIndex].days[dayIndex].records.push(records[i]);
				}

				vm.records = years;
			});
		}

		getMyRecords();
	};
})(angular);