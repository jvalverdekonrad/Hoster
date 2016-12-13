(function() {
	angular.module('components')
		.controller('appHeader', appHeader);

	appHeader.$inject = ['hostfile', 'ipc', '$rootScope'];

	const swalPromptConfig = {
	  	title            : "Name your template!",
	  	type             : "input",
	  	showCancelButton : true,
	  	closeOnConfirm   : false,
	  	animation        : "slide-from-top",
	  	inputPlaceholder : "Write something..."
	};

	const swalConfirmConfig = {
	  title              : 'Close Hoster',
	  text               : 'Are you sure?',
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
				swalPromptConfig,
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
				swalConfirmConfig,
				() => {
				  ipc.send('app-quit');
				}
			);
		};

		vm.loadTemplate = (index) => {
			$rootScope.$broadcast('load-template', vm.templates[index]);
		};

		ipc.on('template-saved', (event, template) => {
			swal('Success!', 'Template added.', 'success');
		});

		ipc.on('template-exists', (event, template) => {
			swal(
				swalConfirmConfig,
				() => {
				  hostfile.addTemplate(template.name, true);
				}
			);
		});

		ipc.on('query-templates-reply', (event, templates) => {
			console.log('yo...?');
			console.log(Object.keys(templates));
			let formatedTemplates = [];

			for (let template in templates) {
				formatedTemplates.push({
					name : template,
					content : templates[template]
				});
			}

			vm.templates = formatedTemplates;
		});

		// -- Initializes the templates.
		ipc.send('query-templates');

	}

})();
