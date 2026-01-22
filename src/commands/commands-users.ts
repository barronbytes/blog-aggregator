import { updateUsername, readConfig } from "../file-handling.js";
import { createUser, getUsers, getUserByName, resetTable } from "../db/db-users-queries.js";


/**
 * Register command: Creates user and sets the username in the config JSON file.
 * Throws an error if user is already registered.
 */
export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
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
 * Throws an error if no users in users table.
 */
export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    // Selects all users from the users table
    const allUsers = await getUsers();

    // Exit program if no users
    if (allUsers.length === 0) {
        throw new Error("Error: No users.");
    }

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
 * Reset command: Deletes all users from the users table.
 */
export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    // Deletes all rows from users table.
    await resetTable();

    // Success message
    console.log("Users table reset successfully.");
}
