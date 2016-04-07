(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', '$timeout', '$document', '$mdDialog', 'databaseService', 'mongodbService', 'utilService'];
	function HistoryController($scope, $timeout, $document, $mdDialog, databaseService, mongodbService, utilService) {
		var vm = this;
		var MONTH_VIEW = 'Month View';
		var DAY_VIEW = 'Day View';
		
		vm.contentCSS = {
			    "position": "absolute",
			    "top": "56px",
			    "bottom": "0px",
			    "left": "0px",
			    "right": "0px"
		};
		
		vm.records = [];
		vm.sortingMethod = "-";

		vm.selectedOptionIndex = 2;
		vm.optionClick = optionClick;
		vm.options = [{
			title : 'Select...',
			icon : 'img/icons/check_circle.svg'
		},{
			title : 'Comfy View',
			icon : 'img/icons/comfy_view.svg'
		},{
			title : 'Day View',
			icon : 'img/icons/day_view.svg'
		},{
			title : 'Month View',
			icon : 'img/icons/month_view.svg'
		},{
			title : 'Year View',
			icon : 'img/icons/year_view.svg'
		}];
		
		vm.showSetInfo = showSetModal;
		vm.getOrderingMethod = getOrderMethod;
		
		vm.isDayView = function() { return isView(DAY_VIEW); };
		vm.isMonthView = function() { return isView(MONTH_VIEW); };
		
		var offset = 0;
		vm.applyClearFix = function(test) {
			if (isView(MONTH_VIEW)) {
				if (test.$parent.$first) {
					offset = test.$parent.monthDayRecord.items.length;
					return test.$index % 6 === 0;
				}
				else {
					var clearRow = (test.$index + offset) % 6 === 0;
					
					if (test.$last) {
						offset += test.$parent.monthDayRecord.items.length;
					}
					
					return clearRow;
				}
			}
			else if (isView(DAY_VIEW)) {
				return test.$index % 4 === 0;
			}
		};
		
		vm.isNewRow = function(monthDayRecord) {
			if (isView(MONTH_VIEW)) {
				return ((offset % 6 === 0) && (monthDayRecord.items.length % 6 === 0));
			}
			else {
				return true;
			}
		};
		
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
		
		function optionClick(index) {
			$timeout(function() {
				vm.selectedOptionIndex = index;
			}, 500);
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
				updateDatabase(updatedRecord);
	        }, function() {
	        	//You cancelled the dialog
	        });
		}
		
		function updateDatabase(setInfo) {
			var record = {
					user : "OB Test",
					set : setInfo.setNumber,
					time : setInfo.time,
					lift : setInfo.lift,
					weight : setInfo.weight,
					velocities : setInfo.velocities.toString(),
					rpe : setInfo.RPE
			};
			
			mongodbService.saveRecord(record)
			.then(function(data) {
				console.log(data);
			});
		}
		
		function getMyRecords() {
			mongodbService.getAllRecords()
			.then(function(records) {
				var tempArray = [];
				var todayArray = [];
				for (var i = 0; i < records.length; i++) {
//					if (records[i].name === "OB Test") {
//						var dateStr = records[i].date;
//						var m = moment(dateStr, "YYYY:MM:DD:HH:mm:ss", true);
//						records[i].day = utilService.getDays()[m.day()];
//						records[i].month = utilService.getMonths()[m.month()];
//						records[i].monthDay = m.date();
//						records[i].year = m.year();
//						records[i].moment = m;
//
//						records[i].weight = parseInt(records[i].weight);
//						records[i].RPE = parseInt(records[i].RPE);
//						
//						tempArray.push(records[i]);
//					}

					var timeObj = new Date(records[i].time);
					var m = moment(timeObj);
					records[i].day = utilService.getDays()[m.day()];
					records[i].month = utilService.getMonths()[m.month()];
					records[i].monthDay = m.date();
					records[i].year = m.year();
					records[i].moment = m;

					records[i].weight = parseInt(records[i].weight);
					records[i].RPE = parseInt(records[i].RPE);
					tempArray.push(records[i]);
				}
				
//				vm.records = records;
				vm.records = tempArray;
			});
		}

		getMyRecords();
	};
})(angular);