import { createFeedFollow, getFeedFollow, getFeedIdsFollowedByUserId, deleteFeedFollow } from "../db/db-feeds-follows-queries.js";
import { getFeedByName, getFeedNameById } from "../db/db-feeds-queries.js";
import { readConfig } from "../file-handling.js";
import { checkCurrentUser, checkFeedByName } from "./commands-helpers.js";


/**
 * Usage: npm run start follow feedName
 * Adds feed followed by user in the feeds_follows table.
 * Throws an error if cannot add record.
 */
export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    // Get feed and user name from command-line input and config file, respectively
    const feedName = args[0];
    const userName = readConfig().currentUserName;

    // Exit program if user or feed not registered
    const user = await checkCurrentUser();
    const feed = await getFeedByName(feedName);
    if (!feed) {
        throw new Error(`Feed "${feedName}" does not exist.`);
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
    console.log(`Success: Feed "${feed.name}" now followed by "${user.name}".`);
}


/**
 * Usage: npm run start following
 * Returns all feed names followed by the current user in the feeds_follows table.
 * Returns an empty array if no feeds are followed.
 */
export async function handlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
    // Retrieve name of current user logged in session
    const username = readConfig().currentUserName;

    // Exit program if user not registered
    const user = await checkCurrentUser();

    // Get feed IDs user follows
    const feedIds = await getFeedIdsFollowedByUserId(user.id);

    // Normalize feed names per field id
    const feedNames = (await Promise.all(
        feedIds.map(feedId => getFeedNameById(feedId))
    )).filter((name): name is string => Boolean(name));

    // Success message
    console.log(`Success: All feeds followed by ${username}:`)
    console.log(`- ${feedNames.join(", ")}`);
}


/**
 * Usage: npm run start unfollow feedName
 * Allows user to unfollow a feed, deleting related entry from feeds_follows table.
 * Sends error message if user did not follow supplied feed name.
 */
export async function handlerUnfollow(cmdName: string, ...args: string[]): Promise<void> {
    // Retrieve feed by feed name
    const feedName = args[0];
    const feed = await checkFeedByName(feedName);

    // Retrieve current user
    const user = await checkCurrentUser();

    // Deletes all rows from users table.
    await deleteFeedFollow(feed.id, user.id);

    // Success message
    console.log(`Success: User ${user.name} no longer follows feed ${feed.name}.`);
}
