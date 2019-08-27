const { remote } = require("electron");
const ipc = require("electron").ipcRenderer; // Load Electron IPC communication
const menu = remote.require("./electron/menu.js");

// Make the menu pop up as a context-menu on a right-click
document.addEventListener("contextmenu", event => {
    menu.popup();
});

// Edit the HTML to be specific to the Electron app once the DOM content is finished loading
document.addEventListener("DOMContentLoaded", () => {
    const linkApp = document.getElementById("link-app");
    linkApp.style.display = "none"

    const linkSourceCode = document.getElementById("link-source-code");
    linkSourceCode.href = "#";
    linkSourceCode.addEventListener("click", () => require("electron").shell.openExternal("https://github.com/xBelladonna/Autosmash"));

    // Change the home link text while we're at it and open it in the external browser
    const linkHome = document.getElementById("link-home");
    linkHome.innerHTML = linkHome.innerHTML.replace("Go back home", "Visit the website");
    linkHome.href = "#";
    linkHome.addEventListener("click", () => require("electron").shell.openExternal("https://nightshade.fun"));

    const hint = document.getElementById("electron-hint");
    hint.style.display = "block"
});

// Then set up our IPC listener to send stuff between the renderer and the main process
ipc.on("keysmash", (event, args) => {
    lemmeSmash(charset.value); // Generate a keysmash
    ipc.send("keysmash", keysmashElement.innerHTML);
});