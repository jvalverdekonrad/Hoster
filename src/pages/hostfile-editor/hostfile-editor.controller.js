(function() {

	angular.module('pages')
		.controller('hostFileEditorCtrl', hostFileEditorCtrl);

	hostFileEditorCtrl.$inject = ['hostfile', 'ipc', '$rootScope', '$scope'];

	function hostFileEditorCtrl(hostFile, ipc, $rootScope, $scope) {
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

		$scope.$on('load-template', (event, template) => {
			console.log('template', event, template);
			vm.editableHostFile = template.content;
			vm.save();
			swal('Success!', `${ template.name } has been applied!`, 'success');
		});

		// -- Initializes the view.
		ipc.send('query-host-file');

	}

})();
