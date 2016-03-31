(function(angular) {
	angular
		.module('setup')
		.controller('SetupController', SetupController);

	SetupController.$inject = ['$scope', '$mdDialog', '$document'];
	function SetupController($scope, $mdDialog, $document) {
		var vm = this;
		
		$document.ready(function($event) {
			$mdDialog.show({
				parent: angular.element(document.body),
				templateUrl: 'app/setup/setup.html',
	        	targetEvent: $event,
	        	clickOutsideToClose: false,
	        	autoWrap: false
	        })
	        .then(function() {

	        }, function() {
	        	//You cancelled the dialog
	        });
		});
	};
})(angular);
