import { NoArgCmds } from "./commands.meta.js";
import type { CommandHandler, CommandRegistry } from "./commands.types.js";
import { updateUsername, readConfig } from "./file-handling.js";
import { createUser, getUsers, getUserByName, resetTable } from "./db-users-queries.js";


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


/*
 * Validates that the command received exactly one argument.
 * Throws an error if the argument length is not 1.
*/
function isArgsOK(cmdName: string, ...args: string[]): void {
    const noArgCmds = NoArgCmds; // Commands that don't take arguments

    // Check to ensure user passes "npm run start reset" without args
    if (noArgCmds.includes(cmdName)) {
        if (args.length !== 0) {
            throw new Error(`Error: The "reset" command does not take any arguments.`);
        }
        return; // Skip further validation
    }

    // Check to ensure users passes "npm run start cmdName username"
    if (args.length !== 1) {
        throw new Error(`Error: You must provide exactly one username to ${cmdName}.`);
    }
}


// --------------------
// COMMANDS
// --------------------


/**
 * Register command: Creates user and sets the username in the config JSON file.
 * Throws an error if user is already registered.
 */
export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    isArgsOK(cmdName, ...args);

    // Set username from args
    const username = args[0];

    // Exit program if user previously registered
    const existingUser = await getUserByName(username);
    if (existingUser) {
        throw new Error(`Error: User "${username}" already exists.`);
    }

    // Create new user and set user in the config
    const newUser = await createUser(username);
    updateUsername(username);

    // Success messages
    console.log("New user data: ", newUser);
    console.log(`User "${username}" has been registered and set as the current user.`);
}


/*
* Login command: Sets the username in the config JSON file.
* Throws an error if user is not registered.
*/
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    isArgsOK(cmdName, ...args);

    // Set username from args
    const username = args[0];

    // Exit program if user not registered
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
 * Users command: Selects all users in the users table.
 * Throws an error if user sends arguments in CLI command.
 */
export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    isArgsOK(cmdName, ...args);

    // Selects all users from the users table
    const allUsers = await getUsers();

    // Selects current username
    const currentUserName = readConfig().currentUserName;

    // Success message
    const output = allUsers.map(user => {
        const marker = user.name === currentUserName ? " (current)" : "";
        return `* ${user.name}${marker}`;
    }).join("\n");
    console.log(output);
}


/**
 * Reset command: Deletes all users in the users table.
 * Throws an error if user sends arguments in CLI command.
 */
export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    isArgsOK(cmdName, ...args);

    // Deletes all rows from users table.
    await resetTable();

    // Success message
    console.log("Users table reset successfully.");
}
