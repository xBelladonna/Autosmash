const os = require("os");
const path = require("path");
const url = require("url");
const { app, BrowserWindow, Menu } = require("electron");
const menu = require("./electron/menu.js");

// The squirrel installer (Windows) opens the app a few times during installation/uninstallation... so we immediately yeet it
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
require("./electron/hook.js");



// Create a new electron BrowserWindow and load our page
function createWindow() {
    const appPath = path.join(app.getAppPath(), "src");
    window = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        backgroundColor: "#fff",
        webPreferences: {
            preload: path.join(appPath, "electron", "preload.js"),
            nodeIntegration: false,
            contextIsolation: false
        }
    });

    // Set the window icon per-platform
    switch (os.platform()) {
        case "win32":
            window.setIcon(path.join(appPath, "images", "icon.ico"));
            break;

        case "darwin":
            break; // TODO: Mac OS is a pain, screw it (for now)

        default:
            window.setIcon(path.join(appPath, "images", "icon.png")); // Use the png for every other platform
    }
    //window.setMenu(null); // Hide the menu bar since we don't need it

    // Set the menu bar
    Menu.setApplicationMenu(menu);

    // load the html index of the app
    windowUrl = url.format({
        pathname: path.join(appPath, "keysmash.html"),
        protocol: "file:",
        slashes: true
    });
    window.loadURL(windowUrl);

    // then export the webContents so we can require it as a node module
    module.exports.webContents = window.webContents;

    // Yeet the window when it's closed to save memory
    window.on("closed", () => {
        window = null;
    });
};