import { updateUsername, readConfig } from "./file-handling.js";
import type { CommandRegistry, CommandHandler } from "./commands.types.js";
import * as Cmds from "./commands.js";


function main() {
    const registry: CommandRegistry = {}
    Cmds.registerCommand(registry, "login", Cmds.handlerLogin);

    // Read and print the JSON file
    const currentConfig = readConfig();
    console.log(currentConfig);
}


main();
