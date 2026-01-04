import type { CommandHandler, CommandRegistry } from "./commands.types.js";


// --------------------
// COMMAND REGISTRATION
// --------------------


/**
 * Adds or updates a command handler to the registry.
 */
function registerCommand(
    registry: CommandRegistry,
    cmdName: string, 
    handler: CommandHandler
): void {
    registry[cmdName] = handler;
}


/**
 * Runs a command handler from the registry with its arguments.
 * Throws an error if the command does not exist.
 */
function runCommand(
    registry: CommandRegistry,
    cmdName: string,
    ...args: string[]
): void {
    const handler = registry[cmdName];

    if (!handler) {
        throw new Error(`Error: command name "${cmdName}" had no handler function in registry.`);
    }

    handler(cmdName, ...args);
}
