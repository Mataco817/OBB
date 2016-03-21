(function(angular){
	angular.module('mongodb-service', [])
	.service('mongodbService', mongodbService);

	mongodbService.$inject = ['$http', '$q'];
	function mongodbService($http, $q) {
		var mongoEndpoint = "http://198.199.67.144:3000/";
		/* 
		 * http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
		 * Look into:
		 *  - ExpressJS
		 *  - MongoDB
		 */

		var service = {
			saveRecord : function(record) {
				return save(record);
			},
			getAllRecords : function() {
				return getAll();
			},
			getRecordByName : function(name) {
				return getByName();
			}
		};

		return service;

		function save(record) {
			var deferred = $q.defer();

			var url = "http://localhost:1337/198.199.67.144:3000/" 
				+ "?name=" + "OB Test"
				+ "&lift=" + record.lift 
				+ "&weight=" + record.weight
				+ "&velocities=" + record.velocities.toString()
				+ "&RPE=" + record.rpe;
			
			$http({
				url : url,
				method : "GET",
			})
			.then(function(data) {
				deferred.resolve("Created record.");
			},
			function(data) {
				deferred.reject("Failed to create record.");
			});

			return deferred.promise;
		}

		function getAll() {
			var deferred = $q.defer();

			var url = "http://localhost:1337/198.199.67.144:3000/getRecords";
			
			$http({
				url : url,
				method : "GET",
			})
			.then(function(records) {
				deferred.resolve(records);
			},
			function(data) {
				deferred.reject("Failed to create record.");
			});

			return deferred.promise;
		}
	};
})(angular);
