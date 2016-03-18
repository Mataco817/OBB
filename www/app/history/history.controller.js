(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope', 'databaseService'];
	function HistoryController($scope, databaseService) {
		var vm = this;
		vm.records = [];

		vm.addRecord = function() {
			var record = {
				_id : new Date().toISOString(),
				title : "test" + index.toString()
			};
			
			databaseService.saveRecord(record)
			.then(function() {
				index++;
			});
		};
		
		vm.deleteRecord = function(record) {
			databaseService.deleteRecord(record);
		};
		
		/*
		 * Internal Methods
		 */
		var index = 1;
		
		databaseService.subscribe($scope, onDataChange);
		databaseService.initializeDatabase();
		
		function onDataChange(event, params) {
			if (params.changes.initialize) {
				vm.records = params.records;
			}
			else {
				var id = params.changes.id;
				var recordIndex = vm.records.map(function (x) { return x.id }).indexOf(id);
				
				if (params.changes.deleted) {
					vm.records.splice(recordIndex, 1);
				}
				else {
					var dbRecordIndex = params.records.map(function(x) { return x.id; }).indexOf(id);
					
					if (recordIndex > -1 && dbRecordIndex > -1) {
						vm.records[recordIndex] = params.records[dbRecordIndex];
					}
					else if (dbRecordIndex > -1) {
						vm.records.push(params.records[dbRecordIndex]);
					}
				}
			}
		}
	};
})(angular);