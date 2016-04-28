(function(angular){
	angular.module('util-service', [])
	.service('utilService', utilService);

	utilService.$inject = [];
	function utilService() {
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		
		var service = {
				getMonths : function() {
					return months;
				},
				getDays : function() {
					return days;
				}
		};
		
		return service;
	};
})(angular);