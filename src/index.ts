import { updateUsername, readConfig } from "./file-handling.js";


function main() {
    // Read and print the JSON file
    const currentConfig = readConfig();
    console.log(currentConfig);
}


main();
