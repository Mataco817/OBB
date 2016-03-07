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
		var START_READING = -1234;
		var STOP_READING = -6789;

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
			discoverDevices : function(deviceList) {
				discoverDevices(deviceList);
			},
		//	listDevices : listDevices,
			connect : function(device) {
				return connect(device);
			},
			disconnect : disconnect
		};

		return service;
		
		function initializeDevice(device) {
			connect(device);
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
		function discoverDevices(deviceList) {
    			var deferred = $q.defer();

    			if ($window.rfduino) {
    				var devices = [];
    				var error = false;
    				var timeout = settingsService.getSetting("discoveryTimeout");
    				var timeoutInMs = timeout * 1000;
    				
    				isEnabled().then(function() {
	    				rfduino.discover(timeout, function(device) {
	    					devices.push(device);
	    					deviceList.push(device);
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
	    				}, timeoutInMs);
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

    			if (floatData === START_READING) { 
    				reading = true; 
					bytesRead = arrayBuffer.byteLength;
					dataRead = [];
    			}
    			
    			if (floatData === STOP_READING) {
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
