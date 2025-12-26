/**
 * @fileoverview This script fetches and downloads each Scratch library sound to cache/scratch_sounds.
 * 
 * IMPORTANT:
 * This script was only tested on Windows 10.
 * 
 * THE SCRIPT SHOULD BE RAN IN THE ROOT FOLDER LIKE THIS:
 * PenguinMod-ObjectLibraries> node scripts/downloadScratchSounds.js
 */

const fs = require('fs');
const path = require('path');

const scratchSoundIds = require("./scratch_sound_assetids.json");

// How long to wait inbetween fetching.
// We don't want to spam scratch's servers completely, even if it makes this take forever
const fetchDelay = 500; // milliseconds

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

if (!fs.existsSync(path.join(__dirname, "../cache"))) fs.mkdirSync(path.join(__dirname, "../cache"));
if (!fs.existsSync(path.join(__dirname, "../cache/scratch_sounds"))) fs.mkdirSync(path.join(__dirname, "../cache/scratch_sounds"));

(async () => {
    for (const assetExt of scratchSoundIds) {
        const url = `https://assets.scratch.mit.edu/internalapi/asset/${assetExt}/get/`;

        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filePath = path.join(__dirname, "../cache/scratch_sounds", assetExt);
        fs.writeFileSync(filePath, buffer);
        console.log("Successfully downloaded", assetExt);
        
        await delay(fetchDelay);
    }
})();