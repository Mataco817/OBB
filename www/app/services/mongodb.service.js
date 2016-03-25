(function(angular){
	angular.module('mongodb-service', [])
	.service('mongodbService', mongodbService);

	mongodbService.$inject = ['$http', '$q', '$timeout'];
	function mongodbService($http, $q, $timeout) {
		var mongoEndpoint = "http://localhost:1337/198.199.67.144:3000/";
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

			var url = mongoEndpoint
				+ "?setid=" + record.id
				+ "&name=" + "OB Test"
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

			var url = mongoEndpoint + "getRecords";
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				// if done and OK status
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					var jsonObj = getJSONObject(xhttp.responseText);
					deferred.resolve(jsonObj);
				}
				// if done and not OK status
				else if (xhttp.readyState == 4 && xhttp.status != 200) {
					deferred.reject();
				}
			};
			
			xhttp.open("GET", url, true);
			xhttp.send();
			
			/*
			 * $http automatically attempts to convert responses to JSON objects
			 * but does not work since the response needs to be altered to be JSON ready
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
			 */

			return deferred.promise;
		}
		
		function getJSONObject(response) {
			/* Add commas in between set records */
			var commaSeparated = response.replace(/}{/g, "},{");
			
			/* Remove any double quotes (ex ""Some Text"") */
			var extraQuotesRemoved = commaSeparated.replace(/\\"/g, "");
			
			/* Add array bracket to beginning */
			var arrayBegin = [extraQuotesRemoved.slice(0, 0), '[', extraQuotesRemoved.slice(0)].join('');
			
			/* Add array bracker to end */
			var arrayEnd = [arrayBegin.slice(0, arrayBegin.length), ']', arrayBegin.slice(arrayBegin.length)].join('');
			
			/* parse to JSON object */
			return JSON.parse(arrayEnd);
		}
	};
})(angular);
