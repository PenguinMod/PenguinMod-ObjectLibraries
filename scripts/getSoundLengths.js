/**
 * @fileoverview This script gets the length of every audio file in the sounds folder, as well as Scratch sounds.
 * 
 * IMPORTANT:
 * This script was only tested on Windows 10.
 * 
 * THE SCRIPT SHOULD BE RAN IN THE ROOT FOLDER LIKE THIS:
 * PenguinMod-ObjectLibraries> node scripts/getSoundLengths.js
 * 
 * Requirements:
 * FFMPEG
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { exec } = require('child_process');

function getAudioLength(audioFile) {
    audioFile = path.resolve(audioFile);

    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i "${audioFile}" -f null NUL 2>&1`;

        exec(cmd, { cwd: path.join(__dirname, "../") }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            const durationMatch = stdout.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
            if (!durationMatch) {
                reject("No duration");
                return;
            }
        
            // Convert duration to milliseconds
            const hours = parseFloat(durationMatch[1]);
            const minutes = parseFloat(durationMatch[2]);
            const seconds = parseFloat(durationMatch[3]);
            const durationMs = ((hours * 3600) + (minutes * 60) + seconds) * 1000;
            resolve(Math.round(durationMs));
        });
    });
}

const lengthObject = {
    penguinmod: {},
    scratch: {},
};

(async () => {
    await glob(`./files/sounds/**`, { ignore: { ignored: p => /^(?!.*\.mp3$).*/.test(p.name) } })
        .then(async _paths => {
            const paths = _paths.map(path => "./" + path.replace(/\\/g, "/"));
            for (const path of paths) {
                const saveName = path.replace("./files/", "");
    
                console.log(`Processing file: ${path}`);
                const length = await getAudioLength(path);
                lengthObject.penguinmod[saveName] = Number(length);
            }
        });

    const scratchSoundPath = path.join(__dirname, "../cache/scratch_sounds");
    if (fs.existsSync(scratchSoundPath)) {
        await glob(`./cache/scratch_sounds/**`, { ignore: { ignored: p => /^(?!.*\.[a-z]+$).*/.test(p.name) } })
            .then(async paths => {
                for (const path of paths) {
                    const saveName = path.match(/([^\/\\]+?)(?=\.[^.]*$|$)/)[1];
    
                    console.log(`Processing file: ${path}`);
                    const length = await getAudioLength(path);
                    lengthObject.scratch[saveName] = Number(length);
                }
            });
    }
        
    const filePath = path.join(__dirname, "../cache/sound_lengths.json");
    fs.writeFileSync(filePath, JSON.stringify(lengthObject, null, 4), "utf8");
})();