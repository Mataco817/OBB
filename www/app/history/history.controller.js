(function(angular) {
	angular
		.module('history')
		.controller('HistoryController', HistoryController);
	
	HistoryController.$inject = ['$scope'];
	function HistoryController($scope) {
		var vm = this;

	};
})(angular);