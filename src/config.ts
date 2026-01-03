import dotenv from "dotenv";
import path from "path";
import fs from "fs";


// --------------------
// DECLARATIONS
// --------------------
dotenv.config();
const DATA_DIR = process.env.DATA_DIR || "no directory";
const DATA_FILE = process.env.DATA_FILE || "no file";
type Config = {
    dbUrl: string,
    currentUserName: string
}

// --------------------
// FILE HANDLING
// --------------------
function getConfigFilePath(): string {
    return path.resolve(process.cwd(), DATA_DIR, DATA_FILE);
}


function readConfig(): Config {
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


console.log(readConfig());
