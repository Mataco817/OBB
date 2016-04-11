(function(angular) {
	angular
		.module('history')
		.directive('myContent', ['$timeout', function($timeout) {
			return {
				restrict : "A",
				link : function(scope, element, attrs) {
					/* Watch to see if toolbar size changes */
					scope.$watch(function() {
						return $('#history-toolbar').css("height");
					}, positionContentTop);
					
					/* Watch to see if width of screen changes */
					scope.$watch(function() {
						return element[0].clientWidth;
					}, adjustCardWidth);
					
					function positionContentTop(newValue, oldValue) {
						element.css({
							"top" : newValue
						});
					}
					
					function adjustCardWidth(value) {
						var elementWidth;
						if (!scope._defaultWidth) {
							elementWidth = $('.history-card').css("width");
							
							// No DOM elements yet with that class
							if (!elementWidth) {
								$timeout(function() {
									adjustCardWidth(value);
								}, 500);
								return;
							}
							else {
								scope._defaultWidth = parseInt(elementWidth);
								elementWidth = scope._defaultWidth;
							}
						}
						else {
							elementWidth = scope._defaultWidth;
						}

						var widthAvailable = value;
						var ELEMENTS_PER_ROW = parseInt(widthAvailable / (elementWidth + 8));
						var EXTRA_SPACE = widthAvailable - ((elementWidth + 8) * ELEMENTS_PER_ROW);
						var EXTRA_ELEMENT_WIDTH = parseInt(EXTRA_SPACE / ELEMENTS_PER_ROW);
						
						scope.cardWidthAdjust = {
							"width" : (elementWidth + EXTRA_ELEMENT_WIDTH) + "px"
						};
					}
				}
			};
		}]);
})(angular);