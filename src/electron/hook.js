const os = require("os");
const io = require("iohook");
const clipboard = require("clipboardy");
const robot = require("robotjs");
const { ipcMain } = require("electron");
let window = require("../main.js");

let shift = false;
let capsLock = false;
let wait = false;

// Set modifiers on keydown
io.on("keydown", event => {
    // Set shift state to true
    if (event.keycode === 42) shift = true;

    // Toggle caps lock state
    if (event.keycode === 58 && capsLock === false) capsLock = true;
    else if (event.keycode === 58 && capsLock === true) capsLock = false;
});

// Set shift state to false when it's released
io.on("keyup", event => {
    if (event.keycode === 42) shift = false;
});

// Register hotkey (Ctrl + Space) and send request to renderer for a keysmash
// Also "debounce" for 200ms since the event keeps firing as long as the keys are held
switch(os.platform()) {
    case "win32":
        io.registerShortcut([29, 57], keys => requestKeysmash());
        break;

    case "darwin":
        io.registerShortcut([29, 57], keys => requestKeysmash()); // TODO: Gotta somehow find the right keys to register for a Mac (I don't have one)
        break;

    default:
        io.registerShortcut([29, 57], keys => requestKeysmash()); // I hope Linux platforms are consistent
        break;
}

// Listen for keysmashes from renderer and yeet it into whatever's focused
ipcMain.on("keysmash", async (event, value) => {
    if (shift || capsLock) value = value.toUpperCase(); // For some reason (at least on Windows) holding Shift stops it from pasting at all... w/e I tried.
    await clipboard.write(value);
    await paste();
});

io.start(); // Finally, start listening for events



// Ask renderer process to send us a keysmash
function requestKeysmash() {
    if (wait) return;
    wait = true;
    window.webContents.send("keysmash", null);
    setTimeout(() => { wait = false; }, 200);
};

// Paste properly depending on platform
function paste() {
    return new Promise(resolve => {
        switch(os.platform()) {
            case "win32":
                resolve(robot.keyTap("v", "control"));
                break;

            case "darwin":
                resolve(robot.keyTap("v", "command"));
                break;

            default:
                resolve(robot.keyTap("v", "control"));
                break;
        }
    });
}