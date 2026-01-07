import { getArguments, getCmdAndArgs } from "./arguments.js";
import { readConfig } from "./file-handling.js";
import type { CommandRegistry } from "./commands.types.js";
import * as Cmds from "./commands.js";


async function main(): Promise<void> {
    // Register command
    const registry: CommandRegistry = {}
    Cmds.registerCommand(registry, "register", Cmds.handlerRegister);
    Cmds.registerCommand(registry, "users", Cmds.handlerUsers);
    Cmds.registerCommand(registry, "login", Cmds.handlerLogin);
    Cmds.registerCommand(registry, "reset", Cmds.handlerReset);

    // Get CLI command name and arguments
    const args = getArguments();
    const [cmdName, cmdArgs] = getCmdAndArgs(registry, args);

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
