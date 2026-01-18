/**
 * Reference material:
 * File handling: https://medium.com/devcodesights/step-by-step-file-handling-in-node-js-for-beginners-773cda12a702
 * JSON methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 */
import dotenv from "dotenv";
import path from "path";
import fs from "fs";


// --------------------
// DECLARATIONS
// --------------------


dotenv.config();
const DB_URL = process.env.DB_URL || "";
const DB_CONFIG_DIR = process.env.DB_CONFIG_DIR || "";
const DB_CONFIG_FILE = process.env.DB_CONFIG_FILE || "";
type Config = {
    dbUrl: string,
    currentUserName: string
}

// --------------------
// FILE HANDLING
// --------------------


/**
 * Returns the absolute path for a data file.
 */
function getConfigFilePath(): string {
    return path.resolve(process.cwd(), DB_CONFIG_DIR, DB_CONFIG_FILE);
}


/**
 * Returns a valid Config object after validation.
 * Maps snake_case JSON keys to a typed camelCase Config object.
 */
function validateConfig(dataObject: any): Config {
    if (
        dataObject !== null &&
        typeof dataObject === "object" &&
        typeof dataObject.db_url === "string" &&
        typeof dataObject.current_user_name === "string"
    ) {
        return {
            dbUrl: dataObject.db_url,
            currentUserName: dataObject.current_user_name        
        };
    }
    throw new Error("VALIDATION_FAIL");
}


/**
 * Reads a JSON file, parses content, and returns a valid Config object.
 */
export function readConfig(): Config {
    const filePath = getConfigFilePath();

    if(!fs.existsSync(filePath)) {
        throw new Error(`Error: invalid file path: ${filePath}`);
    }

    try {
        const dataRaw = fs.readFileSync(filePath, "utf-8"); // string
        const dataParsed = JSON.parse(dataRaw);             // object in snake_case
        const dataConfig = validateConfig(dataParsed);      // object in camelCase
        return dataConfig;

    } catch (err: any) {
        if (err.message === "VALIDATION_FAIL") {
            throw new Error(`Error: validation failure for file: ${filePath}`);
        } else if (err instanceof SyntaxError) {
            throw new Error(`Error: parsing failure for file: ${filePath}`);
        } else {
            throw new Error(`Error: failure reading file: ${filePath}`);
        }    }
}


/**
 * Maps a camelCase Config object back to a snake_case JSON structure 
 * and writes it to a JSON file.
 */
function writeConfig(cfg: Config): void {
    const filePath = getConfigFilePath();

    try {
        // Convert camelCase Config back to snake_case for the JSON file
        const dataToSave = {
            db_url: cfg.dbUrl,
            current_user_name: cfg.currentUserName
        };

        // Convert to string and write to file
        const dataString = JSON.stringify(dataToSave, null, 2);
        fs.writeFileSync(filePath, dataString, "utf-8");

    } catch (err: any) {
        throw new Error(`Error: could not write to file: ${filePath}`);
    }
}


/**
 * Updates the current user name in the JSON config file.
 * Requires a valid database connection URL.
 * If config settings not found, initializes them with default values.
 */
export function updateUsername(username: string): void {
    let config: Config;

    if (!DB_URL) {
        throw new Error("Error: DB_URL is required but not set as an environment variable.");
    }

    try {
        // Returns object in camelCase
        config = readConfig();
    } catch (err) {
        // FAILSAFE: default object if reading fails
        config = {
            dbUrl: DB_URL,
            currentUserName: ""
        };
    }

    // Update the username and write to file
    config.currentUserName = username;
    writeConfig(config);
}
