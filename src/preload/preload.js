const { contextBridge, ipcRenderer } = require("electron");

let indexBridge = {
  getPrayerTimes: async () => {
    /**
     * @type {PrayerTimesResponse}
     */
    const result = await ipcRenderer.invoke("getPrayerTimes");

    return result;
  },
  log: (msg) => {
    ipcRenderer.send("log", msg);
  },
  error: (msg) => {
    ipcRenderer.send("error", msg);
  },
  /**
   * @function setCurrentPrayerTime
   * @param {string} name
   * @param {string[]} displayNames
   * @param {string[]} displayTimes
   */
  setCurrentPrayerTime: (name, displayNames, displayTimes) => {
    ipcRenderer.send("currentPrayerTime", {
      name,
      displayNames,
      displayTimes,
    });
  },
};

contextBridge.exposeInMainWorld("indexBridge", indexBridge);
var isDragging = false;
// Handle the right-click (contextmenu) event
window.addEventListener("contextmenu", (event) => {
  event.preventDefault(); // Prevent the default browser context menu

  // Request main process to show the custom context menu
  ipcRenderer.send("show-context-menu", {
    x: event.clientX,
    y: event.clientY,
  });
});

