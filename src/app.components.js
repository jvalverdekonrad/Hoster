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

		const addTemplate = (name, override) => {
			ipc.send('add-template', {
				template: {
					name: name,
					content: service.getFileContent()
				},
				override : override || false
			});
		};

		const getTemplates = () => {
			ipc.send('get-templates');
		};

		const setTemplates = (templates) => {
			service.templates = templates;
		};

		// -- Event Handling.
		ipc.on('host-file-reply', (event, data) => {
			setFileContent(data);
		});

		ipc.on('host-file-saved', (event, data) => {
			setFileContent(data);
		});

		ipc.on('template-saved', () => {
			swal("Success!", "Template Added.", "success");
		});

		ipc.on('template-reply', (event, data) => {
			service.setTemplates(data);
		});

		return {
			getFileContent : getFileContent,
			setFileContent : setFileContent,
			getTemplates   : getTemplates,
			addTemplate    : addTemplate  
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

		vm.swalPromptConfig = {
		  title: "An input!",
		  text: "Write something interesting:",
		  type: "input",
		  showCancelButton: true,
		  closeOnConfirm: false,
		  animation: "slide-from-top",
		  inputPlaceholder: "Write something"
		};

		vm.saveIntoDisc = () => {
			ipc.send('save-host-file', hostfile.getFileContent());
		};

		vm.askForTemplateName = () => {
			swal(
				vm.swalPromptConfig,
				(inputValue) => {
				  if (inputValue === false) return false;
				  
				  if (inputValue === "") {
				    swal.showInputError("You need to write something!");
				  } else {
				  	swal("Nice!", `You wrote: ${inputValue}`, "success");
				  	ipc.send('validate-template', inputValue);
				  }
				  
				}
			);
		};

		vm.saveTemplate = (override) => {

			hostfile.addTemplate('This is a great test!', {
				template: {
					name: '',
					content: hostfile.getFileContent()
				},
				override: override || false
			});
		};

		ipc.on('validate-template-reply', (event, isTempalteValid) => {
			if (isTempalteValid) {
				vm.saveTemplate(true);
			} else {
				swal("That temmplate name already exist", "error");
				vm.askForTemplateName('');
			}
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
