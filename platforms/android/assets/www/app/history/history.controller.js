(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', '$timeout', '$mdDialog', 'config', 'mongodbService', 'utilService'];
	function HistoryController($scope, $timeout, $mdDialog, config, mongodbService, utilService) {
		var vm = this;
		
		/* PUBLIC VARS */
		vm.records = [];
		vm.selectedRecords = [];
		vm.sortingMethod = "-";

		vm.selectedOptionIndex = 2;
		vm.options = config.options;

		/* PUBLIC FUNCTIONS */
		vm.optionClick = optionClick;
		vm.showSetModal = showSetModal;
		vm.getOrderingMethod = getOrderingMethod;
		vm.showDayHeader = showDayHeader;
		
		vm.recordSelectChange = recordSelectChange;
		vm.getNumSelected = getNumSelected;
		vm.clearSelection = clearSelection;
		
		vm.isDayView = function() { return isView(config.DAY_VIEW); };
		vm.isMonthView = function() { return isView(config.MONTH_VIEW); };
		
		vm.confirmDelete = function(ev) {
		    var confirm = $mdDialog.confirm()
		          .title('Would you to delete these records?')
		          .textContent('This will remove these ' + vm.selectedRecords.length + ' records permanently.')
		          .ariaLabel('Delete Selected')
		          .targetEvent(ev)
		          .ok('Yes')
		          .cancel('cancel');
		    
		    $mdDialog.show(confirm).then(function() {
		    	deleteRecords(vm.selectedRecords, 0);
		    }, function() {
		    	//Cancelled 
		    });
		};
		
		/*
		 * Internal Methods
		 */
		
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
		
		function getOrderingMethod() {
			return [vm.sortingMethod + 'year', vm.sortingMethod + 'month', vm.sortingMethod + 'monthDay'];
		}
		
		function isView(viewTitle) {
			return vm.options[vm.selectedOptionIndex].title === viewTitle;
		}
		
		function showSetModal(record, index, $event) {
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
					vm.records[index] = updatedRecord;
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
		}
		
		function showDayHeader(element) {
			var sibling = vm.sortingMethod === "-" ? "$$prevSibling" : "$$nextSibling";
			
			if (element[sibling]) {
				var thisMoment = element.record.moment;
				var siblingMoment = element[sibling].record.moment;
				
				if (moment(thisMoment).isSame(siblingMoment, 'day')) {
					return false;
				}
			}
			
			return true;
		}
		
		function recordSelectChange(record, index) {
			if (record.selected) {
				vm.selectedRecords.push(index);
			}
			else {
				for (var i = 0; i < vm.selectedRecords.length; i++) {
					if (i === index) {
						vm.selectedRecords.splice(i, 1);
						break;
					}
				}
			}
		}
		
		function getNumSelected() {
			return Object.keys(vm.selectedRecords).length;
		}
		
		function clearSelection() {
			vm.selectingItems = false;
			
			for (var i = 0; i < vm.selectedRecords.length; i++) {
				vm.records[vm.selectedRecords[i]].selected = false;
			}
			
			vm.selectedRecords = [];
		}
		
		function deleteRecords(records, index) {
			if (index < records.length) {
				mongodbService.deleteRecord(vm.records[records[index]])
				.then(function() {
					index++;
					deleteRecords(records, keys, index);
				});
			}
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
				}

				vm.records = records;
			});
		}

		getMyRecords();
	};
})(angular);