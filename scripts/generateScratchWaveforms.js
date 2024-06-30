/**
 * @fileoverview This script creates waveforms of every Scratch sound ID in the library.
 * You need to run scripts/downloadScratchSounds.js before this.
 * 
 * IMPORTANT:
 * This script was only tested on Windows 10.
 * 
 * THE SCRIPT SHOULD BE RAN IN THE ROOT FOLDER LIKE THIS:
 * PenguinMod-ObjectLibraries> node scripts/generateScratchWaveforms.js
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

// STEP 1: fetch all the sounds
glob(`./cache/scratch_sounds/**`, { ignore: { ignored: p => /^(?!.*\.[a-z]+$).*/.test(p.name) } })
    .then(async paths => {
        for (const path of paths) {
            const newName = path.match(/([^\/\\]+?)(?=\.[^.]*$|$)/)[1];
            const outputFileName = `./files/scratch_sound_previews/${newName}.png`;

            console.log(`Processing file: ${path}`);
            await generateWaveform(path, outputFileName);
            console.log(`Created: ${newName}`);
        }
    });