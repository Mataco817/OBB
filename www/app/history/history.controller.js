(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', 'databaseService', 'mongodbService'];
	function HistoryController($scope, databaseService, mongodbService) {
		var vm = this;
		vm.sortingMethod = "Desc";
		vm.records = [];
		
		vm.options = [{
			title : 'Select...',
			icon : 'img/icons/check_circle.svg'
		},
		{
			title : 'Comfy View',
			icon : 'img/icons/comfy_view.svg'
		},
		{
			title : 'Day View',
			icon : 'img/icons/day_view.svg'
		},
		{
			title : 'Month View',
			icon : 'img/icons/month_view.svg'
		},
		{
			title : 'Year View',
			icon : 'img/icons/year_view.svg'
		}];
		
		/*
		 * Internal Methods
		 */
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