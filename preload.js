const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  selectSrcDirectory: () => ipcRenderer.send("selectSrcDirectory"),
  srcDir: (func) => ipcRenderer.on("srcDir", (_,...args) => func(...args)),
  selectTrgDirectory: () => ipcRenderer.send("selectTrgDirectory"),
  trgDir: (func) => ipcRenderer.on("trgDir", (_,...args) => func(...args)),
});
