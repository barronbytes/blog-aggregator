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
        const dataString = fs.readFileSync(filePath, "utf-8");
        const dataObject = JSON.parse(dataString);
        const dataValidated = validateConfig(dataObject);
        return dataValidated;
    } catch (err: any) {
        if (err.message === "VALIDATION_FAIL") {
            throw new Error(`Error: validation failure for file: ${filePath}`);
        } else if (err instanceof SyntaxError) {
            throw new Error(`Error: parsing failure for file: ${filePath}`);
        } else {
            throw new Error(`Error: failure reading file: ${filePath}`);
        }    }
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