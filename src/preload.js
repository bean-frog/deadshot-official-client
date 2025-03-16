const { ipcRenderer } = require('electron')

ipcRenderer.on('update_available', () => {
  console.log('Update available! Downloading...')
  alert('A new update is available. Downloading now...')
})

ipcRenderer.on('update_downloaded', () => {
  console.log('Update downloaded!')
  let response = confirm('Update downloaded! Restart now?')
  if (response) {
    ipcRenderer.send('restart_app')
  }
})
