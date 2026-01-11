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

        // Ensure channel.item is always an array
        let itemsArray: RssZod.RSSItem[] = [];              // defaults to empty array
        if (validatedXML.channel.item) {
            if (Array.isArray(validatedXML.channel.item)) { // already array => store as array
                itemsArray = validatedXML.channel.item;
            } else {                                        // single item => store as array
                itemsArray = [validatedXML.channel.item];
            }
        }

        // Create feed with normalized items array
        const normalizedXML: RssZod.RSSFeed = {
            ...validatedXML,                // shallow copy
            channel: {
                ...validatedXML.channel,    // shallow copy
                item: itemsArray,           // overwrite validatedXML.channel.item
            },
        }

        // Keep only items that have all required fields
        normalizedXML.channel.item = normalizedXML.channel.item.filter(
            item => item.title && item.link && item.description && item.pubDate
        );

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
