// -- Electron.
const electron      = require('electron'),
	  ipc           = electron.ipcMain;
// -- Dependencies.
const fs       = require('fs'),
	  chokidar = require('chokidar');
// -- Watcher
	  templatesWatcher = chokidar.watch('./src/electron/templates.json');

module.exports = function (path) {
	const hf = this;
	// -- Members.
	hf.path      = path;
	hf.templates = null;
	hf.content   = null;

	//  -- Methods.
	hf.open = () => {
		fs.openSync(hf.path, 'r+');
	};

	hf.read = () => {
		 hf.content = fs.readFileSync(hf.path, 'utf8');
	};

	hf.save = (sender, content) => {
		hf.writeFile(hf.path, content, () => {
			console.log('The file was saved correctly');
			sender.send('host-file-saved', content);
		});
	};

	hf.getTemplates = () => {
		return JSON.parse(fs.readFileSync('./src/electron/templates.json', 'utf8'));
	};

	hf.readTemplates = () => {
		hf.templates = hf.getTemplates();
	};

	hf.addTemplate = (sender, newTemplate, override) => {
		const valid = (hf.templates.hasOwnProperty(newTemplate.name)) ? (override) ? true : false : true;

		if (valid) {
			let templateFormat = {};
			templateFormat[newTemplate.name] = newTemplate.content;

			hf.writeFile('./src/electron/templates.json', JSON.stringify(Object.assign(templateFormat, hf.templates)), () => {
				hf.readTemplates();
				sender.send('template-added', hf.templates);
			});
		} else {
			sender.send('template-exists', newTemplate);
		}

	};

	hf.writeFile = (path, data, sucess) => {
		fs.writeFile(path, data, (error) => {
			if(error) {
				console.log(error);
			} else {
				sucess();
			}
		});
	};

	hf.events = () => {
		// -- IPC Event handling.
		ipc.on('query-host-file', (event, arg) => {
			event.sender.send('host-file-reply', hf.content);
		});

		ipc.on('save-host-file', (event, data) => {
			hf.save(event.sender, data);
		});

		ipc.on('add-template', (event, data) => {
			hf.addTemplate(event.sender, data.template, data.override || false);
		});

		ipc.on('query-templates', (event, arg) => {
			event.sender.send('query-templates-reply', hf.getTemplates());
		});

	};

	hf.init = () => {
		hf.open();
		hf.read();
		hf.events();
		hf.readTemplates();
	};

};