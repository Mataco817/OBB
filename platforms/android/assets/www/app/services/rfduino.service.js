(function(angular){
	angular.module('rfduino-service', [])
	.service('rfduinoService', rfduinoService);

	rfduinoService.$inject = ['$q', '$timeout', '$window', 'settingsService'];
	function rfduinoService($q, $timeout, $window, settingsService) {
		var connectedDevice = {};
		var enabled = false;

		var service = {
			getConnectedDevice : getConnectedDevice,
			isEnabled : isEnabled,
			isConnected : isConnected,
			discoverDevices : discoverDevices,
			listDevices : listDevices,
			connect : function(device) {
				return connect(device);
			},
			disconnect : disconnect
		};

		return service;

		function getConnectedDevice() {
			return connectedDevice;
		}

		function isEnabled() {
			var deferred = $q.defer();

			if ($window.rfduino && !enabled) {
				rfduino.isEnabled(function() {
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
				deferred.reject("RFduino plug-in not loaded.");
			}

			return deferred.promise;
		}

		function isConnected() {
			var deferred = $q.defer();

			if ($window.rfduino && enabled) {
				rfduino.isConnected(function() {
					deferred.resolve("OpenBarbell is connected.");
				},
				function() {
					deferred.reject("OpenBarbell is not connected.");
				});
			}
			else if (!enabled) {
				deferred.reject("Bluetooth is not enabled!");
			}
			else {
				deferred.reject("rfduino plug-in not loaded.");
			}

			return deferred.promise;
		}

		/**
		 * Some REGEX for OpenBarbell Device detection "^(OB){1}\s{1}\d+$"
		 * 
		 * rfduino will call success callback each time a peripheral is discovered.
		 * @sampleDevice {
		 * 		"name": "RFduino",
		 *		"uuid": "AEC00232-2F92-4033-8E80-FD4C2533769C",
		 *		"advertising": "echo",
		 *		"rssi": -79
		 * }
		 */
		function discoverDevices() {
			var deferred = $q.defer();

			if ($window.rfduino && enabled) {
				// cannot resolve on first device! Resolve when timer is done
				rfduino.discover(3, function(device) {
					deferred.resolve(devices);
				},
				function() {
					deferred.reject("Could not find any devices.");
				});
			}
			else if (!enabled) {
				deferred.reject("Bluetooth is not enabled!");
			}
			else {
				deferred.reject("rfduino plug-in not loaded.");
			}

			return deferred.promise;
		}

		function connect(device) {
			var deferred = $q.defer();

			if ($window.rfduino && enabled) {
				rfduino.connect(device.uuid, function() {
					deferred.resolve("Connected to " + device.name + "!");
					connectedDevice = device;

					/* Store MAC Address of connected device */
					settingsService.setSetting("mac_address", device.address);

					//rfduino.subscribe('\n', onReceive, onSubscribeFail);
				},
				function(error) {
					deferred.resolve("Failed to connected to " + device.name + "!");
					connectedDevice = {};
				});
			}
			else if (!enabled) {
				deferred.reject("Bluetooth is not enabled!");
			}
			else {
				deferred.reject("rfduino plug-in not loaded.");
			}

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
