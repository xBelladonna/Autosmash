const io = require("iohook");
const clipboard = require("clipboardy");
const robot = require("robotjs");
const { ipcMain } = require("electron");
let window = require("./main.js");

let shift = false;
let capsLock = false;

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

robot.setKeyboardDelay(500); // Refuse to smash (lmao) unless half a second has passed since the last smash

// Register hotkey (Ctrl + Space) and send request to renderer for a keysmash
io.registerShortcut([29, 57], keys => {
    window.webContents.send("keysmash", null);
});

// Listen for keysmashes from renderer and yeet it into whatever's focused
ipcMain.on("keysmash", (event, value) => {
    if (shift || capsLock) value = value.toUpperCase();
    clipboard.writeSync(value);
    robot.keyTap("v", "control");
});

io.start(); // Finally, start listening for events