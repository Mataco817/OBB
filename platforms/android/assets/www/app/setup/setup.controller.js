(function(angular) {
	angular
		.module('setup')
		.controller('SetupController', SetupController)
	    .directive('userNameValidation', userNameValidation);

	SetupController.$inject = ['$scope', '$mdDialog', '$document'];
	function SetupController($scope, $mdDialog, $document) {
		var vm = this;
		
		vm.switchScreen = function() {
			$('#theTest2').slideUp("slow", function() {
				$('#theUltimateTest').slideDown("slow");
				$('#anotherTest').animate({opacity: '0.2'});
			});
		};
		
		$document.ready(function($event) {
			$mdDialog.show({
				parent: angular.element(document.body),
				templateUrl: 'app/setup/setup.html',
	        	targetEvent: $event,
	        	clickOutsideToClose: false,
	        	escapeToClose: false,
	        	autoWrap: false,
	        	preserveScope: true,
	        	scope: $scope
	        })
	        .then(function() {

	        }, function() {
	        	//You cancelled the dialog
	        });
		});
	};
	
	userNameValidation.$inject = ['mongodbService', '$q'];
	function userNameValidation(mongodbService, $q) {
		function processResponse(response) {
			if (response) {
				//If the name is already taken
				return $q.reject(true);
			}
			else {
				//If the name is not taken
				return $q.when(false);
			}
		}
		
		function validateUserName(modelValue, viewValue) {
			return mongodbService.getUserByName(modelValue).then(processResponse);
		}
		
		return {
			restrict: "A",
			require: "ngModel",
			link: function($scope, element, attrs, ngModel) {
				ngModel.$asyncValidators.userNameValidation = validateUserName;
			}
		}
	};
})(angular);