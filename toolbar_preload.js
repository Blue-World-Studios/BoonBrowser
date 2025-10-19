const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('toolbarAPI', {
  navigate: (url) => ipcRenderer.send('navigate-to', url),
  back: () => ipcRenderer.send('nav-back'),
  forward: () => ipcRenderer.send('nav-forward'),
  reload: () => ipcRenderer.send('nav-reload'),
  devtools: () => ipcRenderer.send('open-devtools'),
  home: () => ipcRenderer.send('go-home'),
  onNavigated: (fn) => ipcRenderer.on('navigated', (e, url) => fn(url)),
  onTitleUpdated: (fn) => ipcRenderer.on('title-updated', (e, title) => fn(title))
});
