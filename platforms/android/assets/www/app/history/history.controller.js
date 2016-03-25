(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', 'databaseService', 'mongodbService'];
	function HistoryController($scope, databaseService, mongodbService) {
		var vm = this;
		vm.records = [];
		
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