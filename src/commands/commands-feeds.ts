import { createFeed, getFeeds } from "../db/db-feeds-queries.js";
import { createFeedFollow } from "../db/db-feeds-follows-queries.js";
import { getUserByID } from "../db/db-users-queries.js";
import { checkCurrentUser, printFeed } from "./commands-helpers.js";


/**
 * addfeed command: Creates feed record in feeds table and entry in feedsfollows table.
 * Throws an error if cannot create feed.
 */
export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    // Get table record values to pass
    const [name, url] = args;

    // Exit program if user not registered
    const user = await checkCurrentUser();

    // Create feed linked to user
    const feed = await createFeed(
        name,
        url,
        user.id,
    );

    // Create feed linked to user
    const feedFollow = await createFeedFollow(
        feed.id,
        user.id,
    );

    // Success message
    console.log("Success: New feed added to feeds table, and entry added to feeds_follows join table.");
    printFeed(feed, user);
}


/**
 * feeds command: Returns all feeds from the feeds table.
 */
export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
    // Selects all feeds from the feeds table
    const allFeeds = await getFeeds();
    const output: string[] = [];

    // FLAG: N+1 database query problem
    for (const feed of allFeeds) {
        const user = await getUserByID(feed.userId);
        const username = user ? user.name : "(unknown)";
        output.push(`* Feed name: ${feed.name}, Feed url: ${feed.url}, User: ${username}`);
    }

    // Success message
    console.log("Success: All names and urls in feeds table.");
    console.log(output.join("\n"));
}
