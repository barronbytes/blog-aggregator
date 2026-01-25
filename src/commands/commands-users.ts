import { readConfig, updateUsername } from "../file-handling.js";
import { createUser, getUsers, getUserByName, resetTable } from "../db/db-users-queries.js";


/**
 * register command: Creates user in users table and sets their username for tracking new database operations.
 * Username stored in ./data/configs/.db-user-connection.json file.
 * Throws an error if user is already registered.
 */
export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    // Set username from args
    const username = args[0];

    // Exit program if user previously registered
    const existingUser = await getUserByName(username);
    if (existingUser) {
        throw new Error(`User "${username}" already exists in users table.`);
    }

    // Create new user and set user in the config
    const newUser = await createUser(username);
    updateUsername(username);

    // Success messages
    console.log(`Success: User "${username}" saved to users table and set their username for tracking new database operations.`);
}


/**
 * users command: Returns all users from the users table.
 * Throws an error if no users in users table.
 */
export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    // Selects all users from the users table
    const allUsers = await getUsers();

    // Exit program if no users
    if (allUsers.length === 0) {
        throw new Error("No users.");
    }

    // Selects current username
    const currentUserName = readConfig().currentUserName;

    // Success message
    console.log("Success: all usernames in users table:");
    const output = allUsers.map(user => {
        const marker = user.name === currentUserName ? " (current)" : "";
        return `* ${user.name}${marker}`;
    }).join("\n");
    console.log(output);
}


/*
* login command: Updates username stored for tracking new database operations.
* Username stored in ./data/configs/.db-user-connection.json file.
* Throws an error if user is not registered.
*/
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    // Set username from args
    const username = args[0];

    // Exit program if user not registered
    const user = await getUserByName(username);
    if (!user) {
        throw new Error(`User "${username}" does not exist.`);
    }

    // Set current user in the config
    updateUsername(username);

    // Success message
    console.log(`Success: Updated "${username}" as the current user for tracking new database operations.`);
}


/**
 * reset command: Deletes all users from the users table.
 */
export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    // Deletes all rows from users table.
    await resetTable();

    // Success message
    console.log("Success: Deleted all users from the users table.");
}
