// -- Electron.
const electron      = require('electron'),
	  app           = electron.app,
	  BrowserWindow = electron.BrowserWindow,
	  Menu          = electron.Menu;
// -- Module Dependencies.
const path         = require('path'),
	  url          = require('url');
// -- Dependencies.
const config   = require('./config.js'); 
	  HostFile = require('./HostFile.js');

const Hoster = function () {
	const Hoster = this;
	let eventEmitter = null;

	Hoster.window = null;

	Hoster.HostFile = new HostFile(config.getHostFilePath());

	Hoster.init = () => {
		Hoster.HostFile.init();

		Hoster.window = new BrowserWindow();
		eventEmitter = Hoster.window.webContents;

		Hoster.window.maximize();
		Hoster.window.loadURL(url.format({
		    pathname: path.join(__dirname, '../', 'index.html'),
		    protocol: 'file:',
		    slashes: true
		}));

		Menu.setApplicationMenu(Menu.buildFromTemplate(
			// -- Menu template.
			[
				{
					label: 'Quit',
					click: () => {
						app.quit();
					},
					accelerator : 'Ctrl+Q'
				}
			]
		));

		Hoster.window.on('closed', Hoster.handleClose);
	};

	// UAC -> User Access Control.
	Hoster.proced    = () => { eventEmitter.send('UAC-granted');  };
	Hoster.askForUAC = () => { eventEmitter.send('UAC-required'); };

	Hoster.handleClose = () => {
		console.log('closed');
		Hoster.window = null;
	};

	// App Event Handling.
	app.on('ready', Hoster.init);

};

module.exports = new Hoster();