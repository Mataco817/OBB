(function(angular){
	angular.module('bluetooth-service', [])
		.service('bluetoothService', bluetoothService);

	bluetoothService.$inject = ['$q', '$timeout', 'settingsService'];
	function bluetoothService($q, $timeout, settingsService) {
		var connectedDevice = {};

		var service = {
			getConnectedDevice : getConnectedDevice,
			isEnabled : isEnabled,
			isConnected : isConnected,
			enable : enable,
			scanDevices : scanDevices,
			connect : function(device) {
				return connect(device);
			}
		};

		return service;

		function getConnectedDevice() {
			return connectedDevice;
		}

		var enabled = false;
		var connected = false;

		function isEnabled() {
//			return enabled;
			var deferred = $q.defer();

			bluetoothSerial.isEnabled(enabled, function() {
				deferred.resolve("Bluetooth is enabled.");
			},
			function() {
				deferred.reject("Bluetooth is not enabled.");
			});

			return deferred.promise;
		}

		function isConnected() {
//			return connected;
			var deferred = $q.defer();

			bluetoothSerial.isConnected(function() {
				deferred.resolve("Device is connected.");
				connected = true;
			},
			function() {
				deferred.reject("Device is not connected.");
			});

			return deferred.promise;
		}

		function enable() {
			var deferred = $q.defer();

			bluetoothSerial.enable(function() {
				deferred.resolve("Bluetooth enabled!");
				enabled = true;
			},
			function() {
				deferred.reject("Bluetooth was <b>not</b> enabled.");
			});

			return deferred.promise;
		}

		function scanDevices() {
			var deferred = $q.defer();

			bluetoothSerial.discoverUnpaired(function(devices) {
				deferred.resolve(devices);
			},
			function() {
				deferred.reject("Could not find any devices.");
			});

			return deferred.promise;
		}

		function connect(device) {
			var deferred = $q.defer();

			bluetoothSerial.connect(device.address, function() {
				deferred.resolve("Connected to " + device.name + "!");
				connectedDevice = device;
				connected = true;

//				bluetoothSerial.subscribe('\n', onReceive, onSubscribeFail);
			},
			function(error) {
				deferred.resolve("Failed to connected to " + device.name + "!");
				connectedDevice = {};
				connected = false;
			});

			return deferred.promise;
		}

		function onReceive(data) {
			//TODO: Do something with the data
		}

		//TODO: Test subscribing with the device, otherwise may need read/timeouts
		function onSubscribeFail() {
			console.log("Failed to subscribe.");
		}
	};
})(angular);
