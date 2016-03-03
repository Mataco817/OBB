(function(angular){
	angular.module('bluetooth-service', [])
		.service('bluetoothService', bluetoothService);

	bluetoothService.$inject = ['$q', '$timeout', 'settingsService'];
	function bluetoothService($q, $timeout, settingsService) {
		var connectedDevice = {};
		var enabled = false;

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

		function isEnabled() {
			var deferred = $q.defer();

			if (window.bluetoothSerial && !enabled) {
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
			  //$timeout(function() {
			  if (enabled) {
			    deferred.resolve("Bluetooth is enabled.");
        }
        else {
			    deferred.reject("Initializing...");
			    //enabled = false;
        //}, 1000);
        }
			}

			return deferred.promise;
		}

		function isConnected() {
			var deferred = $q.defer();

			if (window.bluetoothSerial) {
        bluetoothSerial.isConnected(function() {
          deferred.resolve("Device is connected.");
        },
        function() {
          deferred.reject("Device is not connected.");
        });
			}
			else {
			  //$timeout(function() {
			  deferred.reject("Initializing...");
			  //}, 1000);
			}

			return deferred.promise;
		}

		function enable() {
			var deferred = $q.defer();

			if (window.bluetoothSerial) {
        bluetoothSerial.enable(function() {
          deferred.resolve("Bluetooth enabled!");
          enabled = true;
        },
        function() {
          deferred.reject("Bluetooth was <b>not</b> enabled.");
        });
			}

			return deferred.promise;
		}

		function scanDevices() {
			var deferred = $q.defer();

			if (window.bluetoothSerial) {
        bluetoothSerial.discoverUnpaired(function(devices) {
          deferred.resolve(devices);
        },
        function() {
          deferred.reject("Could not find any devices.");
        });
			}

			return deferred.promise;
		}

		function connect(device) {
			var deferred = $q.defer();

			if (window.bluetoothSerial) {
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
