const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  selectSrcDirectory,
  srcDir,
  selectTrgDirectory,
  trgDir,
  copyFiles,
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

function copyFiles() {
  ipcRenderer.send("copyFiles");
}