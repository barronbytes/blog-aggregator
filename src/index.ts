import { getArguments } from "./arguments.js";
import { readConfig } from "./file-handling.js";
import type { CommandRegistry } from "./commands.types.js";
import { COMMANDS, type CommandMeta } from "./commands.meta.js";
import * as Cmds from "./commands.js";


/**
 * Coordinates app activity
 */
async function main(): Promise<void> {
    // Register command
    const registry: CommandRegistry = {}

    // Dynamically register all commands from COMMANDS
    Object.values(COMMANDS).forEach((cmd: CommandMeta) => {
        Cmds.registerCommand(registry, cmd.name, cmd.handler);
    });

    // Get CLI command name and arguments
    const args = getArguments();
    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    // Runs a command handler from registry. Throws error if not found.
    await Cmds.runCommand(registry, cmdName, ...cmdArgs);

    // Read and print the JSON file
    const currentConfig = readConfig();
    const dbUser = currentConfig.currentUserName;
    const dbConnection = currentConfig.dbUrl;
    console.log(`Database information: (user: ${dbUser}, connection: ${dbConnection}`);

    // Exit program
    process.exit(0);
}


main();
