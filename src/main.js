// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");

// stop squirrel from running app twice
if (require("electron-squirrel-startup")) app.quit();

const path = require("node:path");
const { ipcMain } = require("electron");

const { nativeImage, Tray, Menu } = require("electron");

// const trayIcon = nativeImage.createFromPath("./images/icon.ico");
const appIcon = nativeImage.createFromPath(
  path.join(__dirname, "../images", "icon.ico"),
);

const { getToday } = require("./utils");

/**
 * @type {BrowserWindow}
 */
var mainWindow;
/**
 * @type {Tray}
 */
var tray;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 220,
    height: 400,
    x: 50,
    y: 550,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      devTools: !app.isPackaged,
    },
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    icon: appIcon,
    skipTaskbar: true,
    title: "Desktop Prayer Times",
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

if (app.isPackaged) {
  app.setLoginItemSettings({
    openAtLogin: true,
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  tray = new Tray(appIcon);

  const contextMenu = Menu.buildFromTemplate([{ role: "quit" }]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Prayer Times");

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("getPrayerTimes", async () => {
  const geoRes = await fetch("http://ip-api.com/json/");
  const geo = await geoRes.json();
  
  const city = geo.city || "";
  const country = geo.country || "";
  const region = geo.regionName || "";
  
  const varurl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&state=${region}&date=today`;
  
  const url = new URL(varurl);

  const res = await fetch(url);

  /**
   * @type {PrayerTimesResponse}
   */
  const body = await res.json();
  return body;
});

ipcMain.on("log", (e, msg) => {
  console.log(msg);
});
ipcMain.on("error", (e, msg) => {
  console.error(msg);
});

// Listen for the custom contextmenu request
ipcMain.on("show-context-menu", (event, params) => {
  const customMenu = Menu.buildFromTemplate([{ role: "quit" }]);

  customMenu.popup({
    window: BrowserWindow.fromWebContents(event.sender),
    x: params.x,
    y: params.y,
  });
});

// Custom window dragging logic in the main process
ipcMain.on("window-drag", (event, { action, x, y }) => {
  if (action === "start") {
    // DO NOTHING
  } else if (action === "move") {
    const [currentX, currentY] = mainWindow.getPosition();
    mainWindow.setPosition(currentX + x, currentY + y);
  }
});

ipcMain.on(
  "currentPrayerTime",
  (event, { name, displayNames, displayTimes }) => {
    let toolTipTimes = "";
    for (let i = 0; i < displayNames.length; i++) {
      if (i > 0) toolTipTimes += "\n";
      toolTipTimes += `${displayNames[i]} at ${displayTimes[i]}`;
    }
    tray.setToolTip(`Prayer Times \n${name}\n----\n${toolTipTimes}`);
  },
);

