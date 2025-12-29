import fs from "fs";
import os from "os";
import path from "path";


// --------------------
// Declarations
// --------------------

const JSON_FILE_PATH = ".gatorconfig.json";

type Config = {
    dbUrl: string,
    currentUserName: string
}


// --------------------
// Helper Functions
// --------------------


function getConfigFilePath(): string {
    return path.resolve(os.homedir(), JSON_FILE_PATH);
}


function writeConfig(cfg: Config): void {
    const payload = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    }

    fs.writeFileSync(
        getConfigFilePath(),
        JSON.stringify(payload, null, 2),
        "utf-8"
    );
}


function validateConfig(rawConfig: any): Config {
    if (
        rawConfig !== null &&
        typeof rawConfig === "object" &&
        typeof rawConfig.db_url === "string" &&
        typeof rawConfig.current_user_name === "string"
    ) {
        return {
            dbUrl: rawConfig.db_url,
            currentUserName: rawConfig.current_user_name,
        };
    }
    throw new Error("Error: Invalid file structure.");
}


// --------------------
// Exported Functions
// --------------------


export function setUser(userName: string): void {
    const filePath = getConfigFilePath();
    let currentConfig: Config;

    if(fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        currentConfig = validateConfig(JSON.parse(raw));
    } else {
        currentConfig = {
            dbUrl: "",
            currentUserName: ""
        };
    }

    currentConfig.currentUserName = userName;
    writeConfig(currentConfig);
}

export function readConfig(): Config {
    const raw = fs.readFileSync(getConfigFilePath(), "utf-8");
    const parsed = JSON.parse(raw);
    return validateConfig(parsed);
}
