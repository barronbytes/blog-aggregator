import { readConfig } from "../file-handling.js";
import { User, getUserByName } from "../db/db-users-queries.js";
import { Feed, getFeedByUrl, getNextFeedToFetch, updateFetchedTime } from "../db/db-feeds-queries.js";
import { fetchFeed } from "../api/rss.js";
import { type RSSFeed } from "src/api/rss.types.js";


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
export async function checkFeedByUrl(feedUrl: string): Promise<Feed> {
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) throw new Error(`Feed url "${feedUrl}" does not exist.`);
    return feed;
}


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
    titles.forEach(title => console.log(title));
    return titles;
}


/* Aggregation function that fetches feed, marks it as fetched, prints item titles */
export async function scrapeFeeds(): Promise<void> {
    // Get the next feed to fetch.
    const feed = await checkFeedsByTimestamps();

    // Fetch feed XML.
    const requestURL = feed.url;
    const rssXML = await fetchFeed(requestURL);

    // Print titles of all feed items
    printFeedItemTitles(rssXML);
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
