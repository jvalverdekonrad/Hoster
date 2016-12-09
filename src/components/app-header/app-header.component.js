(function() {
	angular.module('components')
		.component('appHeader', appHeader());

	function appHeader() {
		return {
			controller: 'appHeader as appHeader',
			templateUrl: 'components/app-header/app-header.tpl.html'
		};
	}

})();
