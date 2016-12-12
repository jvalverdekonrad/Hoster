(function() {
	angular.module('components')
		.controller('appHeader', appHeader);

	appHeader.$inject = ['hostfile', 'ipc'];

	const swalPromptConfig = {
	  	title            : "An input!",
	  	text             : "Write something interesting:",
	  	type             : "input",
	  	showCancelButton : true,
	  	closeOnConfirm   : false,
	  	animation        : "slide-from-top",
	  	inputPlaceholder : "Write something"
	};

	const swalConfirmConfig = {
	  title: "Close Hoster",
	  text: "Are you sure?",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes",
	  closeOnConfirm: false
	};

	function appHeader(hostfile, ipc) {
		const vm = this;

		vm.templates = [];

		vm.saveIntoDisc = () => {
			ipc.send('save-host-file', hostfile.getFileContent());
		};

		vm.askForTemplateName = () => {
			swal(
				swalPromptConfig,
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

		vm.quitApplication = () => { 
			swal(
				swalConfirmConfig,
				() => {
				  ipc.send('app-quit');
				}
			);
		};

		ipc.on('validate-template-reply', (event, isTempalteValid) => {
			if (isTempalteValid) {
				vm.saveTemplate(true);
			} else {
				swal("That temmplate name already exist", "error");
				vm.askForTemplateName('');
			}
		});

		ipc.on('query-templates-reply', (event, templates) => {
			let formatedTemplates = [];

			for (let template in templates) {
				formatedTemplates.push({
					name : template,
					content : templates[templates]
				});
			}

			vm.templates = formatedTemplates;
		});

		// -- Initializes the templates.
		ipc.send('query-templates');

	}

})();
