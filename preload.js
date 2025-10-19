const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('appAPI', {
  onReady: (fn) => ipcRenderer.on('app-ready', fn)
});
