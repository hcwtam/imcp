// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // allow opening directory
  let srcDir, trgDir;

  ipcMain.on("selectSrcDirectory", selectSrcDirectory);
  ipcMain.on("selectTrgDirectory", selectTrgDirectory);

  // move file
  ipcMain.on("copyFiles", copyFiles);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // utils
  function selectSrcDirectory() {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
      })
      .then((res) => {
        if (res && !res.canceled) srcDir = res.filePaths[0];
      })
      .then(() => {
        mainWindow.webContents.send("srcDir", srcDir);
      });
  }

  function selectTrgDirectory() {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
      })
      .then((res) => {
        if (res && !res.canceled) trgDir = res.filePaths[0];
      })
      .then(() => {
        mainWindow.webContents.send("trgDir", trgDir);
      });
  }

  function copyFiles(_, startDate, endDate) {
    console.log(startDate);
    console.log(endDate);
    // const file = "test";
    // const srcFile = srcDir + "/" + file;
    // const destFile = trgDir + "/" + file;

    // fs.copyFile(srcFile, destFile, (err) => {
    //   if (err) throw err;
    //   console.log("File copied succesfully");
    // });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
