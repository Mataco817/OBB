(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', '$timeout', '$document', 'databaseService', 'mongodbService'];
	function HistoryController($scope, $timeout, $document, databaseService, mongodbService) {
		var vm = this;
		
		vm.records = [];
		vm.sortingMethod = "Desc";

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
		
		vm.testClass = {
			"height" : "calc(100vh - 96px)"
		};
		
		var content = angular.element(document.getElementById('scroll-content'));
		
		$scope.$watch(function watchContent(scope) {
			return content[0].style["transform"];
		},
		function(newVal, oldVal) {				
			var transformString = newVal;
			var transformStringArray = transformString.split(" ");
			var transformY = parseInt(transformStringArray[1]);
			var heightOffset = 96 - (24 - transformY);
			
			vm.testClass["height"] = "calc(100vh - " + heightOffset.toString() + "px)";
//			console.log(transformY);
//			console.log("96 - (24 - " + transformY + ") = " + heightOffset);
		});
		
		/*
		 * Internal Methods
		 */
		function optionClick(index) {
			$timeout(function() {
				vm.selectedOptionIndex = index;
			}, 500);
		}
		
		function getMyRecords() {
			mongodbService.getAllRecords()
			.then(function(records) {
				var tempArray = [];
				for (var i = 0; i < records.length; i++) {
					if (records[i].name === "OB Test") {
						tempArray.push(records[i]);
					}
				}
				
				vm.records = tempArray;
			});
		}

		getMyRecords();
	};
})(angular);