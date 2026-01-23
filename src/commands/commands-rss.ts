import { fetchFeed } from "../api/rss.js";
import { normalizeTimeToMilliseconds, scrapeFeeds, handleScrapeError, handleSignalCtrlC } from "./commands-helpers.js";


// --------------------
// RSS API
// --------------------


/**
 * Aggregator command: Returns XML object for RSS feed.
 */
export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    // Determine input time in milliseconds and print timing message.
    const timeStr = args[0];
    const timeBtwnRequests = normalizeTimeToMilliseconds(timeStr);
    console.log(`Collecting feeds every ${timeStr}.`);

    // Run once immediately; errors are logged but do not stop execution
    await scrapeFeeds().catch(handleScrapeError);

    // Schedule recurring scrape loop
    const interval = setInterval(
        () => { scrapeFeeds().catch(handleScrapeError); }, 
        timeBtwnRequests
    );

    // Exit setInterval() when user types Ctrl+C on command-line terminal
    await handleSignalCtrlC(interval);
}
