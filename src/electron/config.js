const platform = require('os').platform();

module.exports = {

	getHostFilePath : () => {
		return (platform === 'win32') ? 'C:/Windows/System32/Drivers/etc/hosts' : '/private/etc/hosts';
	},

	

}