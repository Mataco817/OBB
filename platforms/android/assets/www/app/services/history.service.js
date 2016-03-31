(function(angular){
	angular.module('history')
	.service('historyService', historyService);

	historyService.$inject = ['$q', '$timeout', 'mongodbService'];
	function historyService($q, $timeout, mongodbService) {
		var history = [];
		var initialized = false;

		var service = {
			initialize : function() {
				initialize();
			},
			getHistory : function(record) {
				return getHistory(record);
			}
		};

		return service;
		
		function initialize() {
			mongodbService.getAllRecords()
			.then(function(records) {
				for (var i = 0; i < records.length; i++) {
					if (records[i].name === "OB Test") {
						history.push(records[i]);
					}
				}
			});
		}

		function getHistory() {
			var deferred = $q.defer();
			
			if (initialized) {
				deferred.resolve(history);
			}
			else {
				$timeout(function() {
					return getHistory();
				}, 1000);
			}
			
			return deferred.promise;
		}
	};
})(angular);
