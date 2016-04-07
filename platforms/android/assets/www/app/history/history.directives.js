(function(angular) {
	angular
		.module('history')
		/*
		 * This directive adjusts the position of the 
		 * history content based on the size of the toolbar
		 */
		.directive('myContent', function() {
			return {
				restrict : "A",
				link : function(scope, element, attrs) {
					scope.$watch(function() {
						return $('#history-toolbar').css("height");
					},
					function(newValue, oldValue) {
						element.css({
							"top" : newValue
						});
					});
				}
			};
		})
		/*
		 * This directive adjusts the width of the 
		 * history items based on the width of the screen
		 */
		.directive('myRecord', function() {
			return {
				restrict : "A",
				link : function(scope, element, attrs) {
					scope.$watch(function() {
						return element[0].parentElement.clientWidth;
					}, 
					function(value) {
						var widthAvailable = value;
						var ELEMENTS_PER_ROW = parseInt(widthAvailable / 108);
						var EXTRA_SPACE = widthAvailable - (108 * ELEMENTS_PER_ROW);
						var EXTRA_ELEMENT_WIDTH = parseInt(EXTRA_SPACE / ELEMENTS_PER_ROW);
						
						element.css({
							"width" : (100 + EXTRA_ELEMENT_WIDTH) + "px"
						});
					});
				}
			};
		});
})(angular);