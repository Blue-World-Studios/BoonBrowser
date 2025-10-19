BoonBrowser - Final package (source + ready-to-build)
====================================================

This folder contains the final BoonBrowser source configured for Electron 38.3.0 with WebContentsView.
It includes a splash screen (index.html) that shows a spinning Boon-style moon and your Boonimage.png,
then fades into browser.html. The toolbar UI (toolbar.html) runs in a WebContentsView and communicates
with the main process via IPC (preload scripts).

To run locally for testing:
1. Install Node.js LTS.
2. Unzip this archive and open a terminal inside the BoonBrowser folder.
3. Run: npm ci
4. Run: npm start

To build a Windows installer (.exe) you can run:
1. Optionally ensure electron version: npm install electron@38.3.0 --save-dev
2. Install electron-builder: npm install --save-dev electron-builder
3. Run: npx electron-builder --win nsis
The packaged installer will appear in the `dist/` folder (requires Windows or GitHub Actions CI to build for Windows).
