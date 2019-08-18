const keysmash = require("./keysmash.js");
const io = require("iohook");
const clipboard = require("clipboardy");
const robot = require("robotjs");
const { ipcMain } = require("electron");

let charset = "asdfghjkl";

// Receive charset by ipc communication from renderer process
ipcMain.on("charset", (event, value) => {
    charset = value;
});

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

// Register hotkey (Insert) and call keysmash function on press
io.registerShortcut([61010], keys => {
    smash(charset);
});

io.start(); // Finally, start listening for events



// Generate keysmash, copy to clipboard, then "press" Ctrl + V
function smash(charset) {
    if (shift || capsLock) charset = charset.toUpperCase();
    const string = keysmash.ISOStandard(charset);
    clipboard.writeSync(string);
    robot.keyTap("v", "control");
}

// Wait for the given number of milliseconds
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}