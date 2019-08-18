const os = require("os");
const path = require("path");
const { app, BrowserWindow } = require("electron");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
    app.quit();
}

let window; // Store the window object in a global so it doesn't get yeeted by the GC

app.on("ready", createWindow); // Once initialized, create our window

// Exit the app on window close unless we"re on a Mac, then leave it in the dock
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// Create a new window if the user clicks the icon in the Mac OS dock
app.on("activate", () => {
    if (!window) createWindow();
});

// Finally, load the rest of the app
require("./hook.js");



// Create a new electron BrowserWindow and load our page
function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#fff",
        webPreferences: {
            preload: path.join(app.getAppPath(), "src/preload.js"),
            nodeIntegration: true
        }
    });

    // Set the window icon per-platform
    switch (os.platform()) {
        case "win32":
            window.setIcon(path.join(__dirname, "images/icon.ico"));
            break;

        case "darwin":
            break; // TODO: Mac OS is a pain, screw it (for now)

        default:
            window.setIcon(path.join(__dirname, "images/icon.png")); // Use the png for every other platform
    }
    window.setMenu(null); // Hide the menu bar since we don't need it

    // and load the index.html of the app.
    window.loadURL(`file://${__dirname}/keysmash.html`);

    // then export the window so we can use it in node
    exports.webContents = window.webContents;

    // Yeet the window when it's closed to save memory
    window.on("closed", () => {
        window = null;
    });
};