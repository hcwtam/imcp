// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const PHONE_PATH = "/run/user/1000/gvfs/"; // assume OS is linux and UID is 1000
let phoneDir;

function createWindow() {
  let srcDir = phoneDir;
  let trgDir;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      additionalArguments: [phoneDir],
    },
  });

  // allow opening directory

  ipcMain.on("selectSrcDirectory", selectSrcDirectory);
  ipcMain.on("selectTrgDirectory", selectTrgDirectory);

  // move file
  ipcMain.on("copyFiles", copyFiles);

  // on reset
  ipcMain.on("reset", reset);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

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
    const start =
      startDate.substring(0, 4) +
      startDate.substring(5, 7) +
      startDate.substring(8, 10); // original format is yyyy-mm-dd
    const end =
      endDate.substring(0, 4) +
      endDate.substring(5, 7) +
      endDate.substring(8, 10); // original format is yyyy-mm-dd

    fs.readdir(srcDir, function (err, files) {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }

      let filesCount = 0;
      files.forEach(function (file) {
        const namePrefix = file.substring(0, 8); // e.g. "20220107"
        if (+namePrefix >= start && +namePrefix <= end) {
          const srcFile = srcDir + "/" + file;
          const destFile = trgDir + "/" + file;

          fs.copyFile(srcFile, destFile, (err) => {
            if (err) throw err;
          });
          filesCount++;
        }
      });
      mainWindow.webContents.send("success", `${filesCount} files copied succesfully!`);
      console.log(`${filesCount} files copied succesfully!`);
    });
  }

  function reset() {
    srcDir = "";
    trgDir = "";
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // On app start, look for DCIM directory for phone, set it to srcDir if it's found
  const files = fs.readdirSync(PHONE_PATH);
  if (files.length > 0) {
    phoneDir = PHONE_PATH + files[0] + "/Phone/DCIM/Camera";
  }
  
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
