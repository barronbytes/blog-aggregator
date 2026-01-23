import { fetchFeed } from "../api/rss.js";
import { normalizeTimeToMilliseconds } from "./commands-helpers.js";

// --------------------
// RSS API
// --------------------


/**
 * Aggregator command: Returns XML object for RSS feed.
 * fetchFeed() handles HTTP, Fetch, Validation, or Unknown errors.
 */
export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    // Determine input time in milliseconds and print timing message.
    const durationStr = args[0];
    const duration = normalizeTimeToMilliseconds(durationStr);
    console.log(`Collecting feeds every ${durationStr}.`);



    const requestURL = "https://www.wagslane.dev/index.xml";
    const rssXML = await fetchFeed(requestURL);

    // Success message
    console.log(JSON.stringify(rssXML, null, 2));
}
