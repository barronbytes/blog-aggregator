import type { CommandHandler, CommandRegistry } from "./commands.types.js";
import { updateUsername } from "./file-handling.js";
import { createUser, getUserByName } from "./db-users-queries.js";


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
export async function runCommand(
    registry: CommandRegistry,
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const handler = registry[cmdName];

    if (!handler) {
        throw new Error(`Error: Failed to provide a "${cmdName}" with a handler function in registry.`);
    }

    await handler(cmdName, ...args);
}


// --------------------
// COMMANDS
// --------------------


/*
 * Validates that the command received exactly one argument.
 * Throws an error if the argument length is not 1.
*/
function isArgsOK(cmdName: string, ...args: string[]): void {
    if (args.length !== 1) {
        throw new Error(`Error: You must provide exactly one username to ${cmdName}.`);
    }
}


/*
* Login command: sets the username in the config JSON file.
* Throws an error if exactly one argument for a username is not provided.
*/
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    isArgsOK(cmdName, ...args);

    // Set username from args
    const username = args[0];

    // Exit program if user not registered.
    const user = await getUserByName(username);
    if (!user) {
        throw new Error(`Error: User "${username}" does not exist.`);
    }

    // Set current user in the config
    updateUsername(username);

    // Success message
    console.log(`User "${username}" has been set as the current user.`);
}


/**
 * Register command: sets the username in the config JSON file.
 * Currently identical to login handler, but separated for clarity.
 */
export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    isArgsOK(cmdName, ...args);

    // Set username from args
    const username = args[0];

    // Exit program if user previously registered.
    const existingUser = await getUserByName(username);
    if (existingUser) {
        throw new Error(`Error: User "${username}" already exists.`);
    }

    // Create new user and set user in the config
    const newUser = await createUser(username);
    updateUsername(username);

    // Success messages
    console.log(`User "${username}" has been registered and set as the current user.`);
    console.log("New user data: ", newUser);
}
