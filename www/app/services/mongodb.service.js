(function(angular){
	angular.module('mongodb-service', [])
	.service('mongodbService', mongodbService);

	mongodbService.$inject = ['$http', '$q', '$timeout'];
	function mongodbService($http, $q, $timeout) {
		var testingEndpoint = "http://localhost:1337/198.199.67.144:3000/";
		var ipEndpoint = "http://198.199.67.144:3000/";
		var ssEndpoint = "http://lifts.squatsandscience.com/"
		/* 
		 * REQUIRED FIELDS:
		 * user = "abc"
		 * set = 23
		 * time = 2016-03-24-11:46:01
		 */

		var service = {
			saveRecord : function(record) {
				return save(record);
			},
			getAllRecords : function() {
				return getAll();
			},
			getTodaysRecords : function() {
				return getTodays();
			},
			getRecordByName : function(name) {
				return getByName();
			},
			getUserByName : function(name) {
				return getUserByName(name);
			},
			deleteRecord : function(record) {
				return deleteRecord(record);
			}
		};

		return service;

		function save(record) {
			var deferred = $q.defer();

			var url = ipEndpoint + "data?"
				+ "user=" + "OB Test"
				+ "&set=" + record.set
				+ "&time=" + record.time
				+ "&startingrep=" + "1"
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

			var url = ipEndpoint + "getRecords?find={\"user\":\"OB Test\"}";
			
			/*
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
			 */
//			var test = [{"_id":"56fdbb6684e257ed53f82d3e","set":"7","time":"Thu Mar 31 2016 20:02:29 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:05:58","lift":"Set 7","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.51}]},{"_id":"56fc758f84e257ed53f82c81","set":"1","time":"Wed Mar 30 2016 20:55:03 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:30:20:57:58","lift":"Squat","weight":"225","RPE":"6","rep":[{"n":1,"velocity":0.9},{"n":2,"velocity":0.85},{"n":3,"velocity":0.86}]},{"_id":"56fdb6c684e257ed53f82d3a","set":"3","time":"Thu Mar 31 2016 19:42:30 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:19:47:08","lift":"Squat","weight":"185","RPE":"5","rep":[{"n":1,"velocity":0.87},{"n":2,"velocity":0.88},{"n":3,"velocity":0.88},{"n":4,"velocity":0.92},{"n":5,"velocity":0.86}]},{"_id":"56fdb6c784e257ed53f82d3b","set":"4","time":"Thu Mar 31 2016 19:45:46 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:19:47:49","lift":"Squat","weight":"225","RPE":"5","rep":[{"n":1,"velocity":0.82},{"n":2,"velocity":0.83},{"n":3,"velocity":0.79}]},{"_id":"56fdb85484e257ed53f82d3c","set":"5","time":"Thu Mar 31 2016 19:52:19 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:19:52:51","lift":"Set 5","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.75},{"n":2,"velocity":0.74},{"n":3,"velocity":0.72}]},{"_id":"56fdb91a84e257ed53f82d3d","set":"6","time":"Thu Mar 31 2016 19:55:22 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:19:56:07","lift":"Set 6","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.64},{"n":2,"velocity":0.58}]},{"_id":"56fdbba484e257ed53f82d3f","set":"8","time":"Thu Mar 31 2016 20:06:35 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:07:40","lift":"Squat","weight":"335","RPE":"9","rep":[{"n":1,"velocity":0.44},{"n":2,"velocity":0.39},{"n":3,"velocity":0.36}]},{"_id":"56fdbd0c84e257ed53f82d40","set":"9","time":"Thu Mar 31 2016 20:12:30 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:13:00","lift":"Set 9","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.47},{"n":2,"velocity":0.38},{"n":3,"velocity":0.42}]},{"_id":"56fdbe8884e257ed53f82d41","set":"10","time":"Thu Mar 31 2016 20:18:17 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:19:20","lift":"Set 10","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.49},{"n":2,"velocity":0.44},{"n":3,"velocity":0.38}]},{"_id":"56fdc0d084e257ed53f82d42","set":"11","time":"Thu Mar 31 2016 20:27:15 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:29:03","lift":"Set 11","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.5},{"n":2,"velocity":0.38}]},{"_id":"56fdc1e184e257ed53f82d43","set":"12","time":"Thu Mar 31 2016 20:29:56 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:33:29","lift":"Set 12","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.41},{"n":2,"velocity":0.35},{"n":3,"velocity":0.34}]},{"_id":"56fdc2f984e257ed53f82d44","set":"1","time":"Thu Mar 31 2016 20:37:06 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:38:17","lift":"Set 1","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.97},{"n":2,"velocity":1.02},{"n":3,"velocity":0.98},{"n":4,"velocity":0.72},{"n":5,"velocity":1.06},{"n":6,"velocity":0.97},{"n":7,"velocity":1.06},{"n":8,"velocity":1.05},{"n":9,"velocity":1.09},{"n":10,"velocity":1.07},{"n":11,"velocity":1.03},{"n":12,"velocity":1.06}]},{"_id":"56fdc33d84e257ed53f82d45","set":"2","time":"Thu Mar 31 2016 20:38:37 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:39:24","lift":"Set 2","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.71},{"n":2,"velocity":0.8},{"n":3,"velocity":0.8},{"n":4,"velocity":0.84},{"n":5,"velocity":0.82},{"n":6,"velocity":0.8},{"n":7,"velocity":0.77}]},{"_id":"56fdc41b84e257ed53f82def","set":"3","time":"Thu Mar 31 2016 20:40:39 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:43:04","lift":"Set 3","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.61},{"n":2,"velocity":0.62},{"n":3,"velocity":0.67},{"n":4,"velocity":0.65},{"n":5,"velocity":0.68}]},{"_id":"56fdc45884e257ed53f82df0","set":"4","time":"Thu Mar 31 2016 20:43:06 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:44:07","lift":"Set 4","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.52},{"n":2,"velocity":0.51},{"n":3,"velocity":0.44},{"n":4,"velocity":0.45}]},{"_id":"56fdc4e984e257ed53f82df1","set":"5","time":"Thu Mar 31 2016 20:46:05 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:46:40","lift":"Bench","weight":"200","RPE":"7","rep":[{"n":1,"velocity":0.38},{"n":2,"velocity":0.37},{"n":3,"velocity":0.33}]},{"_id":"56fdc53c84e257ed53f82df2","set":"6","time":"Thu Mar 31 2016 20:47:37 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:48:01","lift":"Bench","weight":"200","RPE":"7","rep":[{"n":1,"velocity":0.38},{"n":2,"velocity":0.33},{"n":3,"velocity":0.34}]},{"_id":"56fdc5a984e257ed53f82df3","set":"7","time":"Thu Mar 31 2016 20:49:24 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:49:49","lift":"Bench","weight":"200","RPE":"7","rep":[{"n":1,"velocity":0.37},{"n":2,"velocity":0.35},{"n":3,"velocity":0.36}]},{"_id":"56fdc61a84e257ed53f82df4","set":"8","time":"Thu Mar 31 2016 20:51:19 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:54:03","lift":"Bench","weight":"200","RPE":"7","rep":[{"n":1,"velocity":0.36},{"n":2,"velocity":0.38},{"n":3,"velocity":0.37}]},{"_id":"56fdc6a584e257ed53f82df5","set":"9","time":"Thu Mar 31 2016 20:53:18 GMT-0400 (EDT)","user":"OB Test","date":"2016:03:31:20:54:01","lift":"Bench","weight":"200","RPE":"7","rep":[{"n":1,"velocity":0.26},{"n":2,"velocity":0.36},{"n":3,"velocity":0.35}]},{"_id":"5700142684e257ed53f83744","set":"1","time":"Sat Apr 02 2016 14:49:01 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:14:50:23","lift":"Squat","weight":"315","RPE":"8","rep":[{"n":1,"velocity":0.69},{"n":2,"velocity":0.68}]},{"_id":"570027df84e257ed53f837ee","set":"1","time":"Sat Apr 02 2016 16:12:52 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:13:18","lift":"Set 1","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":1.16},{"n":2,"velocity":1.2},{"n":3,"velocity":1.19},{"n":4,"velocity":1.17},{"n":5,"velocity":1.11},{"n":6,"velocity":1.22},{"n":7,"velocity":1.19},{"n":8,"velocity":1.12},{"n":9,"velocity":1.2},{"n":10,"velocity":1.24}]},{"_id":"570028a784e257ed53f837ef","set":"2","time":"Sat Apr 02 2016 16:16:08 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:16:38","lift":"Set 2","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":1.06},{"n":2,"velocity":1.08},{"n":3,"velocity":1.08},{"n":4,"velocity":1.03},{"n":5,"velocity":1.08},{"n":6,"velocity":1.06},{"n":7,"velocity":1.06},{"n":8,"velocity":1.06}]},{"_id":"570029c284e257ed53f837f0","set":"3","time":"Sat Apr 02 2016 16:20:22 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:21:21","lift":"Set 3","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.94},{"n":2,"velocity":1.02},{"n":3,"velocity":0.97},{"n":4,"velocity":0.96},{"n":5,"velocity":0.97},{"n":6,"velocity":0.96}]},{"_id":"57002a3584e257ed53f837f1","set":"4","time":"Sat Apr 02 2016 16:22:49 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:23:16","lift":"Set 4","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.85},{"n":2,"velocity":0.86},{"n":3,"velocity":0.86},{"n":4,"velocity":0.85},{"n":5,"velocity":0.86}]},{"_id":"57002b4684e257ed53f837f2","set":"5","time":"Sat Apr 02 2016 16:27:12 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:27:50","lift":"Set 5","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.76},{"n":2,"velocity":0.79},{"n":3,"velocity":0.8},{"n":4,"velocity":0.79},{"n":5,"velocity":0.77}]},{"_id":"57002c7284e257ed53f837f3","set":"6","time":"Sat Apr 02 2016 16:32:16 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:32:50","lift":"Set 6","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.71},{"n":2,"velocity":0.67},{"n":3,"velocity":0.69}]},{"_id":"57002d9284e257ed53f837f4","set":"7","time":"Sat Apr 02 2016 16:37:00 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:37:31","lift":"Set 7","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.62},{"n":2,"velocity":0.59}]},{"_id":"57002ecf84e257ed53f837f5","set":"8","time":"Sat Apr 02 2016 16:42:03 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:43:28","lift":"Squat","weight":"305","RPE":"8","rep":[{"n":1,"velocity":0.5},{"n":2,"velocity":0.47},{"n":3,"velocity":0.48},{"n":4,"velocity":0.44},{"n":5,"velocity":0.39},{"n":6,"velocity":0.35}]},{"_id":"5700306084e257ed53f837f6","set":"9","time":"Sat Apr 02 2016 16:48:42 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:49:47","lift":"Squat","weight":"305","RPE":"8","rep":[{"n":1,"velocity":0.55},{"n":2,"velocity":0.51},{"n":3,"velocity":0.44},{"n":4,"velocity":0.47},{"n":5,"velocity":0.36},{"n":6,"velocity":0.35}]},{"_id":"5700321684e257ed53f837f7","set":"10","time":"Sat Apr 02 2016 16:56:02 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:16:57:06","lift":"Squat","weight":"305","RPE":"8","rep":[{"n":1,"velocity":0.54},{"n":2,"velocity":0.5},{"n":3,"velocity":0.52},{"n":4,"velocity":0.46},{"n":5,"velocity":0.43},{"n":6,"velocity":0.43}]},{"_id":"5700342784e257ed53f837f8","set":"11","time":"Sat Apr 02 2016 17:04:43 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:06:12","lift":"Squat","weight":"305","RPE":"9","rep":[{"n":1,"velocity":0.56},{"n":2,"velocity":0.54},{"n":3,"velocity":0.53},{"n":4,"velocity":0.49},{"n":5,"velocity":0.49},{"n":6,"velocity":0.44},{"n":7,"velocity":0.41},{"n":8,"velocity":0.38}]},{"_id":"5700367784e257ed53f837f9","set":"1","time":"Sat Apr 02 2016 17:15:05 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:26:12","lift":"Bench","weight":"45","RPE":"5","rep":[{"n":1,"velocity":0.91},{"n":2,"velocity":0.86},{"n":3,"velocity":0.91},{"n":4,"velocity":0.91},{"n":5,"velocity":0.98},{"n":6,"velocity":0.97},{"n":7,"velocity":1.11},{"n":8,"velocity":0.97},{"n":9,"velocity":1.07},{"n":10,"velocity":1.11}]},{"_id":"570037b284e257ed53f837fa","set":"2","time":"Sat Apr 02 2016 17:20:10 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:26:18","lift":"Bench","weight":"95","RPE":"5","rep":[{"n":1,"velocity":0.67},{"n":2,"velocity":0.74},{"n":3,"velocity":0.78},{"n":4,"velocity":0.76},{"n":5,"velocity":0.81},{"n":6,"velocity":0.82},{"n":7,"velocity":0.85},{"n":8,"velocity":0.84}]},{"_id":"570038dd84e257ed53f837fb","set":"3","time":"Sat Apr 02 2016 17:25:31 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:26:23","lift":"Bench","weight":"135","RPE":"5","rep":[{"n":1,"velocity":0.65},{"n":2,"velocity":0.68},{"n":3,"velocity":0.64},{"n":4,"velocity":0.69},{"n":5,"velocity":0.69}]},{"_id":"5700396784e257ed53f837fc","set":"4","time":"Sat Apr 02 2016 17:27:47 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:28:13","lift":"Bench","weight":"155","RPE":"5","rep":[{"n":1,"velocity":0.64},{"n":2,"velocity":0.63},{"n":3,"velocity":0.67},{"n":4,"velocity":0.6}]},{"_id":"57003a9b84e257ed53f837fd","set":"1","time":"Sat Apr 02 2016 17:32:42 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:34:02","lift":"Bench","weight":"175","RPE":"5","rep":[{"n":1,"velocity":0.52},{"n":2,"velocity":0.55},{"n":3,"velocity":0.5}]},{"_id":"57003b6c84e257ed53f837fe","set":"2","time":"Sat Apr 02 2016 17:36:16 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:37:21","lift":"Bench","weight":"180","RPE":"6","rep":[{"n":1,"velocity":0.44},{"n":2,"velocity":0.41},{"n":3,"velocity":0.42},{"n":4,"velocity":0.31},{"n":5,"velocity":0.41},{"n":6,"velocity":0.4},{"n":7,"velocity":0.42}]},{"_id":"57003c2184e257ed53f837ff","set":"3","time":"Sat Apr 02 2016 17:39:18 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:39:51","lift":"Bench","weight":"180","RPE":"6","rep":[{"n":1,"velocity":0.44},{"n":2,"velocity":0.42},{"n":3,"velocity":0.45},{"n":4,"velocity":0.47},{"n":5,"velocity":0.44},{"n":6,"velocity":0.3}]},{"_id":"57003dd084e257ed53f83801","set":"1","time":"Sat Apr 02 2016 17:46:14 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:02:17:47:07","lift":"Bench","weight":"180","RPE":"8","rep":[{"n":1,"velocity":0.43},{"n":2,"velocity":0.41},{"n":3,"velocity":0.43},{"n":4,"velocity":0.49},{"n":5,"velocity":0.44},{"n":6,"velocity":0.44},{"n":7,"velocity":0.47},{"n":8,"velocity":0.45},{"n":9,"velocity":0.45},{"n":10,"velocity":0.41},{"n":11,"velocity":0.39},{"n":12,"velocity":0.4}]},{"_id":"5702ec0884e257ed53f843ed","set":"1","time":"Mon Apr 04 2016 18:34:24 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:34:48","lift":"Set 1","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":1.21},{"n":2,"velocity":1.18},{"n":3,"velocity":1.19},{"n":4,"velocity":1.2},{"n":5,"velocity":1.24},{"n":6,"velocity":1.22},{"n":7,"velocity":1.16},{"n":8,"velocity":1.2},{"n":9,"velocity":1.23},{"n":10,"velocity":1.21}]},{"_id":"5702ecb784e257ed53f843ee","set":"2","time":"Mon Apr 04 2016 18:37:04 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:37:42","lift":"Set 2","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":1.06},{"n":2,"velocity":1.11},{"n":3,"velocity":1.09},{"n":4,"velocity":1.09},{"n":5,"velocity":1.1},{"n":6,"velocity":1.11},{"n":7,"velocity":1.11},{"n":8,"velocity":1.06}]},{"_id":"5702ed9d84e257ed53f843ef","set":"3","time":"Mon Apr 04 2016 18:41:01 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:41:32","lift":"Set 3","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.96},{"n":2,"velocity":1.07},{"n":3,"velocity":1.07},{"n":4,"velocity":1.09},{"n":5,"velocity":1.06}]},{"_id":"5702ee2684e257ed53f843f0","set":"4","time":"Mon Apr 04 2016 18:43:16 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:43:49","lift":"Set 4","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.87},{"n":2,"velocity":0.94},{"n":3,"velocity":0.88},{"n":4,"velocity":0.87}]},{"_id":"5702ef7584e257ed53f843f1","set":"5","time":"Mon Apr 04 2016 18:49:04 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:49:25","lift":"Set 5","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.79},{"n":2,"velocity":0.78},{"n":3,"velocity":0.77}]},{"_id":"5702f08c84e257ed53f843f2","set":"6","time":"Mon Apr 04 2016 18:53:12 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:54:03","lift":"Set 6","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.65}]},{"_id":"5702f0b284e257ed53f843f3","set":"7","time":"Mon Apr 04 2016 18:54:08 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:18:54:41","lift":"Set 7","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.66},{"n":2,"velocity":0.65},{"n":3,"velocity":0.63}]},{"_id":"5702f22584e257ed53f843f4","set":"8","time":"Mon Apr 04 2016 18:59:46 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:00:53","lift":"Set 8","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.57},{"n":2,"velocity":0.47}]},{"_id":"5702f31384e257ed53f843f5","set":"9","time":"Mon Apr 04 2016 19:04:01 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:05:07","lift":"Squat","weight":"265","RPE":"8","rep":[{"n":1,"velocity":0.6},{"n":2,"velocity":0.57},{"n":3,"velocity":0.57},{"n":4,"velocity":0.54},{"n":5,"velocity":0.54},{"n":6,"velocity":0.55},{"n":7,"velocity":0.5},{"n":8,"velocity":0.48}]},{"_id":"5702f4e484e257ed53f843f6","set":"10","time":"Mon Apr 04 2016 19:11:56 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:12:40","lift":"Squat","weight":"265","RPE":"8","rep":[{"n":1,"velocity":0.64},{"n":2,"velocity":0.66},{"n":3,"velocity":0.67},{"n":4,"velocity":0.64},{"n":5,"velocity":0.6},{"n":6,"velocity":0.54},{"n":7,"velocity":0.55},{"n":8,"velocity":0.52}]},{"_id":"5702f5be84e257ed53f843f7","set":"11","time":"Mon Apr 04 2016 19:15:16 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:16:16","lift":"Squat","weight":"265","RPE":"8","rep":[{"n":1,"velocity":0.58},{"n":2,"velocity":0.6},{"n":3,"velocity":0.57},{"n":4,"velocity":0.55},{"n":5,"velocity":0.57},{"n":6,"velocity":0.56},{"n":7,"velocity":0.55},{"n":8,"velocity":0.48}]},{"_id":"5702f67484e257ed53f843f8","set":"12","time":"Mon Apr 04 2016 19:18:31 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:19:17","lift":"Squat","weight":"265","RPE":"8","rep":[{"n":1,"velocity":0.59},{"n":2,"velocity":0.59},{"n":3,"velocity":0.64},{"n":4,"velocity":0.6},{"n":5,"velocity":0.59},{"n":6,"velocity":0.58},{"n":7,"velocity":0.55},{"n":8,"velocity":0.53}]},{"_id":"5702fa4d84e257ed53f843fa","set":"1","time":"Mon Apr 04 2016 19:35:11 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:35:29","lift":"Set 1","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.81},{"n":2,"velocity":0.91},{"n":3,"velocity":0.91},{"n":4,"velocity":0.98},{"n":5,"velocity":0.97},{"n":6,"velocity":0.94},{"n":7,"velocity":1.03},{"n":8,"velocity":0.97},{"n":9,"velocity":0.98},{"n":10,"velocity":0.94}]},{"_id":"5702fab684e257ed53f843fb","set":"2","time":"Mon Apr 04 2016 19:37:00 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:37:25","lift":"Set 2","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.71},{"n":2,"velocity":0.79},{"n":3,"velocity":0.73},{"n":4,"velocity":0.8},{"n":5,"velocity":0.75},{"n":6,"velocity":0.77},{"n":7,"velocity":0.78},{"n":8,"velocity":0.81},{"n":9,"velocity":0.79}]},{"_id":"5702fb4f84e257ed53f843fc","set":"3","time":"Mon Apr 04 2016 19:39:23 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:39:58","lift":"Set 3","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.63},{"n":2,"velocity":0.64},{"n":3,"velocity":0.65},{"n":4,"velocity":0.67},{"n":5,"velocity":0.68}]},{"_id":"5702fbbc84e257ed53f843fd","set":"4","time":"Mon Apr 04 2016 19:41:13 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:41:46","lift":"Set 4","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.61},{"n":2,"velocity":0.6},{"n":3,"velocity":0.61},{"n":4,"velocity":0.61},{"n":5,"velocity":0.66}]},{"_id":"5702fc2d84e257ed53f843fe","set":"5","time":"Mon Apr 04 2016 19:43:05 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:43:41","lift":"Set 5","weight":"undefined","RPE":"5","rep":[{"n":1,"velocity":0.52},{"n":2,"velocity":0.48},{"n":3,"velocity":0.47},{"n":4,"velocity":0.49},{"n":5,"velocity":0.51}]},{"_id":"5702fcf084e257ed53f843ff","set":"6","time":"Mon Apr 04 2016 19:46:26 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:47:05","lift":"Bench","weight":"175","RPE":"7","rep":[{"n":1,"velocity":0.46},{"n":2,"velocity":0.45},{"n":3,"velocity":0.46},{"n":4,"velocity":0.46},{"n":5,"velocity":0.48},{"n":6,"velocity":0.43},{"n":7,"velocity":0.41},{"n":8,"velocity":0.44}]},{"_id":"5702fd6884e257ed53f84400","set":"7","time":"Mon Apr 04 2016 19:48:18 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:48:59","lift":"Bench","weight":"175","RPE":"7","rep":[{"n":1,"velocity":0.45},{"n":2,"velocity":0.45},{"n":3,"velocity":0.43},{"n":4,"velocity":0.43},{"n":5,"velocity":0.41},{"n":6,"velocity":0.41},{"n":7,"velocity":0.4},{"n":8,"velocity":0.26}]},{"_id":"5702fde484e257ed53f84401","set":"8","time":"Mon Apr 04 2016 19:50:36 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:51:02","lift":"Bench","weight":"175","RPE":"7","rep":[{"n":1,"velocity":0.44},{"n":2,"velocity":0.43},{"n":3,"velocity":0.46},{"n":4,"velocity":0.43},{"n":5,"velocity":0.43},{"n":6,"velocity":0.42},{"n":7,"velocity":0.39},{"n":8,"velocity":0.38}]},{"_id":"5702fe7484e257ed53f84402","set":"9","time":"Mon Apr 04 2016 19:52:55 GMT-0400 (EDT)","user":"OB Test","date":"2016:04:04:19:53:27","lift":"Bench","weight":"175","RPE":"7","rep":[{"n":1,"velocity":0.41},{"n":2,"velocity":0.42},{"n":3,"velocity":0.45},{"n":4,"velocity":0.43},{"n":5,"velocity":0.42},{"n":6,"velocity":0.37},{"n":7,"velocity":0.41},{"n":8,"velocity":0.41}]}];
//			deferred.resolve(test);
			/*
			 * $http automatically attempts to convert responses to JSON objects
			 * but does not work since the response needs to be altered to be JSON ready
			 */
			$http({
				url : url,
				method : "GET",
			})
			.then(function(response) {
				deferred.resolve(response.data);
			},
			function(error) {
				deferred.reject("Failed to create record.");
			});

			return deferred.promise;
		}
		
		function getTodays() {
			var deferred = $q.defer();

			var url = ipEndpoint + "getRecords?find={\"time\":{\"$gt\":\"" + new Date() + "\"}}";

			$http({
				url : url,
				method : "GET",
			})
			.then(function(response) {
				if (response.data.length > 0) {
					deferred.resolve(response.data);
				}
				else {
					deferred.reject("No records for today");
				}
			},
			function(error) {
				deferred.reject("Failed to get records.");
			});
			
			return deferred.promise;
		}
		
		function getUserByName(name) {
			var deferred = $q.defer();
			
			//TODO: hookup with username query from server
			console.log(name);
			deferred.resolve(false);

			return deferred.promise;
		}
		
		function deleteRecord(record) {
			var deferred = $q.defer();
			
			var url = ipEndpoint + "delete?"
				+ "user=" + "OB Test"
				+ "&set=" + record.set
				+ "&time=" + record.time; 
			
			$http({
				url : url,
				method : "GET",
			})
			.then(function(data) {
				deferred.resolve("Deleted record.");
			},
			function(data) {
				deferred.reject("Failed to delete record.");
			});
			
			return deferred.promise;
		}
		
		function getJSONObject(response) {
			/* Add commas in between set records */
			var commaSeparated = response.replace(/}{/g, "},{");
			
			/* Remove any double quotes (ex ""Some Text"") */
			var extraQuotesRemoved = commaSeparated.replace(/""/g, "\"");
			
			/* Add array bracket to beginning */
			var arrayBegin = [extraQuotesRemoved.slice(0, 0), '[', extraQuotesRemoved.slice(0)].join('');
			
			/* Add array bracker to end */
			var arrayEnd = [arrayBegin.slice(0, arrayBegin.length), ']', arrayBegin.slice(arrayBegin.length)].join('');
			
			/* parse to JSON object */
			return JSON.parse(arrayEnd);
		}
	};
})(angular);
