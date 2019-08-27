const fs = require("fs");
const path = require("path");
const { Menu } = require("electron");

// We are all equal in the grave
const templateFile = fs.readFileSync(path.join(__dirname, "menuTemplate.json"));
const menuTemplate = JSON.parse(templateFile);
const menu = new Menu.buildFromTemplate(menuTemplate);
module.exports = menu;