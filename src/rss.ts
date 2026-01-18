/**
 * Reference material:
 * XML parsing: https://www.npmjs.com/package/fast-xml-parser
 * Spread operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 * Spread operator: https://basarat.gitbook.io/typescript/future-javascript/spread-operator
 */
import { XMLParser } from "fast-xml-parser";
import { z } from "zod";
import * as RssHttp from "./rss.http.js";
import * as RssZod from "./rss.types.js";


/* XML parser instance for converting XML strings to JS objects. */
const parser = new XMLParser();


/* Fetches an RSS feed from the given URL. */
export async function fetchFeed(requestURL: string): Promise<RssZod.RSSFeed> {

    try {
        // Fetch RSS feed
        const response = await fetch(requestURL, RssHttp.settingsGET);

        // Failure: non-2xx response codes
        if (!response.ok) throw new Error(`HTTP Error: status code: ${response.status}.`);

        // Failure: empty response
        const xmlString = await response.text();
        if (!xmlString.trim()) throw new Error(`Fetch Error: empty XML response.`);

        // Parse and validate fetch response
        const parsedXML = parser.parse(xmlString);
        const validatedXML = RssZod.RawFeedSchema.parse(parsedXML);
        const channel = validatedXML.rss.channel;

        // Create variable gauranteed to be an array of RSSItem[]
        let savedItems: RssZod.RSSItem[] = []; // defaults to empty array
        if (channel.item) {
            savedItems = Array.isArray(channel.item)
            ? channel.item : // if array, store as is
            [channel.item];  // if one item, cast as array
        }

        // Ensure variable contains all required fields
        const filteredItems = savedItems.filter(
            (item) => item.title && item.link && item.description && item.pubDate
        );

        // Create feed with normalized items array at rss.channel.item
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
