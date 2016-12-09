(function() {
	angular.module('providers')
		.factory('ipc', ipc);

	ipc.$inject = [];

	function ipc() {
		const electron = require('electron'),
			  ipc      = electron.ipcRenderer;

		return ipc;

	}

})();
