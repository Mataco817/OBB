(function(angular){
	angular.module('settings-service', [])
	.service('settingsService', settingsService);

	settingsService.$inject = ['$q', '$timeout'];
	function settingsService($q, $timeout) {
		/* Connect to DB for user settings */
		var db = new PouchDB('obbSettings');
		
		var settings = {
			"units" : "Lbs",
			"devMode" : 2
		};

		var service = {
			initializeSettings : function() {
				initializeSettings();
			},
			getSetting : function(key) {
				return get(key);
			},
			setSetting : function(key, value) {
				set(key, value);
			}
		};

		return service;
		
		function initializeSettings() {
			/**
			 * Check if user settings have been setup
			 * @success => Sync Settings
			 * @failure => Create User Settings Doc
			 */
			
			db.get('userSettings')
			.then(function(userSettings) {
				settings.units = userSettings.units;
			})
			.catch(function(error) {
				db.put({
					_id : "userSettings",
					title : "User Settings",
					"units" : "Lbs"
				})
				.then(function(response) {
					console.log("Successfully created default user settings!");
				})
				.catch(function(error) {
					console.log(error);
				});
			});
		}
		
		function get(key) {
			return settings[key];
		}

		function set(key, value) {
			if (settings[key]) {
				settings[key] = value;
				
				var temp = key;
				
				db.get('userSettings')
				.then(function(userSettings) {
					userSettings[key] = value;
					
					return db.put(userSettings)
					.then(function(response) {
						console.log("Successfully updated user setting!");
					})
					.catch(function(error) {
						console.log(error);
					});
				})
				.catch(function(error) {
					console.log(error);
				});
			}
		}
	};
})(angular);