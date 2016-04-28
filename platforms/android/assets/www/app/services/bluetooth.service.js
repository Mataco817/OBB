(function(angular){
	angular.module('bluetooth-service', [])
	.service('bluetoothService', bluetoothService);
	
	/*******************************
	 * Could possible be used for: *
	 * function @isEnabled         *
	 * function @enable            *
	 *******************************/

	bluetoothService.$inject = ['$q', '$timeout', '$window'];
	function bluetoothService($q, $timeout, $window) {
		// TODO: FOR TESTING WITHOUT DEVICE
//		var mock_bluetooth = {
//			enabled : false,
//			isEnabled : function(success, failure) {
//				$timeout(function() {
//					if ($window.bluetoothSerial.enabled) { success(); }
//					else { failure(); }
//				}, 1000);
//			},
//			enable : function(success, failure) {
//				$timeout(function() {
//					$window.bluetoothSerial.enabled = true;
//					success();
//				}, 1000);
//			}
//		};
//		$window.bluetoothSerial = mock_bluetooth;

		var service = {
			isEnabled : function() {
				return isEnabled();
			},
			enable : function() {
				return enable();
			}
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
