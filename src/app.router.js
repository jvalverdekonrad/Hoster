/*
*	App routes configuration
*/

(function() {
	// Routing configuration (UI-router)
	angular.module('hoster').config(router);

	// Dependencies injection
	router.$inject = [
		'$stateProvider',
		'$urlRouterProvider'
	];

	function router($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/not-found-404');

		$stateProvider

		.state('main', {
			url: '/',
			templateUrl: 'pages/hostfile-editor/hostfile-editor.tpl.html',
			controller: 'hostFileEditorCtrl',
			controllerAs: 'hostFileEditor'
		});
	}

})();
