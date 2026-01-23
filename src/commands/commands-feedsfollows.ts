import { createFeedFollow, getFeedFollow, getFollowedFeedIds, deleteEntry } from "../db/db-feeds-follows-queries.js";
import { Feed, getFeedByUrl, getFeedNameById } from "../db/db-feeds-queries.js";
import { readConfig } from "../file-handling.js";
import { checkCurrentUser, checkFeedByUrl } from "./commands-helpers.js";


/**
 * follow command: Creates joint table record in feeds_follows table.
 * Throws an error if cannot add record.
 */
export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    // Get feed and user name from command-line input and config file, respectively
    const feedUrl = args[0];
    const userName = readConfig().currentUserName;

    // Exit program if user or feed not registered
    const user = await checkCurrentUser();
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) {
        throw new Error(`Error: Feed "${feedUrl}" does not exist.`);
    }

    // Exit program if entry with feed.id and user.id already exists in feeds_follows table
    const existsFeedFollow = await getFeedFollow(feed.id, user.id);
    if (existsFeedFollow) {
        console.log(`User "${user.name}" already follows "${feed.name}".`);
        return;
    }

    // Create feed linked to user
    const feedFollow = await createFeedFollow(
        feed.id,
        user.id,
    );

    // Success message
    console.log("User followed feed successfully:");
    console.log(`Feed: ${feed.name}, User: ${user.name}`);
}


/**
 * following command: Returns feed names the current user follows in the feeds_follows table.
 * Returns an empty array if no feeds are followed.
 */
export async function handlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
    // Retrieve name of current user logged in session
    const userName = readConfig().currentUserName;

    // Exit program if user not registered
    const user = await checkCurrentUser();

    // Get feed IDs user follows
    const feedIds = await getFollowedFeedIds(user.id);

    // Normalize feed names per field id
    const feedNames = (await Promise.all(
        feedIds.map(feedId => getFeedNameById(feedId))
    )).filter((name): name is string => Boolean(name));

    // Success message
    console.log(`Feeds followed: ${feedNames.join(", ")}`);
}


/**
 * unfollow command: Removes entry in feeds_follows table with supplied feed url by user.
 * Sends error message if user did not follow supplied feed url.
 */
export async function handlerUnfollow(cmdName: string, ...args: string[]): Promise<void> {
    // Retrieve feed by feed url
    const feedUrl = args[0];
    const feed = await checkFeedByUrl(feedUrl);

    // Retrieve current user
    const user = await checkCurrentUser();

    // Deletes all rows from users table.
    await deleteEntry(feed.id, user.id);

    // Success message
    console.log("Successfully removed entry from feed_follows table.");
}
