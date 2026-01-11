import { z } from "zod";
import * as RssHttp from "./rss.http.js";
import * as RssZod from "./rss.types.js";




export async function fetchFeed(requestURL: string): Promise<RssZod.RSSFeed> {
    try {
        const response = await fetch(requestURL, RssHttp.settingsGET);
        if (!response.ok) throw new Error(`HTTP Error: status code: ${response.status}.`);

        const xmlString = await response.text();
        if (!xmlString.trim()) throw new Error(`HTTP Error: empty XML response.`);

        const parsedXML = RssHttp.parser.parse(xmlString);
        const validatedXML = RssZod.RSSFeedSchema.parse(parsedXML);

        return validatedXML;
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation failure: ${JSON.stringify(error.issues)}`);
        } else if (error instanceof Error) {
            throw new Error(`Fetch/HTTP failure: ${error.message}`);
        } else {
            throw new Error(`Unexpected error: ${String(error)}`);
        }
    }
}
