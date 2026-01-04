import type { CommandHandler, CommandRegistry } from "./commands.types.js";
import { updateUsername } from "./file-handling.js";


// --------------------
// COMMANDS SETUP
// --------------------


/**
 * Adds or updates a command handler to the registry.
 */
export function registerCommand(
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
export function runCommand(
    registry: CommandRegistry,
    cmdName: string,
    ...args: string[]
): void {
    const handler = registry[cmdName];

    if (!handler) {
        throw new Error(`Error: Failed to provide a "${cmdName}" with a handler function in registry.`);
    }

    handler(cmdName, ...args);
}


// --------------------
// COMMANDS
// --------------------


/*
* Login command sets the username in the config JSON file.
* Throws an error if exactly one argument for a username is not provided.
*/
export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length !== 1) {
        throw new Error(`Error: Failed to provide one "${args}" value for a username.`);
    }

    const username = args[0];
    updateUsername(username);
    console.log(`Username has been set to: ${username}`);
}
