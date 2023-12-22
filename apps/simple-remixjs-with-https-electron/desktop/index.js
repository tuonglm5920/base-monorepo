/* eslint-disable @typescript-eslint/no-var-requires */

const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { join } = require('node:path');
const { initRemix } = require('../remix-electron-setup/index.cjs');

//#region Utilities
function getErrorStack(error) {
  return error instanceof Error ? error.stack || error.message : String(error);
}
//#endregion

/** @type {BrowserWindow | undefined} */
let win;

/** @param {string} url */
async function createWindow(url) {
  win = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  //#region Custom event
  ipcMain.handle('ping', () => 'pong');
  //#endregion

  await win.loadURL(url);
  win.show();
  // if (process.env.NODE_ENV === 'development') {
  win.webContents.openDevTools();
  // }
}

app.on('ready', () => {
  void (async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

        await installExtension(REACT_DEVELOPER_TOOLS);
      }

      /** @link https://github.com/itsMapleLeaf/remix-electron?tab=readme-ov-file#async-initremix-serverbuild-publicfolder-mode-getloadcontext- */
      const url = await initRemix({
        serverBuild: join(__dirname, '../build/index.js'),
      });
      await createWindow(url);
    } catch (error) {
      dialog.showErrorBox('Error', getErrorStack(error));
      console.error(error);
    }
  })();
});
