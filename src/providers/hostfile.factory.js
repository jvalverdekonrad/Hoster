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
					content: getFileContent()
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
