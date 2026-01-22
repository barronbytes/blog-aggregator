import { readConfig } from "../file-handling.js";
import { User, getUserByName } from "../db/db-users-queries.js";
import { Feed, getFeedByUrl } from "../db/db-feeds-queries.js";


/* Helper function to ensure user exists. */
export async function checkCurrentUser(): Promise<User> {
    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName);
    if (!user) throw new Error(`User "${userName}" does not exist.`);
    return user;
}


/* Helper function to print user and feed information. */
export function printFeed(feed: Feed, user: User): void {
    console.log("Feed:", JSON.stringify(feed, null, 2));
    console.log("User:", JSON.stringify(user, null, 2));
}


/* Helper function to determine if feed url exists. */
export async function checkField(feedUrl: string): Promise<Feed> {
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) throw new Error(`Feed url "${feedUrl}" does not exist.`);
    return feed;
}
