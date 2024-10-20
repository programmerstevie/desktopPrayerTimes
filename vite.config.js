import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import path from "path";

export default defineConfig({
  plugins: [
    electron([
      {
        entry: "../main.js", // Your Electron main process entry file
        vite: {
          build: {
            outDir: path.resolve(__dirname, "dist"),
          },
        },
      },
      {
        // Preload scripts entry file of the Electron App.
        entry: "../preload/preload.js",
        onstart(args) {
          // Notify the Renderer process to reload the page when the Preload scripts build is complete,
          // instead of restarting the entire Electron App.
          args.reload();
        },
        vite: {
          build: {
            outDir: path.resolve(__dirname, "dist"),
          },
        },
      },
    ]),
  ],
  root: "./src/frontend", // Set this to your source folder
});
