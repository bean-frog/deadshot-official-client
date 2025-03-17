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

// send game data for rpc
    window.addEventListener("message", (event) => {
        if (!event.data.includes("{")) { //stops {type:'gimmerich'} from being sent
            ipcRenderer.invoke('update-rpc', event.data)
        }
        
    });
    setInterval(() => {
        try {
            window.postMessage(JSON.stringify({type:'gimmerich'}))
        } catch (error) {
            console.log("bruh" + error)
        }
    }, 5000);
