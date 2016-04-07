(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', '$timeout', '$rootScope', '$window', '$document', '$mdDialog', 'databaseService', 'mongodbService', 'utilService'];
	function HistoryController($scope, $timeout, $rootScope, $window, $document, $mdDialog, databaseService, mongodbService, utilService) {
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
					offset = test.$parent.dayObj.records.length;
					return test.$index % 6 === 0;
				}
				else {
					var clearRow = (test.$index + offset) % 6 === 0;
					
					if (test.$last) {
						offset += test.$parent.dayObj.records.length;
					}
					
					return clearRow;
				}
			}
			else if (isView(DAY_VIEW)) {
				return test.$index % 4 === 0;
			}
		};
		
		vm.isNewRow = function(dayObj) {
			if (isView(MONTH_VIEW)) {
				return ((offset % 6 === 0) && (dayObj.records.length % 6 === 0));
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
		
		vm.timer = 0;
		$rootScope.currItemIndex = 0;
		
		$scope.$watch(function watchSorting(scope) {
			return vm.sortingMethod;
		},
		function(newVal, oldVal) {
			$window.clearTimeout(vm.timer);
			vm.timer = $window.setTimeout(rearrange, 100);
		});
		
		$scope.$watch(function watchGrouping(scope) {
			return vm.selectedOptionIndex;
		},
		function(newVal, oldVal) {
			$window.clearTimeout(vm.timer);
			vm.timer = $window.setTimeout(rearrange, 100);
		});
		
		var lastWidth = -1;
		var lastDay = -1;
		var headerCount = 0;		
		var indexOffset = 0;

		var HEADER_SPACE = 63;
		var ELEMENTS_PER_ROW = 0;
		var ELEMENT_SIZE_WITH_PADDING = 108;
		var HISTORY_CARD_WIDTH = 100;
		var EXTRA_SPACE = 0;
		var EXTRA_ELEMENT_WIDTH = 0;
		
		var lastHeadersChildren = 0;
		var rowsAbove = 0;
		function rearrange() {
			var toolbarHeight = $('#history-toolbar').css("height");
			vm.contentCSS["top"] = toolbarHeight;
			
			$('.history-card')
			.each(function(idx, el){
				if (idx === 0) {
					headerCount = 0;
					indexOffset = 0;
					lastDay = -1;
				}
				
				var $el = $(el);
				var elementID = $el.attr("id");
				var elementInfo = getElementInfo(elementID);
				
				var newRow = false;
				if (elementInfo.day !== lastDay && elementInfo.index === 0) {
					lastDay = elementInfo.day;
					headerCount++;
					newRow = true;
				}
				
				var widthAvailable = el.parentElement.clientWidth;
				
				if (lastWidth !== widthAvailable) {
					lastWidth = widthAvailable;
					
					/* Reset variables to match new window width */
					ELEMENTS_PER_ROW = parseInt(widthAvailable / ELEMENT_SIZE_WITH_PADDING);
					EXTRA_SPACE = widthAvailable - (ELEMENT_SIZE_WITH_PADDING * ELEMENTS_PER_ROW);
					EXTRA_ELEMENT_WIDTH = parseInt(EXTRA_SPACE / ELEMENTS_PER_ROW);
					
					/* window will resize while DOM is loading, call rearrange again */
					$window.clearTimeout(vm.timer);
					vm.timer = $window.setTimeout(rearrange, 100);
				}
				
				if (newRow) {
					rowReset = (idx + indexOffset) % ELEMENTS_PER_ROW;
					if (idx !== 0 && rowReset !== 0) {
						indexOffset += (ELEMENTS_PER_ROW - rowReset);
					}
				}
				
				var newTop = parseInt((idx + indexOffset) / ELEMENTS_PER_ROW) * ELEMENT_SIZE_WITH_PADDING;
				var newLeft = ((idx + indexOffset) % ELEMENTS_PER_ROW) * (ELEMENT_SIZE_WITH_PADDING + EXTRA_ELEMENT_WIDTH);

				$el.css({
					'width': HISTORY_CARD_WIDTH + EXTRA_ELEMENT_WIDTH,
					'top' : newTop + (HEADER_SPACE * headerCount),
					'left' : newLeft
				});
			});

			$('h2.month-header')
			.each(function(idx, el) {
				if (idx === 0) {
					headerCount = 0;
					lastHeadersChildren = 0;
					rowsAbove = 0;
				}
				
				var $el = $(el);
				var elementID = $el.attr("id");
				var elementClass = $el.attr("class");
				var elementChildren = parseInt(elementClass.split(' ')[0]);
				
				var newTop = rowsAbove * ELEMENT_SIZE_WITH_PADDING;
				$el.css({
					'top' : newTop + (HEADER_SPACE * idx)
				});
				
				lastHeadersChildren = elementChildren;
				rowsAbove += Math.ceil(lastHeadersChildren / ELEMENTS_PER_ROW);
			});
		}
		
		function getElementInfo(elementIDString) {
			var tempArray = elementIDString.split('-');
			return {
				year : parseInt(tempArray[0]),
				month : parseInt(tempArray[1]),
				day : parseInt(tempArray[2]),
				index : parseInt(tempArray[3])
			};
		}
		
		$(document).ready(function() {
			$(window).resize(function() {
				$window.clearTimeout(vm.timer);
				vm.timer = $window.setTimeout(rearrange, 100);
			});
		});
		
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
				var years = [];
				var yearIndexes = {};				
				
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
					
//					tempArray.push(records[i]);
				}
				
//				vm.records = records;
//				vm.records = tempArray;
				vm.records = years;
				
				rearrange();
			});
		}

		getMyRecords();
	};
})(angular);