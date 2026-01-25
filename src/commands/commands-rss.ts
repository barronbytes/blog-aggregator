import * as Helpers from "./commands-helpers.js";
import { getPostsForUser } from "src/db/db-posts-queries.js";


/**
 * Usage: npm run start agg timeString
 * Accepts time string that runs loop that saves feed items in posts table.
 * Feeds are scraped in order of last_fetched_at values of NULL first, then oldest NON-NULL timestamp next.
 * User can type "Ctrl+C" to terminate loop.
 */
export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    // Determine input time in milliseconds and print timing message.
    const timeStr = args[0];
    const timeBtwnRequests = Helpers.normalizeTimeToMilliseconds(timeStr);
    console.log(`Collecting feeds every ${timeStr}.`);

    // Run once immediately; errors are logged but do not stop execution.
    await Helpers.scrapeFeeds().catch(Helpers.handleScrapeError);

    // Schedule recurring scrape loop
    const interval = setInterval(
        () => { Helpers.scrapeFeeds().catch(Helpers.handleScrapeError); }, 
        timeBtwnRequests
    );

    // Exit setInterval() when user types Ctrl+C on command-line terminal.
    await Helpers.handleSignalCtrlC(interval);
}


/**
 * Usage: npm run start browse limitString 
 * Returns posts from users based upon limit provided. Stops for invalid limit.
 */
export async function handlerBrowse(cmdName: string, ...args: string[]): Promise<void> {
    // Parses input limit to a number.
    const limitStr = args[0];
    const limit = Number(args[0]);

    if(isNaN(limit) || limit < 0) {
        console.warn(`Invalid limit "${args[0]}" provided. Must provide a non-negative number.`);
        return;
    }

    // Get the current user.
    const user = await Helpers.checkCurrentUser();

    // Fetch posts from the user with the provided limit.
    const posts = await getPostsForUser(user.id, limit);

    // Exits early if no posts. Otherwise prints post information.
    if (!posts || posts.length === 0) {
        console.log("No posts found for your followed feeds.");
        return;
    }

    console.log(`Showing the latest ${posts.length} posts for ${user.name}:`);
    for (const post of posts) {
        console.log(`- post(title: ${post.title}, url: ${post.url}, pubDate: ${post.publishedAt})`);
    }
}
