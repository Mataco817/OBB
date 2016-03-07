(function(angular){
	angular.module('rfduino-service', [])
	.service('rfduinoService', rfduinoService);

	rfduinoService.$inject = ['$q', '$timeout', '$window', 'settingsService'];
	function rfduinoService($q, $timeout, $window, settingsService) {
		var connectedDevice = {};
		var workoutCallback = false;
		var reading = false;
		var bytesRead = 0;
		var dataRead = [];
		var BYTES_TO_READ = 4 * 10;

		var service = {
			initializeDevice : function(device) {
				initializeDevice(device);
			},
			getConnectedDevice : getConnectedDevice,
			setWorkoutCallback : function(callback) {
				setWorkoutCallback(callback);
			},
			isEnabled : isEnabled,
			isConnected : isConnected,
			discoverDevices : discoverDevices,
		//	listDevices : listDevices,
			connect : function(device) {
				return connect(device);
			},
			disconnect : disconnect
		};

		return service;
		
		function initializeDevice(device) {
			isEnabled().then(function() {
				connect(device);
			});
		}

		function getConnectedDevice() {
			return connectedDevice;
		}
		
		function setWorkoutCallback(callback) {
			workoutCallback = callback;
		}

		function isEnabled() {
			var deferred = $q.defer();

			if ($window.rfduino) {
				rfduino.isEnabled(function() {
					deferred.resolve("Bluetooth is enabled.");
				},
				function() {
					deferred.reject("Bluetooth is not enabled.");
				});
			}
			else {
				deferred.reject("RFduino plug-in not loaded.");
			}

			return deferred.promise;
		}

		function isConnected() {
			var deferred = $q.defer();

			if ($window.rfduino) {
				rfduino.isConnected(function() {
					deferred.resolve("OpenBarbell is connected.");
				},
				function() {
					deferred.reject("OpenBarbell is not connected.");
				});
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

    			if ($window.rfduino) {
    				var devices = [];
    				var error = false;
    				
    				isEnabled().then(function() {
	    				rfduino.discover(3, function(device) {
	    					devices.push(device);
	    				},
	    				function() {
	    					error = true;
	    				});
    				
	    				$timeout(function() {
	    					if (!error) {
	    						deferred.resolve(devices);
	    					}
	    					else {
	    						deferred.reject("Could not find any devices.");
	    					}
	    				}, 3000);
    				},
    				function(reason) { 
    					deferred.reject(reason);
    				});
    			}
    			else {
    				deferred.reject("rfduino plug-in not loaded.");
    			}

    			return deferred.promise;
    		}

    		function connect(device) {
    			var deferred = $q.defer();

    			if ($window.rfduino) {
    				
    				isEnabled().then(function() {
	    				rfduino.connect(device.uuid, function() {
	    					deferred.resolve("Connected to " + device.name + "!");
	    					connectedDevice = device;
	
	    					/* Store settings of connected device */
	    					saveDeviceSettings(device);
	
	    					/* Subscribe to data callbacks */
	    					rfduino.onData(onReceive, onSubscribeFail);
	    				},
	    				function(error) {
	    					deferred.resolve("Failed to connected to " + device.name + "!");
	    					connectedDevice = {};
	    				});
    				},
    				function(reason) {
    					deferred.reject(reason);
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
    		
    		function saveDeviceSettings(device) {
    			settingsService.setSetting("deviceName", device.name);
    			settingsService.setSetting("deviceUUID", device.uuid);
    			settingsService.setSetting("deviceAdvertising", device.advertising);
    			settingsService.setSetting("deviceRSSI", device.rssi);
    		}

    		function onReceive(arrayBuffer) {
    			var data = new Uint8Array(arrayBuffer);
    			data.reverse();

    			var dv = new DataView(data.buffer);
    			var floatData = dv.getFloat32(0);
    			
    			bytesRead += arrayBuffer.byteLength;
    			
    			if (reading) {
        			dataRead.push(floatData);
    			}    			

    			if (floatData === -1234) { 
    				reading = true; 
					bytesRead = 4;
					dataRead = [];
    			}
    			
    			if (floatData === -6789 && reading) {
    				reading = false;
    				workoutCallback(constructRepData());
    			}
    		}

    		//TODO: Test subscribing with the device, otherwise may need read/timeouts
    		function onSubscribeFail() {
    			console.log("Failed to subscribe.");
    		}
    		
    		function constructRepData() {
    			return {
    				rep : dataRead[0],
    				rom : dataRead[2],
    				avgVel : dataRead[1],
    				peakVel : dataRead[3]
    			};
    		}
    		
    		function disconnect() {
    			
    		}
	};
})(angular);
