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

		// Default value
		// Will have to eventually save user prefs
//		vm.units = settingsService.getSetting("units");

		vm.set = set;
		vm.enableBluetooth = enableBluetooth;
		vm.btEnabled = false;

		vm.deviceConnected = false;
		vm.scanning = false;
//		vm.pairing = false;
		vm.scanDevices = scanDevices;
		vm.devicesFound = devicesFound;
		vm.pairDevice = pairWithDevice;
		vm.unpairedDevices = [];

		vm.deviceName = function() { return getDeviceInfo('name'); };
		vm.deviceAddress = function() { return getDeviceInfo('address'); };

		/*
		 * Internal Methods
		 */
		function set(setting) {
			settingsService.setSetting(setting, vm.units);
		}

		function enableBluetooth() {
			vm.bluetoothBtnText = "Enabling Bluetooth...";
			vm.disableBTBtn = true;

			$timeout(function() {
				bluetoothService.enable()
				.then(function() {
					vm.bluetoothBtnText = "Bluetooth Enabled";
					vm.btEnabled = true;
				},
				function(reason) {
					vm.bluetoothBtnText = "Enable Bluetooth";
					vm.disableBTBtn = false;
				});
			}, 2000);
		}

		function scanDevices() {
			vm.unpairedDevices = [];

			vm.scanBtnText = "Scanning...";
			vm.disableScanBtn = true;
			vm.scanning = true;

			$timeout(function() {
				rfduinoService.discoverDevices()
				.then(function(devices) {
					vm.scanBtnText = "Scan Devices";
					vm.disableScanBtn = false;
					vm.scanning = false;

					vm.unpairedDevices = devices;
				},
				function(reason) {
					vm.scanBtnText = "Scan Devices";
					vm.disableScanBtn = false;
					vm.scanning = false;
				});
			}, 2000);
		}

		function devicesFound() {
			return vm.unpairedDevices && vm.unpairedDevices.length > 0;
		}

		function pairWithDevice(device) {
			vm.pairing = "indeterminate";

			$timeout(function() {
				rfduinoService.connect(device)
				.then(function(response) {
					vm.deviceConnected = true;
					delete vm.pairing;
				},
				function(reason) {
					vm.deviceConnected = false;
					delete vm.pairing;
				});
			}, 2000);
		}

		function getDeviceInfo(property) {
			return rfduinoService.getConnectedDevice()[property];
		}

		$scope.$on('syncSettings', function(params) {
			vm.units = settingsService.getSetting("units");

			bluetoothService.isEnabled()
			.then(function() {
			    vm.disableBTBtn = true;
				vm.bluetoothBtnText = "Bluetooth Enabled";
				vm.btEnabled = true;
			});
		});

		$scope.$on('enableBluetooth', function(params) {
			enableBluetooth();
		});

		$scope.$on('scanDevices', function(params) {
			scanDevices();
		});
	};
})(angular);
