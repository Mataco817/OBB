(function(angular) {
	angular
		.module('settings')
		.controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$timeout', 'settingsService', 'bluetoothService', 'rfduinoService'];
	function SettingsController($scope, $timeout, settingsService, bluetoothService, rfduinoService) {
		var vm = this;

		vm.bluetoothBtnText = "Enable Bluetooth";
		vm.scanBtnText = "Scan Devices"
		vm.disableBTBtn = false;
		vm.disableScanBtn = false;

		vm.set = set;
		vm.enableBluetooth = enableBluetooth;
		vm.btEnabled = false;
		vm.enabling = false;

		vm.deviceConnected = false;
		vm.scanning = false;
		vm.scanDevices = scanDevices;
		vm.devicesFound = devicesFound;
		vm.pairDevice = pairWithDevice;
		vm.unpairedDevices = [];

		vm.deviceName = function() { return getDeviceInfo('name'); };
		vm.deviceUUID = function() { return getDeviceInfo('uuid'); };
		vm.deviceAdvertising = function() { return getDeviceInfo('advertising'); };
		vm.deviceRSSI = function() { return getDeviceInfo('rssi'); };

		/*
		 * Internal Methods
		 */
		function set(setting, value) {
			settingsService.setSetting(setting, value);
		}

		function enableBluetooth() {
			if (vm.btEnabled) {
				vm.bluetoothBtnText = "Enabling Bluetooth...";
				vm.disableBTBtn = true;
				vm.enabling = true;
				vm.scanning = true;
	
				rfduinoService.enable()
				.then(function() {
					vm.bluetoothBtnText = "Bluetooth Enabled";
					vm.enabling = false;
					vm.scanning = false;
				},
				function(reason) {
					vm.bluetoothBtnText = "Enable Bluetooth";
					vm.disableBTBtn = false;
					vm.btEnabled = false;
					vm.enabling = false;
					vm.scanning = false;
				});
			}
		}

		function scanDevices() {
			vm.unpairedDevices = [];

			vm.scanBtnText = "Scanning...";
			vm.disableScanBtn = true;
			vm.scanning = true;

			rfduinoService.discoverDevices(vm.unpairedDevices)
			.then(function(reason) {
				vm.scanBtnText = "Scan Devices";
				vm.disableScanBtn = false;
				vm.scanning = false;
			},
			function(reason) {
				vm.scanBtnText = "Scan Devices";
				vm.disableScanBtn = false;
				vm.scanning = false;
			});
		}

		function devicesFound() {
			return vm.unpairedDevices && vm.unpairedDevices.length > 0;
		}

		function pairWithDevice(device) {
			vm.pairing = "indeterminate";

			rfduinoService.connect(device)
			.then(function(response) {
				vm.deviceConnected = true;
				delete vm.pairing;
			},
			function(reason) {
				vm.deviceConnected = false;
				delete vm.pairing;
			});
		}

		function getDeviceInfo(property) {
			return rfduinoService.getConnectedDevice()[property];
		}

		$scope.$on('syncSettings', function(event, args) {
			vm.units = settingsService.getSetting("units");
			vm.discoveryTimeout = settingsService.getSetting("discoveryTimeout");
			vm.setTimeoutInSec = settingsService.getSetting("setTimeoutInMillis") / 1000;

			rfduinoService.isEnabled()
			.then(function() {
			    vm.disableBTBtn = true;
				vm.bluetoothBtnText = "Bluetooth Enabled";
				vm.btEnabled = true;
				
				rfduinoService.isConnected()
				.then(function() {
					vm.deviceConnected = true;
				});
			});
		});

		$scope.$on('enableBluetooth',
		function(event, args) {
			vm.btEnabled = true;
			enableBluetooth();
		});

		$scope.$on('scanDevices',
		function(event, args) {
			scanDevices();
		});
	};
})(angular);
