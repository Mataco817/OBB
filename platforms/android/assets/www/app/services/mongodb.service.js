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
			updateRecord : function(record) {
				update(record);
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

		function update(record) {
			var deferred = $q.defer();

			var url = mogoEndpoint 
				+ "?name=" + record.userName 
				+ "&lift=" + record.lift 
				+ "&weight=" + record.weight
				+ "&rep=" + record.rep
				+ "&set=" + record.set
				+ "&velocity=" + rep.avgVelocity;
			
			$http({
				url : url,
				method : "PUT",
				data : record
			})
			.then(function() {
				deferred.resolve("Updated record.");
			},
			function() {
				deferred.reject("Failed to update record.");
			});

			return deferred.promise;
		}
	};
})(angular);
