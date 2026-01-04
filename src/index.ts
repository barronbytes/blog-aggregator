import { getArguments, getCmdAndArgs } from "./arguments.js";
import { readConfig } from "./file-handling.js";
import type { CommandRegistry } from "./commands.types.js";
import * as Cmds from "./commands.js";


function main() {
    // Register command
    const registry: CommandRegistry = {}
    Cmds.registerCommand(registry, "login", Cmds.handlerLogin);

    // Get CLI command name and arguments
    const args = getArguments();
    const [cmdName, cmdArgs] = getCmdAndArgs(registry, args);

    // Update username on JSON file
    Cmds.runCommand(registry, cmdName, ...cmdArgs);

    // Read and print the JSON file
    const currentConfig = readConfig();
    console.log(currentConfig);
}


main();
