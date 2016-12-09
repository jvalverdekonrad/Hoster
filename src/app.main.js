/*
*	Modules definition
*/

(function() {
	// Pages module defition and injection
	angular.module('pages', []);
	// Components module defition and injection
	angular.module('components', []);
	// Providers module defition and injection
	angular.module('providers', []);
	// Utils module defition and injection
	angular.module('util', []);
	// Vendors module definition and injection
	angular.module('vendor', [
		'ui.router'
	]);
	// App main Module definition and injection
	angular.module('hoster', [
		'pages',
		'components',
		'providers',
		'util',
		'vendor'
	]);

})();
