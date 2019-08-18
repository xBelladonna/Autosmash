const ipc = require("electron").ipcRenderer; // Load Electron IPC communication

ipc.on("keysmash", (event, args) => {
    lemmeSmash(charset.value); // Generate a keysmash
    ipc.send("keysmash", keysmashElement.innerHTML); // Send the keysmash to the main process
});