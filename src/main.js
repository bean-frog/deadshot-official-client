const { app, BrowserWindow } = require('electron/main')
const { autoUpdater } = require('electron-updater')
const path = require('node:path')
const { ipcMain } = require('electron')

let mainWin, splash

function createMainWin() {
  mainWin = new BrowserWindow({
    width: 1600,
    height: 900,
    show: false, // initially hidden
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWin.loadURL('https://deadshot.io')

  mainWin.webContents.once('did-finish-load', () => {
    // Small delay for dramatic effect
    setTimeout(() => {
      if (splash) {
        splash.close()
      }
      mainWin.show()

      // Start checking for updates after the main window is shown
      checkForUpdates()
    }, 2000)
  })
}

function createSplashWin() {
  splash = new BrowserWindow({
    width: 512,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  })

  splash.loadFile('src/splash.html')
  splash.center()
}

// Auto-Updater Function
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    mainWin.webContents.send('update_available')
  })

  autoUpdater.on('update-downloaded', () => {
    mainWin.webContents.send('update_downloaded')
  })
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

// Install updates and restart when ready

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall()
})
