// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const {autoUpdater} = require("electron-updater")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 1000,
    width: 1200,
	frame: false,
	backgroundColor: '#111111',
    webPreferences: {
      experimentalFeatures: true,
	  nativeWindowOpen: true
    }
  })

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    {
      event.preventDefault()
      Object.assign(options, {
        modal: false,
        parent: mainWindow,
        width: 1100,
        height: 800
      })
      event.newGuest = new BrowserWindow(options)
    }
  })
	
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/docs/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow()
  autoUpdater.checkForUpdates();
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('updateReady')
})

//notify checking for updates
autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('updateCheck')
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.