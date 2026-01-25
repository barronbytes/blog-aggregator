import { readConfig } from "../file-handling.js";
import { User, getUserByName } from "../db/db-users-queries.js";
import { Feed, getFeedByUrl, getFeedByName, getNextFeedToFetch, updateFetchedTime } from "../db/db-feeds-queries.js";
import { createPost } from "src/db/db-posts-queries.js";
import { fetchFeed } from "../api/rss.js";
import type { RSSFeed } from "src/api/rss.types.js";


// ------------------------------
// Multi-table helpers
// ------------------------------


/* Helper function to ensure user exists. */
export async function checkCurrentUser(): Promise<User> {
    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName);
    if (!user) throw new Error(`User "${userName}" does not exist.`);
    return user;
}


// ------------------------------
// For feeds table
// ------------------------------


/* Helper function to print user and feed information. */
export function printFeed(feed: Feed, user: User): void {
    console.log("New entry to feeds table:", JSON.stringify(feed, null, 2));
    console.log("New entry to users table:", JSON.stringify(user, null, 2));
}


// ------------------------------
// For feeds_follows table
// ------------------------------


/* Helper function to determine if feed name exists. */
export async function checkFeedByName(feedName: string): Promise<Feed> {
    const feed = await getFeedByName(feedName);
    if (!feed) throw new Error(`Feed name "${feedName}" not followed by user.`);
    return feed;
}


/* Helper function to determine if feed url exists. */
export async function checkFeedByUrl(feedUrl: string): Promise<Feed> {
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) throw new Error(`Feed url "${feedUrl}" not followed by user.`);
    return feed;
}


// ------------------------------
// For posts table
// ------------------------------


/* Helper function that returns next feed by timestamp to scrape. 
 * getNextFeedToFetch(): Retrieves null first. Then oldest timestamp.
 * updateFetchedTime(): Updates feeed timestamps fetch time.
 */
async function checkFeedsByTimestamps(): Promise<Feed> {
    // Get the next feed to fetch.
    const feed = await getNextFeedToFetch();
    if (!feed) throw new Error('No feeds available to fetch.');
    await updateFetchedTime(feed.id);
    return feed;
}

/* Helper function to print field item titles if present in rss feed. */
function printFeedItemTitles(rssFeed: RSSFeed): string[] {
    const titles = rssFeed.rss.channel.item.map(item => item.title);
    titles.forEach(title => console.log(`- ${title}`));
    return titles;
}


/* Helper function to parse input duration time and units of "1s", "1m", "1h" into milliseconds. */
export function normalizeTimeToMilliseconds(durationStr: string): number {
    // Catch a match for expected regex pattern.
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) throw new Error(`Invalid duration string: ${durationStr}. Expected format: <number><ms|s|m|h>`);

    // Catch numerical value and units from match.
    const value = Number(match[1]);
    const unit = match[2];

    // Use match results to normalize time numerical value to milleseconds.
    switch (unit) {
        case "ms": return value;
        case "s": return value * 1000;
        case "m": return value * 1000 * 60;
        case "h": return value * 1000 * 60 * 60;
        default: throw new Error(`Unknown duration unit: ${unit}.`);
    }
}


/* 
 * Aggregation function that fetches the next feed, retrieves its posts,
 * and saves them to the database. Each post is guaranteed by fetchFeed()
 * to have the required fields. Individual insert failures are caught
 * and logged without stopping the rest of the items.
 */
export async function scrapeFeeds(): Promise<void> {
    // Get the next feed to fetch.
    const feed = await checkFeedsByTimestamps();

    // Fetch normalized rss data and use it to retrieve feed items.
    const requestURL = feed.url;
    const rssXML = await fetchFeed(requestURL);
    const items = rssXML.rss.channel.item;

    // Save each valid post to the database.
    for (const item of items) {
        try {
            const publishedAt = new Date(item.pubDate);
            await createPost(item.title, item.link, item.description, publishedAt, feed.id);
        } catch (err) {
            console.error(`Failed to save post "${item.title}":`, err);
        }
    }
}


/**
 * Centralized error handler for scrapeFeeds(), which is async and cannot use try-catch blocks.
 * Use with: scrapeFeeds().catch(handleScrapeError), which can handle aync errors.
 * Logs errors without exiting the process.
 */
export function handleScrapeError(err: unknown): void {
    console.error("Error scraping feeds:", err);
}


/**
 * Helper function that listens for the SIGINT signal (sent by the terminal on Ctrl+C),
 * then clears the provided setInterval() and allows the process to exit cleanly.
 */
export async function handleSignalCtrlC(interval: NodeJS.Timeout): Promise<void> {
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}
