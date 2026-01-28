import { getArguments } from "./arguments.js";
import type { CommandRegistry } from "./commands/commands.types.js";
import { COMMANDS, type CommandMeta } from "./commands/commands.meta.js";
import * as Cmds from "./commands/commands.js";


/**
 * Coordinates app activity
 */
async function main(): Promise<void> {
    // Get CLI command name and arguments
    const args = getArguments();
    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    // Dynamically register all commands from COMMANDS into a registry
    const registry: CommandRegistry = {}
    Object.values(COMMANDS).forEach((cmd: CommandMeta) => {
        Cmds.registerCommand(registry, cmd.name, cmd.handler);
    });

    // Runs a command handler from registry. Throws error if not found.
    await Cmds.runCommand(registry, cmdName, ...cmdArgs);

    // Exit program
    process.exit(0);
}


main();
