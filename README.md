# Prayer Times Electron App

This app is a desktop application built using Electron that displays the daily Islamic prayer times for a given location. The prayer times are dynamically updated, highlighting the current prayer based on the system clock. It also integrates with the system tray for easy access to upcoming prayer times.

## Features

- **Prayer Time Display**: Shows the five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) and additional key times (Sunrise, Midnight).
- **Current Prayer Highlight**: The app automatically highlights the current prayer based on the time of day.
- **Tray Integration**: Displays upcoming prayer times in the system tray for quick access.
- **Dynamic Update**: Refreshes the prayer times in real-time every minute.
- **Custom Window Dragging**: Enables dragging of the entire window using mouse events.

## Technologies Used

- **Electron**: Cross-platform desktop framework for building desktop apps using web technologies.
- **JavaScript**: Core logic for the application.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Prayer Times API**: Used to fetch accurate prayer times.


## Installation

To run this application locally, follow the steps below:

### Prerequisites

- You must have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- [Electron](https://www.electronjs.org/).

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/prayer-times-electron.git
   ```

2. Navigate into the project directory:

   ```bash
   cd prayer-times-electron
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Run the app:

   ```bash
   npm start
   ```

## App Structure

### main.js

The `main.js` file is responsible for managing the main Electron process. It creates the main application window, controls the system tray, and handles inter-process communication (IPC) between the main and renderer processes.

- **Key Features**:
  - **BrowserWindow**: Creates a frameless window for displaying prayer times.
  - **Tray**: Displays the current and upcoming prayer times in the system tray.
  - **Custom Context Menu**: Allows custom right-click context menus.
  - **Window Dragging**: Implements custom window dragging logic, enabling movement of the app window through mouse events.
  - **API Call**: Fetches prayer times from the Aladhan API based on the user's city and state.

```js
// Sample of tray integration
ipcMain.on("currentPrayerTime", (event, { name, displayNames, displayTimes }) => {
  let toolTipTimes = "";
  for (let i = 0; i < displayNames.length; i++) {
    if (i > 0) toolTipTimes += "\n";
    toolTipTimes += `${displayNames[i]} at ${displayTimes[i]}`;
  }
  tray.setToolTip(`Prayer Times \n${name}\n----\n${toolTipTimes}`);
});
```

### preload.js

The `preload.js` file bridges the gap between Electron's main and renderer processes. It exposes certain Electron features to the front-end while ensuring security by isolating access to specific APIs.

- **Key Features**:
  - **Prayer Times Fetching**: Bridges the API call for fetching prayer times from the backend to the frontend.
  - **Custom Logging**: Logs messages from the front-end to the back-end.
  - **Custom Window Dragging**: Implements logic to enable dragging of the window using mouse events in the renderer process.
  - **Custom Context Menu**: Triggers the display of a custom context menu on right-click events.

```js
// Sample of exposing functionality in preload
contextBridge.exposeInMainWorld("indexBridge", {
  getPrayerTimes: async () => {
    const result = await ipcRenderer.invoke("getPrayerTimes");
    return result;
  },
  log: (msg) => {
    ipcRenderer.send("log", msg);
  },
});
```

### Frontend Logic

- The prayer times are fetched from an external API and cached to avoid redundant API calls.
- The app dynamically updates the prayer times based on the current time, highlighting the current prayer in the UI.
- The `index.js` file is responsible for parsing the fetched prayer times and updating the UI components accordingly.
  
```js
setInterval(() => {
  getPrayerTimes();
}, 1000);
```

### Custom Styling

The app is styled using Tailwind CSS and custom styles found in `styles.css` and `reset.css`. The UI is minimalist, focusing on clear and easily readable prayer times.

```html
<header class="relative pl-4 pt-3 bg-stone-900 h-[62px]">
  <h1 class="text-3xl">Current Prayer</h1>
</header>
<ul class="prayerList">
  <li class="prayerList_elem prayerList_elem--fajr">
    <h2>Fajr</h2>
    <div class="time">-:--</div>
  </li>
  <!-- Additional prayers -->
</ul>
```

## Prayer Times API

This app uses the [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api) to fetch accurate prayer times for the hardcoded location of **Pembroke Pines, Florida**. The API is free to use and provides various prayer times based on different calculation methods.

Please note that the location is currently hardcoded and cannot be customized by the user in this version of the app.

## Contributing

Feel free to submit issues or contribute to the project by opening pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgements

This project uses the [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api), which provides accurate prayer times for different locations. The API is free to use, and is governed by its own terms of use as outlined by Aladhan.

The use of the Aladhan API does not affect the MIT License of the project code itself.