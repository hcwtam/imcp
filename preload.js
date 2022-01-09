const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  selectSrcDirectory,
  srcDir,
  selectTrgDirectory,
  trgDir,
  copyFiles,
  success,
});

contextBridge.exposeInMainWorld("props", {
  phoneDir: window.process.argv[window.process.argv.length - 1],
});

function selectSrcDirectory() {
  ipcRenderer.send("selectSrcDirectory");
}

function srcDir(func) {
  ipcRenderer.on("srcDir", (_, ...args) => func(...args));
}

function selectTrgDirectory() {
  ipcRenderer.send("selectTrgDirectory");
}

function trgDir(func) {
  ipcRenderer.on("trgDir", (_, ...args) => func(...args));
}

function copyFiles(startDate, endDate) {
  ipcRenderer.send("copyFiles", startDate, endDate);
}

function success(func) {
  ipcRenderer.on("success", (_, ...args) => func(...args));
}
