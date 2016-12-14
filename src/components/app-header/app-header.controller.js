(function() {
	angular.module('components')
		.controller('appHeader', appHeader);

	appHeader.$inject = ['hostfile', 'ipc', '$rootScope'];

	const promptTemplateName = {
	  	title            : "Name your template!",
	  	type             : "input",
	  	showCancelButton : true,
	  	closeOnConfirm   : false,
	  	animation        : "slide-from-top",
	  	inputPlaceholder : "Write something..."
	};

	const confirmCloseConfig = {
	  title              : 'Close Hoster',
	  text               : 'Are you sure?',
	  type               : 'warning',
	  showCancelButton   : true,
	  confirmButtonColor : '#e74c3c',
	  confirmButtonText  : 'Yes',
	  closeOnConfirm     : false
	};

	const confirmOverriteConfig = {
	  title              : 'Duplicated template name',
	  text               : 'Do you whish to overrite it?',
	  type               : 'warning',
	  showCancelButton   : true,
	  confirmButtonColor : '#e74c3c',
	  confirmButtonText  : 'Yes',
	  closeOnConfirm     : false
	};

	function appHeader(hostfile, ipc, $rootScope) {
		const vm = this;

		vm.templates = [];

		vm.saveIntoDisc = () => {
			ipc.send('save-host-file', hostfile.getFileContent());
		};

		vm.askForTemplateName = () => {
			swal(
				promptTemplateName,
				(templateName) => {
				  if (templateName.trim() === '') {
				    swal.showInputError('You need to name the template!');
				  } else {
				  	hostfile.addTemplate(templateName);
				  }
				}
			);
		};

		vm.quitApplication = () => { 
			swal(
				confirmCloseConfig,
				() => {
				  ipc.send('app-quit');
				}
			);
		};

		vm.loadTemplate = (index) => {
			$rootScope.$broadcast('load-template', vm.templates[index]);
		};

		ipc.on('template-added', (event, updateTemplates) => {
			swal('Success!', 'Template added.', 'success');
			vm.templates = hostfile.formatTemplates(updateTemplates);
			$rootScope.$apply();
		});

		ipc.on('template-exists', (event, template) => {
			swal(
				confirmOverriteConfig,
				() => {
				  hostfile.addTemplate(template.name, true);
				}
			);
		});

		ipc.on('query-templates-reply', (event, templates) => {
			vm.templates = hostfile.formatTemplates(templates);
		});

		// -- Initializes the templates.
		ipc.send('query-templates');

	}

})();
