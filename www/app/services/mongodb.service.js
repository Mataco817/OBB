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
		
		var test = "{"_id":"56da5b3a166d35802fc0075e","date":"2016:03:04:23:06:17","name":"Jordan Berke","lift":"squat","weight":"336","velocities":[0.37,0.34,0.31,0.29,0.29,0.26,0.26,0.19],"RPE":"9"}{"_id":"56da6de7edbd917c3ed37607","date":"2016:03:05:00:25:52","name":"Jordan Berke","lift":"squat","weight":"336","velocities":[0.37,0.34,0.31,0.29,0.29,0.26,0.26,0.19],"RPE":"9"}{"_id":"56da6e1eedbd917c3ed37608","date":"2016:03:05:00:26:53","name":"Jordan Berke","lift":"bench","weight":"290","velocities":[0.36,0.34,0.31,0.29,0.29,0.26,0.26,0.19],"RPE":"9"}{"_id":"56db00af483f974d4968f439","date":"2016:03:05:10:52:14","name":"Jordan Berke","lift":"bench","weight":"290","velocities":[0.36,0.34,0.31,0.29,0.29,0.26,0.26,0.19],"RPE":"10"}{"_id":"56db02a4fc41a97e4964af58","date":"2016:03:05:11:00:36","name":"Jordan Berke","lift":"bench","weight":"290","velocities":[0.36,0.34,0.31,0.29,0.29,0.26,0.26,0.19],"RPE":"7"}{"_id":"56db05f776d4e1ae0243cef4","date":"2016:03:05:11:14:43","name":"Jordan Berke","lift":"bench","weight":"296","velocities":[0.36,0.34,0.31,0.29,0.29,0.26,0.26,0.19],"RPE":"7"}{"_id":"56db225276d4e1ae0243cef5","date":"2016:03:05:13:15:46","name":"\"Kendra Garwin\"","lift":"\"deadlift\"","weight":"295","velocities":[0.12],"RPE":"9"}{"_id":"56db228676d4e1ae0243cef6","date":"2016:03:05:13:16:38","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.11],"RPE":null}{"_id":"56db236976d4e1ae0243cef7","date":"2016:03:05:13:20:25","name":"Kendra Garwin","lift":"deadlift","weight":"135","velocities":[0.33],"RPE":"9"}{"_id":"56db236a76d4e1ae0243cef8","date":"2016:03:05:13:20:25","name":"Kendra Garwin","lift":"deadlift","weight":"135","velocities":[0.35],"RPE":"9"}{"_id":"56db236a76d4e1ae0243cef9","date":"2016:03:05:13:20:25","name":"Kendra Garwin","lift":"deadlift","weight":"135","velocities":[0.47],"RPE":"9"}{"_id":"56db236a76d4e1ae0243cefa","date":"2016:03:05:13:20:25","name":"Kendra Garwin","lift":"deadlift","weight":"135","velocities":[0.37],"RPE":"9"}{"_id":"56db236a76d4e1ae0243cefb","date":"2016:03:05:13:20:26","name":"Kendra Garwin","lift":"deadlift","weight":"135","velocities":[0.5],"RPE":"9"}{"_id":"56db236b76d4e1ae0243cefc","date":"2016:03:05:13:20:26","name":"Kendra Garwin","lift":"deadlift","weight":"185","velocities":[0.29],"RPE":"9"}{"_id":"56db236b76d4e1ae0243cefd","date":"2016:03:05:13:20:26","name":"Kendra Garwin","lift":"deadlift","weight":"185","velocities":[0.27],"RPE":"9"}{"_id":"56db236b76d4e1ae0243cefe","date":"2016:03:05:13:20:27","name":"Kendra Garwin","lift":"deadlift","weight":"185","velocities":[0.29],"RPE":"9"}{"_id":"56db236b76d4e1ae0243ceff","date":"2016:03:05:13:20:27","name":"Kendra Garwin","lift":"deadlift","weight":"185","velocities":[0.34],"RPE":"9"}{"_id":"56db236b76d4e1ae0243cf00","date":"2016:03:05:13:20:27","name":"Kendra Garwin","lift":"deadlift","weight":"185","velocities":[0.32],"RPE":"9"}{"_id":"56db236c76d4e1ae0243cf01","date":"2016:03:05:13:20:27","name":"Kendra Garwin","lift":"deadlift","weight":"225","velocities":[0.26],"RPE":"9"}{"_id":"56db236c76d4e1ae0243cf02","date":"2016:03:05:13:20:28","name":"Kendra Garwin","lift":"deadlift","weight":"225","velocities":[0.32],"RPE":"9"}{"_id":"56db236c76d4e1ae0243cf03","date":"2016:03:05:13:20:27","name":"Kendra Garwin","lift":"deadlift","weight":"225","velocities":[0.35],"RPE":"9"}{"_id":"56db236c76d4e1ae0243cf04","date":"2016:03:05:13:20:28","name":"Kendra Garwin","lift":"deadlift","weight":"275","velocities":[0.21],"RPE":"9"}{"_id":"56db236c76d4e1ae0243cf05","date":"2016:03:05:13:20:28","name":"Kendra Garwin","lift":"deadlift","weight":"275","velocities":[0.23],"RPE":"9"}{"_id":"56db236d76d4e1ae0243cf06","date":"2016:03:05:13:20:28","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.14],"RPE":"9"}{"_id":"56db236d76d4e1ae0243cf07","date":"2016:03:05:13:20:28","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.16],"RPE":"9"}{"_id":"56db236d76d4e1ae0243cf08","date":"2016:03:05:13:20:29","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.1],"RPE":"9"}{"_id":"56db236d76d4e1ae0243cf09","date":"2016:03:05:13:20:29","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.13],"RPE":"9"}{"_id":"56db236d76d4e1ae0243cf0a","date":"2016:03:05:13:20:29","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.1],"RPE":"9"}{"_id":"56db236e76d4e1ae0243cf0b","date":"2016:03:05:13:20:29","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.12],"RPE":"9"}{"_id":"56db236e76d4e1ae0243cf0c","date":"2016:03:05:13:20:29","name":"Kendra Garwin","lift":"deadlift","weight":"305","velocities":[0.09],"RPE":"9"}{"_id":"56db236e76d4e1ae0243cf0d","date":"2016:03:05:13:20:30","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.12],"RPE":"9"}{"_id":"56db236e76d4e1ae0243cf0e","date":"2016:03:05:13:20:30","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.09],"RPE":"9"}{"_id":"56db236f76d4e1ae0243cf0f","date":"2016:03:05:13:20:30","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.13],"RPE":"9"}{"_id":"56db236f76d4e1ae0243cf10","date":"2016:03:05:13:20:30","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.12],"RPE":"9"}{"_id":"56db236f76d4e1ae0243cf11","date":"2016:03:05:13:20:30","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.09],"RPE":"9"}{"_id":"56db236f76d4e1ae0243cf12","date":"2016:03:05:13:20:31","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.12],"RPE":"9"}{"_id":"56db236f76d4e1ae0243cf13","date":"2016:03:05:13:20:31","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.1],"RPE":"9"}{"_id":"56db236f76d4e1ae0243cf14","date":"2016:03:05:13:20:31","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.1],"RPE":"9"}{"_id":"56db237076d4e1ae0243cf15","date":"2016:03:05:13:20:31","name":"Kendra Garwin","lift":"deadlift","weight":"295","velocities":[0.11],"RPE":"9"}{"_id":"56ef4573dfc8a5460bcfa627","date":"2016:03:20:20:50:59","name":"OB Test","lift":"Squat","weight":"315","velocities":[0.5,0.5,0.5],"RPE":"8"}{"_id":"56ef458ddfc8a5460bcfa628","date":"2016:03:20:20:51:24","name":"OB Test","lift":"Squat","weight":"315","velocities":[0.5,0.5,0.5],"RPE":"8"}{"_id":"56ef45a2dfc8a5460bcfa629","date":"2016:03:20:20:51:45","name":"OB Test","lift":"Squat","weight":"315","velocities":[0.5,0.5,0.5],"RPE":"8"}{"_id":"56ef499edfc8a5460bcfa62a","date":"2016:03:20:21:08:46","name":"OB Test","lift":"Squat","weight":"315","velocities":[0.5,0.5,0.5],"RPE":"8"}{"_id":"56ef4e1edfc8a5460bcfa62b","date":"2016:03:20:21:27:58","name":"OB Test","lift":"Squat","weight":"315","velocities":[0.5,0.5,0.5],"RPE":"8"}{"_id":"56ef4e45dfc8a5460bcfa62c","date":"2016:03:20:21:28:37","name":"OB Test","lift":"Squat","weight":"315","velocities":[0.5,0.5,0.5],"RPE":"8"}

		function getAll() {
			var deferred = $q.defer();

			var url = "http://localhost:1337/198.199.67.144:3000/getRecords";
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
					console.log(xhttp.responseText);
					deferred.resolve();
				}
				else {
					deferred.reject();
				}
			};
			xhttp.open("GET", url, true);
			xhttp.send();
			
//			$http({
//				url : url,
//				method : "GET",
//			})
//			.then(function(records) {
//				deferred.resolve(records);
//			},
//			function(data) {
//				deferred.reject("Failed to create record.");
//			});

			return deferred.promise;
		}
	};
})(angular);
