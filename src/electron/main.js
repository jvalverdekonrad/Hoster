// -- Electron.
const electron      = require('electron'),
	  app           = electron.app,
	  BrowserWindow = electron.BrowserWindow,
	  ipc           = electron.ipcMain,
	  Menu          = electron.Menu;
	  
require('electron-debug')({showDevTools: true});

// -- Dev Dependencies.
const path         = require('path'),
	  url          = require('url'),
	  fs           = require('fs'),
	  ChildProcess = require('child_process'),
	  exec         = ChildProcess.exec;;
// -- Modules.
const config    = require('./config.js'),
	  Hoster    = require('./Hoster.js');

exec('NET SESSION', function(err,so,se) {
  const isAdmin = (se.length === 0) ? true : false; 

  if (isAdmin) {
  	Hoster.proced();
  } else {
  	Hoster.askForUAC();
  }

});