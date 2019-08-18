// Toggle caps lock and sync with physical caps lock state
function toggleCapsLock(event) {
    if (capsLock === false) {
        capsLock = true;
        capsToggle.checked = true;
    } else {
        let physicalState = event.getModifierState("CapsLock");
        if (physicalState == true) return;
        capsLock = false;
        capsToggle.checked = false;
    }
}

// Copy the keysmash to clipboard
function copyKeysmash() {
    window.getSelection().selectAllChildren(keysmashElement);
    document.execCommand("copy");
}

// Generate a cool thing, keysmash and play sfx if enabled
function lemmeSmash(charset) {
    let yeet = document.getElementById("yeet");
    if (sfx.checked) yeet.play();
    hereElement.innerHTML = generateMessage();
    generateKeysmash(charset);
}

// Actually generate the keysmash and display it
async function generateKeysmash(charset) {
    let keysmash;
    if (ISOStandardButton.checked) keysmash = ISOStandardKeysmash(charset);
    if (fourLetterButton.checked) keysmash = await fourLetterRepeatingKeysmash(charset);

    if (capsLock == true) {
        keysmashElement.innerHTML = keysmash.toUpperCase();
    } else keysmashElement.innerHTML = keysmash;

    if (generatedElement.style.display == "none")
        generatedElement.style = "display: block;";
    return;
}

function fetchKeysmash(charset) {
    /* Fetches a keysmash of a random type
    ** 50% chance of a "normal" keysmash like jhfgsjfhgdgjfhdsgkadfgldskgfhj
    ** 50% chance of a four letter repeating keysmash like asdfasdfasdfasdfasdf
    */

    let keysmash;
    let keysmashTypeChance = Math.random();
    if (keysmashTypeChance <= 0.50) keysmash = ISOStandardKeysmash(charset);
    else keysmash = fourLetterRepeatingKeysmash(charset);

    return keysmash;
}

function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}