(function() {
	angular.module('providers')
		.factory('hostfile', hostfile);

	hostfile.$inject = ['ipc'];

	function hostfile(ipc) {
		const service = this;

		const setFileContent = (fileContent) => {
			service.fileContent = fileContent;
		};

		const getFileContent = () => {
			return service.fileContent;
		};

		// -- Event Handling.
		ipc.on('host-file-reply', (event, data) => {
			setFileContent(data);
		});

		ipc.on('host-file-saved', (event, data) => {
			setFileContent(data);
		});

		return {
			getFileContent     : getFileContent,
			setFileContent     : setFileContent
		};
		
	}

})();

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

(function() {
	angular.module('components')
		.controller('appHeader', appHeader);

	appHeader.$inject = ['hostfile', 'ipc'];

	function appHeader(hostfile, ipc) {
		const vm = this;

		vm.saveIntoDisc = () => {
			ipc.send('save-host-file', hostfile.getFileContent());
		};

		vm.saveAsTemplate = () => {
			ipc.send('add-template', {
				template: {
					name: 'This is a great test!',
					content: hostfile.getFileContent()
				}
			});
		};

		ipc.on('template-saved', () => {
			swal("Success!", "Hostfile Updated.", "success");
		});

	}

})();

(function() {

	angular.module('pages')
		.controller('hostFileEditorCtrl', hostFileEditorCtrl);

	hostFileEditorCtrl.$inject = ['hostfile', 'ipc', '$rootScope'];

	function hostFileEditorCtrl(hostFile, ipc, $rootScope) {
		const vm = this;

		// -- IPC Event handlers
		ipc.on('host-file-saved', (event, savedHostFile) => {
			hostFile.content   = savedHostFile;
			vm.currentHostFile = savedHostFile;
			$rootScope.$apply();
			swal("Success!", "Hostfile Updated.", "success");
		});

		ipc.on('host-file-reply', (event, data) => {
			vm.currentHostFile  = data;
			vm.editableHostFile = data;
			$rootScope.$apply();
		});

		vm.save = () => {
			hostFile.setFileContent(vm.editableHostFile);
		};

		// -- Initializes the view.
		ipc.send('query-host-file');

	}

})();
