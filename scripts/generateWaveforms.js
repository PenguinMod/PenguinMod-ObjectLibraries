/**
 * @fileoverview This script creates waveform previews of every audio file in the sounds folder.
 * 
 * IMPORTANT:
 * This script was only tested on Windows 10.
 * 
 * THE SCRIPT SHOULD BE RAN IN THE ROOT FOLDER LIKE THIS:
 * PenguinMod-ObjectLibraries> node scripts/generateWaveforms.js
 * 
 * Requirements:
 * FFMPEG
 */

const path = require('path');
const { glob } = require('glob');
const { exec } = require('child_process');

function generateWaveform(audioFile, outputFile) {
    audioFile = path.resolve(audioFile);
    outputFile = path.resolve(outputFile);

    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -y -i "${audioFile}" -filter_complex "showwavespic=s=200x200:colors=0xDE91DE" -update 1 "${outputFile}"`;

        exec(cmd, { cwd: path.join(__dirname, "../") }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

glob(`./files/sounds/**`, { ignore: { ignored: p => /^(?!.*\.mp3$).*/.test(p.name) } })
    .then(async _paths => {
        const paths = _paths.map(path => "./" + path.replace(/\\/g, "/"));
        for (const path of paths) {
            const newName = path.replace("./files/", "")
                .replace(/\//g, "_")
                .replace(".mp3", ".png");
            const outputFileName = `./files/sound_previews/${newName}`;

            console.log(`Processing file: ${path}`);
            await generateWaveform(path, outputFileName);
        }
    });