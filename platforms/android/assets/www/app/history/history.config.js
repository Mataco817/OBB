(function(angular) {
	angular
		.module('history')
		.constant('config', {
			options : [{
				title : 'Select...',
				icon : 'img/icons/check_circle.svg'
			},{
				title : 'Comfy View',
				icon : 'img/icons/comfy_view.svg',
				disabled : true
			},{
				title : 'Day View',
				icon : 'img/icons/day_view.svg'
			},{
				title : 'Month View',
				icon : 'img/icons/month_view.svg',
				disabled : true
			},{
				title : 'Year View',
				icon : 'img/icons/year_view.svg',
				disabled : true
			}],
			DAY_VIEW : 'Day View',
			MONTH_VIEW : 'Month View'
		});
})(angular);