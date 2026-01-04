import { updateUsername, readConfig } from "./file-handling.js";


function main() {
    // Set a username and update the JSON file
    const username = "Jonathan";
    updateUsername(username);

    // Read and print the JSON file
    const currentConfig = readConfig();
    console.log(currentConfig);
}


main();
