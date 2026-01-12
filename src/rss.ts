import { z } from "zod";
import * as RssHttp from "./rss.http.js";
import * as RssZod from "./rss.types.js";


/* Fetches an RSS feed from the given URL. */
export async function fetchFeed(requestURL: string): Promise<RssZod.RSSFeed> {

    try {
        // Fetch RSS feed
        const response = await fetch(requestURL, RssHttp.settingsGET);
        if (!response.ok) throw new Error(`HTTP Error: status code: ${response.status}.`);

        const xmlString = await response.text();
        if (!xmlString.trim()) throw new Error(`Fetch Error: empty XML response.`);

        // Parse and validate fetch response
        const parsedXML = RssHttp.parser.parse(xmlString);
        const validatedXML = RssZod.RSSFeedSchema.parse(parsedXML);

        const channel = validatedXML.rss.channel;

        // Ensure rss.channel.item is always an array
        let savedItems: RssZod.RSSItem[] = []; // defaults to empty array
        if (channel.item) {
            savedItems = Array.isArray(channel.item)
            ? channel.item : // if array, store as is
            [channel.item];  // if one item, cast as array
        }

        // Ensure rss.channel.item contains all required fields
        const filteredItems = savedItems.filter(
            (item) => item.title && item.link && item.description && item.pubDate
        );

        // Create feed with normalized items array
        const normalizedXML: RssZod.RSSFeed = {
            rss: {
                ...validatedXML.rss,        // shallow copy
                channel: {
                    ...channel,             // shallow copy
                    item: filteredItems,    // overwrite
                },
            },
        }

        // Return normalized feed with only valid items
        return normalizedXML;
    }

    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation Error: ${JSON.stringify(error.issues)}`);
        } else if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(`Unexpected Error: ${String(error)}`);
        }
    }
}
