import { fetchFeed } from "../api/rss.js";


// --------------------
// RSS API
// --------------------


/**
 * Aggregator command: Returns XML object for RSS feed.
 * fetchFeed() handles HTTP, Fetch, Validation, or Unknown errors.
 */
export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    const requestURL = "https://www.wagslane.dev/index.xml";
    const rssXML = await fetchFeed(requestURL);

    // Success message
    console.log(JSON.stringify(rssXML, null, 2));
}
