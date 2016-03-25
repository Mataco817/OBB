(function(angular) {
	angular
		.module('shell')
		.controller('TabController', TabController);

	TabController.$inject = ['$scope', '$rootScope', '$window', 'settingsService', 'rfduinoService'];
	function TabController($scope, $rootScope, $window, settingsService, rfduinoService) {
		var vm = this;
		
		var $element = angular.element;
		
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
            var animated = $element.find('ui-view');
            $element(animated).removeClass('scrolled');
            $element(animated).removeClass('modal');
            var forward = toState.name > fromState.name;
            if (forward) {
              $element(animated[0]).removeClass('backward');
              switch (toState.name) {
                case 'tab.1':
                case 'tab.2':
                  $scope.anim = 'scrolled';
                  break;
                case 'tab.3':
                  $scope.anim = 'scrolled';
                  break;
              }
            } else {
              $element(animated[0]).addClass('backward');
              switch (toState.name) {
                case 'tab.1':
                  $scope.anim = 'scrolled';
                  break;
                case 'tab.2':
                case 'tab.3':
                  $scope.anim = 'scrolled';
                  break;
              }
            }
            $element(animated).addClass($scope.anim);
          });

		vm.selectedIndex = 0;

		vm.enableBluetooth = function() {
			vm.selectedIndex = 2;
			$scope.$broadcast('enableBluetooth', {});
		};

		vm.scanDevices = function() {
			vm.selectedIndex = 2;
			$scope.$broadcast('scanDevices', {});
		};

		vm.checkConnection = function() {
			$scope.$broadcast('checkConnectionStatus', {});
		};

		vm.syncSettings = function() {
			$scope.$broadcast('syncSettings', {});
		};
		
		$scope.$on('focusTab', function(event, args) {
			if (vm.selectedIndex !== args.index) {
				vm.selectedIndex = args.index;
			}
		});

		/****************** Cordova Events ******************/

		// Check status of bluetooth once plug-in is detected
//		var unbindWatcher = $scope.$watch(function() {
//			return $window.rfduino;
//		},
//		function(newValue, oldValue) {
//			if (newValue !== undefined) {
//				$scope.$broadcast('checkConnectionStatus', {});
//				
//				settingsService.initializeSettings()
//				.then(function() {
//					rfduinoService.initializeDevice();
//				});
//				
//				unbindWatcher();
//			}
//		});

		// Check status of bluetooth when app resumed
		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
			initialize();
			document.addEventListener("pause", onPause, false);
			document.addEventListener("resume", onResume, false);
		}
		
		function initialize() {
			$scope.$broadcast('checkConnectionStatus', {});
			
			settingsService.initializeSettings()
			.then(function() {
				rfduinoService.initializeDevice();
			});
		}

		// Handle the pause event
		function onPause() {

		}

		// Handle the resume event
		function onResume() {
			$scope.$broadcast('checkConnectionStatus', {});
		}
//        $mainScope = $scope;
	};
})(angular);
