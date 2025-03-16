const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

let mainWin, splash

function createMainWin() {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Hide the main window initially
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWin.loadURL('https://deadshot.io')

  mainWin.webContents.once('did-finish-load', () => {
    setTimeout(() => { // Add a 2-second delay
      if (splash) {
        splash.close() // Close the splash screen
      }
      mainWin.show() // Show the main window
    }, 2000)
  })
}

function createSplashWin() {
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  })

  splash.loadFile('src/splash.html')
  splash.center()
}

app.whenReady().then(() => {
  createSplashWin()
  createMainWin()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWin()
      createMainWin()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
