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
