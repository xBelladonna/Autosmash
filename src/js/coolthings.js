let coolThingsToAddOntoTheEnd;
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200)
        coolThingsToAddOntoTheEnd = JSON.parse(xhr.response).data;
};
xhr.open("GET", "js/coolthings.json");
xhr.send();

let lastCoolThing = -1;

// Select a cool thing from the array
function getCoolThingToAddOntoTheEnd() {
    let coolThing;
    do {
        coolThing = Math.floor(Math.random() * coolThingsToAddOntoTheEnd.length);
    } while (coolThing == lastCoolThing);
    lastCoolThing = coolThing;
    return coolThingsToAddOntoTheEnd[coolThing];
}

// Generate a message with the cool thing added onto the end
function generateMessage() {
    let chance = Math.random();
    let msg;

    if (chance < 0.50)
        msg = `Here is your keysmash ${getCoolThingToAddOntoTheEnd()}:`;
    else if (chance >= 0.50 && chance <= 0.70)
        msg = `H-hewwo, hewe is youw keysmash owo ${getCoolThingToAddOntoTheEnd().replace(RegExp(/l|r/ig), "w").replace(RegExp(/th/ig), "d")}:`
    else msg = `Here, have some of my best work ${getCoolThingToAddOntoTheEnd()}:`;

    return msg;
}