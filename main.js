const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

require('dotenv').config();

let win = null;

// console.log(path.join(__dirname, 'src/index.html'));

app.on('ready', function() {

	// Initialize the window to our specified dimensions
	win = new BrowserWindow({width: 1500, height: 770, frame: true, icon: path.join(__dirname, 'dist/favicon.ico')});


	// Specify entry point
	if (process.env.PACKAGE === 'true') {
		win.setMenu(null);
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'dist/index.html'),
			protocol: 'file:',
			slashes: true
		}));
	} else {
		win.loadURL(process.env.HOST);
		win.webContents.openDevTools();
	}

	// Show dev tools
	// Remove this line before distributing
	// win.webContents.openDevTools();

	// Remove window once app is closed
	win.on('closed', function() {
		win = null;
	});

	app.on('activate', () => {
		if (win === null) {
			createWindow();
		}
	});

	app.on('window-all-closed', function() {
		if (process.platform != 'darwin') {
			app.quit();
		}
	});

})
