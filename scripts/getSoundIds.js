const fs = require("fs");
const path = require('path');

const soundLib = require("./sound_lib.json");
const assetArray = [];

for (const asset of soundLib) {
    if (asset.fromPenguinModLibrary) continue;
    assetArray.push(asset.md5ext);
}

const filePath = path.join(__dirname, "scratch_sound_assetids.json");
fs.writeFileSync(filePath, JSON.stringify(assetArray, null, 4), "utf8")