const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const { setupAutoUpdater } = require("./update.js");
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('Boon Browser starting update check...');

const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0d1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'Boonimage.png'),
  });

  win.loadFile('index.html');
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

let win; // Declare win only once

function createWindow() {
  if (!win) { // Initialize win only if it hasn't been created yet
    win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0d1117',
    icon: path.join(__dirname, 'Boonimage.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater(); // 🔹 start the update checker
});

  // 💬 Enable auto-updater logging
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('Starting Boon Browser update check...');

  // Check for updates
  autoUpdater.checkForUpdates();

  // 🧠 Send update info to renderer (for alerts)
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
    win.webContents.send('update-status', 'Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info.version);
    win.webContents.send('update-status', `Update found! Version ${info.version}`);
  });

  autoUpdater.on('update-not-available', () => {
    log.info('No update available.');
    win.webContents.send('update-status', 'No update found.');
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
    win.webContents.send('update-status', `Error: ${err.message}`);
  });

  autoUpdater.on('download-progress', (progress) => {
    log.info(`Download speed: ${progress.bytesPerSecond} - ${progress.percent}%`);
    win.webContents.send('update-status', `Downloading... ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded. Installing now...');
    win.webContents.send('update-status', 'Update ready! Restarting...');
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 3000);
  });
});
autoUpdater.setFeedURL({ provider: "github", owner: "Blue-World-Studios", repo: "BoonBrowser" });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// Remove duplicate declaration
// let toolbarView, webView; // Remove win from this line
let win, toolbarView, webView;
const HOME = 'http://127.0.0.1:5500/boonhome.html';

function createWindow() {
  win = new BrowserWindow({
    width: 1200, height: 800, minWidth:800, minHeight:600, resizable:true,
    icon: path.join(__dirname, 'assets', 'Boonimage.png'),
    show: false,
    webPreferences: { contextIsolation:true, nodeIntegration:false, preload: path.join(__dirname, 'preload.js') }
  });
  mainWindow.setResizable(true);
mainWindow.setMinimumSize(800, 600);
mainWindow.webContents.on('did-finish-load', () => {
  mainWindow.webContents.executeJavaScript(`
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  `);
});


  // load splash index.html
  win.loadFile('index.html');

  win.webContents.once('did-finish-load', () => {
    // create toolbar view
    toolbarView = new WebContentsView({
      webPreferences: {
        preload: path.join(__dirname, 'toolbar_preload.js'),
        contextIsolation: true, nodeIntegration:false, sandbox:false
      }
    });
    win.contentView.addChildView(toolbarView);
    toolbarView.setBounds({ x:0, y:0, width: 1200, height: 64 });
    toolbarView.webContents.loadFile(path.join(__dirname, 'toolbar.html'));

    // create main web view
    webView = new WebContentsView({
      webPreferences: { contextIsolation:true, nodeIntegration:false, sandbox:false }
    });
    win.contentView.addChildView(webView);
    webView.setBounds({ x:0, y:64, width:1200, height:736 });
    webView.webContents.loadURL(HOME);

    // forward navigation events to toolbar
    webView.webContents.on('did-navigate', (e, url) => toolbarView.webContents.send('navigated', url));
    webView.webContents.on('did-navigate-in-page', (e, url) => toolbarView.webContents.send('navigated', url));
    webView.webContents.on('page-title-updated', (e, title) => toolbarView.webContents.send('title-updated', title));

    // IPC from toolbar
    ipcMain.on('navigate-to', (ev, url) => { if(url) webView.webContents.loadURL(url); });
    ipcMain.on('nav-back', () => { if(webView.webContents.canGoBack()) webView.webContents.goBack(); });
    ipcMain.on('nav-forward', () => { if(webView.webContents.canGoForward()) webView.webContents.goForward(); });
    ipcMain.on('nav-reload', () => webView.webContents.reload());
    ipcMain.on('go-home', () => webView.webContents.loadURL(HOME));
    ipcMain.on('open-devtools', () => webView.webContents.toggleDevTools());

    // signal index (splash) that app is ready to transition
    win.webContents.send('app-ready');

    // adjust bounds on resize
    win.on('resize', () => {
      const b = win.getBounds();
      toolbarView.setBounds({ x:0, y:0, width: b.width, height: 64 });
      webView.setBounds({ x:0, y:64, width: b.width, height: b.height - 64 });
    });

    // finally show the window
    setTimeout(()=> { if(win && !win.isDestroyed()) win.show(); }, 250);
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', ()=>{ if(process.platform!=='darwin') app.quit(); });
app.on('activate', ()=> { if(BrowserWindow.getAllWindows && BrowserWindow.getAllWindows().length===0) createWindow(); });
} // Closing brace for createWindow function
