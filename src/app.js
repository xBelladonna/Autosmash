const io = require("iohook");
const clipboard = require("clipboardy");
const robot = require("robotjs");
const { ipcMain } = require("electron");
let window = require("./main.js");

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
io.registerShortcut([29, 57], keys => {
    if (wait) return;
    wait = true;
    window.webContents.send("keysmash", null);
    setTimeout(() => { wait = false; }, 200);
});

// Listen for keysmashes from renderer and yeet it into whatever's focused
ipcMain.on("keysmash", async (event, value) => {
    if (shift || capsLock) value = value.toUpperCase();
    await clipboard.write(value);
    robot.keyTap("v"); // We only press "v" since we're already holding Ctrl (or Command)
});

io.start(); // Finally, start listening for events