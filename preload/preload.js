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

// Custom window dragging logic
document.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    // Left mouse button for drag
    isDragging = true;
    startX = event.screenX;
    startY = event.screenY;

    // Tell the main process the drag has started
    ipcRenderer.send("window-drag", {
      action: "start",
      x: startX,
      y: startY,
    });
  }
});

document.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const deltaX = event.screenX - startX;
    const deltaY = event.screenY - startY;

    // Tell the main process to move the window
    ipcRenderer.send("window-drag", {
      action: "move",
      x: deltaX,
      y: deltaY,
    });

    startX = event.screenX;
    startY = event.screenY;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
