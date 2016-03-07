(function(angular){
	angular.module('bluetooth-service', [])
	.service('bluetoothService', bluetoothService);
	
	/*******************************
	 * DEPRECATED				   *
	 * Could possible be used for: *
	 *--------ANDROID ONLY---------*
	 * function @isEnabled         *
	 * function @enable            *
	 *******************************/

	bluetoothService.$inject = ['$q', '$window'];
	function bluetoothService($q, $window) {

		var service = {
			isEnabled : isEnabled,
			enable : enable
		};

		return service;

		function isEnabled() {
			var deferred = $q.defer();

			if ($window.bluetoothSerial) {
				bluetoothSerial.isEnabled(function() {
					deferred.resolve("Bluetooth is enabled.");
					enabled = true;
				},
				function() {
					deferred.reject("Bluetooth is not enabled.");
					enabled = false;
				});
			}
			else {
				deferred.reject("BluetoothSerial plug-in not loaded.");
			}

			return deferred.promise;
		}

		function enable() {
			var deferred = $q.defer();

			if ($window.bluetoothSerial) {
				bluetoothSerial.enable(function() {
					deferred.resolve("Bluetooth enabled!");
				},
				function() {
					deferred.reject("Bluetooth was <b>not</b> enabled.");
				});
			}
			else {
				deferred.reject("BluetoothSerial plug-in not loaded.");
			}

			return deferred.promise;
		}
	};
})(angular);
