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
