/*
 * This is for setting up the routing for the application
 */
(function(angular){
	angular.module('appRoutes', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('tab', {
		    url: '/tab',
			views: {
				'': {
				    templateUrl: 'app/shell/tabs.html',
				    controller: 'TabController',
				    controllerAs: 'tabCtrl'
				},
				'tab-workout@tab': {
					title: "Workout",
			        templateUrl: 'app/workout/tab-workout.html',
			        controller: 'WorkoutController',
			        controllerAs: 'workoutCtrl'
				},
				'tab-history@tab': {
					title: "History",
			        templateUrl: 'app/history/tab-history.html',
			        controller: 'HistoryController',
			        controllerAs: 'historyCtrl'
				},
				'tab-settings@tab': {
					title: "Settings",
			        templateUrl: 'app/settings/tab-settings.html',
			        controller: 'SettingsController',
			        controllerAs: 'settingsCtrl'
				}
			}
		})
		.state('tab.setup', {
			url: '/setup',
//			templateUrl: 'app/setup/setup.html',
			controller: 'SetupController',
			controllerAs: 'vm'
		});

		// if none of the above states are matched, use this as the fallback
//		$urlRouterProvider.otherwise('/tab');
	}]);
})(angular);