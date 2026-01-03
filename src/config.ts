import dotenv from "dotenv";
import path from "path";
import os from "os";
import fs from "fs";


// --------------------
// DECLARATIONS
// --------------------

const DATA_DIR = process.env.DATA_DIR || "no directory";
const DATA_FILE = process.env.DATA_FILE || "no file";

// --------------------
// FILE HANDLING
// --------------------

function getConfigFilePath(): string {
    return path.resolve(os.homedir(), DATA_DIR, DATA_FILE);
}

function readConfig(): string {
    const filePath = getConfigFilePath();

    if(!fs.existsSync(filePath)) {
        throw new Error("Error: invalid file path: ${filePath}");
    }

    try {
        const dataString = fs.readFileSync(filePath, "utf-8");
        const dataObject = JSON.parse(dataString);
        return dataObject;
    } catch (err) {
        throw new Error("Error:");
    }
}

console.log(readConfig());