import { readConfig } from "../file-handling.js";
import { User, getUserByName } from "../db-users-queries.js";
import { Feed } from "../db-feeds-queries.js";


/* Logic to ensure a user exists.
 * Throws error if user does not exist.
 */
export async function getCurrentUser(): Promise<User> {
    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName);
    if (!user) throw new Error(`User "${userName}" does not exist.`);
    return user;
}


/* Helper function to print user and feed information */
export function printFeed(feed: Feed, user: User): void {
    console.log("Feed:", JSON.stringify(feed, null, 2));
    console.log("User:", JSON.stringify(user, null, 2));
}
