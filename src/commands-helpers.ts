import { readConfig } from "./file-handling.js";
import { getUserByName, User } from "./db-users-queries.js";


/* Logic to ensure a user exists.
 * Throws error if user does not exist.
 */
export async function getCurrentUser(): Promise<User> {
    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName);
    if (!user) throw new Error(`User "${userName}" does not exist.`);
    return user;
}
