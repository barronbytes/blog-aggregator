import dotenv from "dotenv";
import path from "path";
import fs from "fs";


// --------------------
// DECLARATIONS
// --------------------


dotenv.config();
const DB_CONFIG_DIR = process.env.DB_CONFIG_DIR || "no directory";
const DB_CONFIG_FILE = process.env.DB_CONFIG_FILE || "no file";
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
 * Updates a username property in the JSON file.
 * If the file is missing or invalid, it's initializes with default values.
 */
export function updateUsername(username: string): void {
    let config: Config;

    try {
        // Returns object in camelCase
        config = readConfig();
    } catch (err) {
        // FAILSAFE: default object if reading fails
        config = {
            dbUrl: "postgresql://postgres:postgres@localhost:5432/gator?sslmode=disable",
            currentUserName: ""
        };
    }

    // Update the username and write to file
    config.currentUserName = username;
    writeConfig(config);
}
