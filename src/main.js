const { app, BrowserWindow } = require('electron/main')
const { autoUpdater } = require('electron-updater')
const path = require('node:path')
const { ipcMain } = require('electron')

let mainWin, splash
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
//app.commandLine.appendSwitch('show-fps-counter'); //debug

function createMainWin() {
  mainWin = new BrowserWindow({
    icon: "./logo.ico",
    width: 1600,
    height: 900,
    show: false, // initially hidden
    fullscreen: true,
    autoHideMenuBar: true,
webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  mainWin.loadURL('https://deadshot.io')

  mainWin.webContents.once('did-finish-load', () => {
    // Small delay for dramatic effect (also did-finish-load fires before content is shown)
    setTimeout(() => {
      if (splash) {
        splash.close()
      }
      mainWin.show()

      // autoupdater
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

const client = require('discord-rich-presence')('1350952795464794152');

client.updatePresence({
  state: 'Deadshot.io',
  details: 'Waiting...',
  largeImageText: "large image text",
  largeImageKey: "mobileicon",
  startTimestamp: Date.now(),

});

ipcMain.handle('update-rpc', (e, info) => {
const [timeLeft, mode, map, ingame] = JSON.parse(info);

client.updatePresence({
  state: `${timeLeft} remaining`,
  details: ingame ? `${mode} on ${map}` : "In the lobby",

});
})

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
