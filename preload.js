const { ipcRenderer, contextBridge } = require("electron");

window.ipcRenderer = ipcRenderer;
contextBridge.exposeInMainWorld("api", {
  selectDirectory: () => window.ipcRenderer.send("selectDirectory"),
});
