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
		var enabled = false;

		var service = {
			isEnabled : isEnabled,
			enable : enable
		};

		return service;

		function getConnectedDevice() {
			return connectedDevice;
		}

		function isEnabled() {
			var deferred = $q.defer();

			if ($window.bluetoothSerial && !enabled) {
				bluetoothSerial.isEnabled(function() {
					deferred.resolve("Bluetooth is enabled.");
					enabled = true;
				},
				function() {
					deferred.reject("Bluetooth is not enabled.");
					enabled = false;
				});
			}
			else if (enabled) {
				deferred.reslove("Bluetooth already enabled!");
			}
			else {
				deferred.reject("BluetoothSerial plug-in not loaded.");
			}

			return deferred.promise;
		}

		function enable() {
			var deferred = $q.defer();

			if ($window.bluetoothSerial && !enabled) {
				bluetoothSerial.enable(function() {
					deferred.resolve("Bluetooth enabled!");
					enabled = true;
				},
				function() {
					deferred.reject("Bluetooth was <b>not</b> enabled.");
				});
			}
			else if (enabled) {
				deferred.reslove("Bluetooth already enabled!");
			}
			else {
				deferred.reject("BluetoothSerial plug-in not loaded.");
			}

			return deferred.promise;
		}
	};
})(angular);
