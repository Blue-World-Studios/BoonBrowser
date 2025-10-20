// update.js
const { app, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  // Optional: show version checking info in console
  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for Boon Browser updates...");
  });

  autoUpdater.on("update-available", (info) => {
    console.log(`Update available: ${info.version}`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    console.log("Update downloaded. It will be installed on next restart.");
    dialog.showMessageBox({
      type: "info",
      title: "Boon Browser Update",
      message: "A new version has been downloaded. It will be installed the next time you restart Boon Browser.",
      buttons: ["OK"]
    });
  });

  autoUpdater.on("error", (err) => {
    console.error("Auto-update error:", err == null ? "unknown" : (err.stack || err).toString());
  });

  // Start checking for updates
  autoUpdater.checkForUpdatesAndNotify();
}

module.exports = { setupAutoUpdater };
