(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', '$timeout', '$document', '$mdDialog', 'databaseService', 'mongodbService', 'utilService'];
	function HistoryController($scope, $timeout, $document, $mdDialog, databaseService, mongodbService, utilService) {
		var vm = this;
		
		vm.records = [];
		vm.sortingMethod = "-";

		vm.selectedOptionIndex = 3;
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
		
		vm.contentCSS = {
			"height" : "calc(100vh - 96px)"
		};
		
		vm.showSetInfo = showSetModal;
		vm.getOrderingMethod = getOrderMethod;
		
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
		
		function showSetModal(record, $event) {
			$mdDialog.show({
				parent: angular.element(document.body),
	        	templateUrl: 'app/history/modal/historic-set-modal.tmpl.html',
	        	targetEvent: $event,
	        	clickOutsideToClose: true,
	        	autoWrap: false,
	        	controller: 'HistoricSetController',
	        	controllerAs: 'historicSetCtrl',
	        	locals: {
	        		record : record
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
		
		function getMyRecords() {
			mongodbService.getAllRecords()
			.then(function(records) {
				var tempArray = [];
				for (var i = 0; i < records.length; i++) {
					if (records[i].name === "OB Test") {
						var dateString = records[i].date;
						var testDate = moment(dateString, 'YYYY:MM:DD:hh:mm:ss', true);
						records[i].day = utilService.getDays()[testDate.day()];
						records[i].month = utilService.getMonths()[testDate.month()];
						records[i].monthDay = testDate.date();
						records[i].year = testDate.year();
						
						tempArray.push(records[i]);
					}
				}
				
				vm.records = tempArray;
			});
		}

		getMyRecords();
	};
})(angular);