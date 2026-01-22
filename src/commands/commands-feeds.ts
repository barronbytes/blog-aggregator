import { createFeed, getFeeds } from "../db-feeds-queries.js";
import { createFeedFollow } from "../db-feeds-follows-queries.js";
import { getUserByID } from "../db-users-queries.js";
import { getCurrentUser, printFeed } from "./commands-helpers.js";


/**
 * addfeed command: Creates feed record in feeds table and entry in feedsfollows table.
 * Throws an error if cannot create feed.
 */
export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    // Get table record values to pass
    const [name, url] = args;

    // Exit program if user not registered
    const user = await getCurrentUser();

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
    console.log("Feed added successfully:");
    printFeed(feed, user);
}


/**
 * Feeds command: Selects all feeds from the feeds table.
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
    console.log(output.join("\n"));
}
